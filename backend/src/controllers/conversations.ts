import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { SportType } from '../types/sport';
import {
  Conversation,
  ChatMessage,
  ConversationType,
  MessageType,
} from '../types/conversation';
import { HTTP_STATUS } from '../constants';
import {
  getDbConversationById,
  getDbConversationsByLeague,
  getDbConversationsByUser,
  createDbConversation,
  getDbChatMessagesByConversationId,
  createDbChatMessage,
} from '../adapters/conversations';
import { getDbUsersByUserIds } from '../adapters/users';
import { broadcastToConversation } from '../lib/websocket';

export const getConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;
    const { limit } = req.query;

    const result = await getDbConversationsByUser(
      sportType,
      userId,
      limit ? parseInt(limit as string) : undefined,
    );

    res.json({
      conversations: result.conversations,
      lastEvaluatedKey: result.lastEvaluatedKey,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching conversations',
    });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;
    const now = dayjs().toISOString();
    const conversationId = uuidv4();

    // Ensure creator is in participants
    const participants = [...new Set([userId, ...req.body.participants])];

    const conversation: Conversation = {
      pk: `CONVERSATION#${sportType}`,
      sk: `CONVERSATION#${conversationId}`,
      gsi1pk: req.body.leagueId
        ? `LEAGUE#${req.body.leagueId}`
        : `USER#${userId}`,
      gsi1sk: `CONVERSATION#${conversationId}`,
      conversationId,
      leagueId: req.body.leagueId,
      type: req.body.type as ConversationType,
      participants,
      name: req.body.name,
      lastMessageAt: now,
      createdAt: now,
    };

    await createDbConversation(conversation);

    // Post system message
    const msgId = uuidv4();
    await createDbChatMessage({
      pk: `CHATMESSAGE#${sportType}`,
      sk: `MSG#${now}#${msgId}`,
      gsi1pk: `CONVERSATION#${conversationId}`,
      gsi1sk: `MSG#${now}`,
      messageId: msgId,
      conversationId,
      userId: 'SYSTEM',
      content: 'Conversation created',
      type: MessageType.SYSTEM,
      createdAt: now,
    });

    res.status(HTTP_STATUS.CREATED).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating conversation',
    });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, conversationId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;
    const { limit } = req.query;

    // Verify user is a participant
    const conversation = await getDbConversationById(sportType, conversationId);
    if (!conversation) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(userId)) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'Not a participant of this conversation' });
    }

    const result = await getDbChatMessagesByConversationId(
      sportType,
      conversationId,
      limit ? parseInt(limit as string) : undefined,
    );

    // Get user details for message senders
    const senderIds = [...new Set(result.messages.map((m) => m.userId))];
    const users = await getDbUsersByUserIds(
      sportType,
      senderIds.filter((id) => id !== 'SYSTEM'),
    );

    const userMap = users.reduce(
      (acc, u) => {
        acc[u.userId] = {
          userId: u.userId,
          displayName: u.displayName,
          firstName: u.firstName,
          lastName: u.lastName,
          avatarUrl: u.avatarUrl,
        };
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const messagesWithSenders = result.messages.map((msg) => ({
      ...msg,
      sender:
        msg.userId === 'SYSTEM'
          ? { userId: 'SYSTEM', displayName: 'System' }
          : userMap[msg.userId] || null,
    }));

    res.json({
      conversation,
      messages: messagesWithSenders,
      lastEvaluatedKey: result.lastEvaluatedKey,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching messages',
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, conversationId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    // Verify user is a participant
    const conversation = await getDbConversationById(sportType, conversationId);
    if (!conversation) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(userId)) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'Not a participant of this conversation' });
    }

    const now = dayjs().toISOString();
    const messageId = uuidv4();

    const message: ChatMessage = {
      pk: `CHATMESSAGE#${sportType}`,
      sk: `MSG#${now}#${messageId}`,
      gsi1pk: `CONVERSATION#${conversationId}`,
      gsi1sk: `MSG#${now}`,
      messageId,
      conversationId,
      userId,
      content: req.body.content,
      type: (req.body.type as MessageType) || MessageType.TEXT,
      createdAt: now,
    };

    await createDbChatMessage(message);

    // Broadcast to all connected participants via WebSocket
    try {
      await broadcastToConversation(conversation.participants, {
        conversationId,
        message: {
          ...message,
          sender: { userId },
        },
      });
    } catch (wsError) {
      // WebSocket broadcast failure shouldn't fail the API call
      console.error('WebSocket broadcast failed:', wsError);
    }

    res.status(HTTP_STATUS.CREATED).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error sending message',
    });
  }
};
