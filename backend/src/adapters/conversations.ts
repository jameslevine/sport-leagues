import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import { Conversation, ChatMessage } from '../types/conversation';
import { SportType } from '../types/sport';
import { dynamodb } from '../lib/dynamodb';

const createConvPK = (sportType: SportType) => `CONVERSATION#${sportType}`;
const createConvSK = (conversationId: string) =>
  `CONVERSATION#${conversationId}`;

const createMsgPK = (sportType: SportType) => `CHATMESSAGE#${sportType}`;
const createMsgGSI1PK = (conversationId: string) =>
  `CONVERSATION#${conversationId}`;

export const getDbConversationById = async (
  sportType: SportType,
  conversationId: string,
): Promise<Conversation | undefined> => {
  const params = {
    TableName: TABLE_NAMES.CONVERSATIONS,
    Key: {
      pk: createConvPK(sportType),
      sk: createConvSK(conversationId),
    },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as Conversation | undefined;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

export const getDbConversationsByLeague = async (
  sportType: SportType,
  leagueId: string,
): Promise<Conversation[]> => {
  const params = {
    TableName: TABLE_NAMES.CONVERSATIONS,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': `LEAGUE#${leagueId}`,
    },
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return (response.Items || []) as Conversation[];
  } catch (error) {
    console.error('Error fetching conversations by league:', error);
    throw error;
  }
};

export const createDbConversation = async (
  conversation: Conversation,
): Promise<Conversation> => {
  const params = {
    TableName: TABLE_NAMES.CONVERSATIONS,
    Item: conversation,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const getDbChatMessagesByConversationId = async (
  sportType: SportType,
  conversationId: string,
  limit: number = 50,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  messages: ChatMessage[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.CHAT_MESSAGES,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': createMsgGSI1PK(conversationId),
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      messages: (response.Items || []) as ChatMessage[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

export const createDbChatMessage = async (
  message: ChatMessage,
): Promise<ChatMessage> => {
  const params = {
    TableName: TABLE_NAMES.CHAT_MESSAGES,
    Item: message,
  };

  try {
    await dynamodb.send(new PutCommand(params));

    // Update conversation lastMessageAt
    await dynamodb.send(
      new UpdateCommand({
        TableName: TABLE_NAMES.CONVERSATIONS,
        Key: {
          pk: message.pk.replace('CHATMESSAGE', 'CONVERSATION'),
          sk: `CONVERSATION#${message.conversationId}`,
        },
        UpdateExpression: 'SET lastMessageAt = :now',
        ExpressionAttributeValues: {
          ':now': message.createdAt,
        },
      }),
    );

    return message;
  } catch (error) {
    console.error('Error creating chat message:', error);
    throw error;
  }
};
