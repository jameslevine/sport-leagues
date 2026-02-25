import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { SportType } from '../types/sport';
import { Match, MatchStatus } from '../types/match';
import { RoundStatus } from '../types/round';
import { ConversationType, MessageType } from '../types/conversation';
import { NotificationType } from '../types/notification';
import { HTTP_STATUS, MATCH_CONFIG } from '../constants';
import {
  getDbMatchById,
  getDbMatchesByRound,
  getDbMatchesByUser,
  createDbMatch,
  updateDbMatchSchedule,
  updateDbMatchStatus,
} from '../adapters/matches';
import {
  getDbRoundById,
  getDbRoundParticipants,
  updateDbRoundStatus,
} from '../adapters/rounds';
import { getDbUserById, getDbUsersByUserIds } from '../adapters/users';
import {
  createDbConversation,
  createDbChatMessage,
} from '../adapters/conversations';
import { sendNotificationToUsers } from '../lib/notifications';
import { GolfProfile } from '../types/user';

/**
 * Auto-schedule matches for a round.
 * Groups participants by handicap (closest together), max 8 per group.
 * Creates a Match record and group chat for each group.
 */
export const scheduleMatchesForRound = async (
  sportType: SportType,
  roundId: string,
): Promise<Match[]> => {
  const round = await getDbRoundById(sportType, roundId);
  if (!round) throw new Error('Round not found');

  const participants = await getDbRoundParticipants(sportType, roundId);
  if (participants.length < round.minPlayers) {
    throw new Error('Not enough participants to schedule matches');
  }

  // Get user details with handicap info
  const userIds = participants.map((p) => p.userId);
  const users = await getDbUsersByUserIds(sportType, userIds);

  // Sort by handicap (ascending) for grouping by ability
  const sortedUsers = users.sort((a, b) => {
    const aHandicap =
      (a.sportProfiles?.[sportType] as GolfProfile)?.handicapIndex ?? 999;
    const bHandicap =
      (b.sportProfiles?.[sportType] as GolfProfile)?.handicapIndex ?? 999;
    return aHandicap - bHandicap;
  });

  // Chunk into groups of max MATCH_CONFIG.MAX_GROUP_SIZE
  const groups: string[][] = [];
  for (let i = 0; i < sortedUsers.length; i += MATCH_CONFIG.MAX_GROUP_SIZE) {
    const group = sortedUsers
      .slice(i, i + MATCH_CONFIG.MAX_GROUP_SIZE)
      .map((u) => u.userId);
    groups.push(group);
  }

  const now = dayjs().toISOString();
  const matches: Match[] = [];

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    const playerIds = groups[groupIndex];
    const matchId = uuidv4();
    const conversationId = uuidv4();

    // Create group chat for this match
    await createDbConversation({
      pk: `CONVERSATION#${sportType}`,
      sk: `CONVERSATION#${conversationId}`,
      gsi1pk: `LEAGUE#${round.leagueId}`,
      gsi1sk: `CONVERSATION#${conversationId}`,
      conversationId,
      leagueId: round.leagueId,
      type: ConversationType.GROUP,
      participants: playerIds,
      name: `Round Match - Group ${groupIndex + 1}`,
      lastMessageAt: now,
      createdAt: now,
    });

    // Post system message about the match
    const msgId = uuidv4();
    await createDbChatMessage({
      pk: `CHATMESSAGE#${sportType}`,
      sk: `MSG#${now}#${msgId}`,
      gsi1pk: `CONVERSATION#${conversationId}`,
      gsi1sk: `MSG#${now}`,
      messageId: msgId,
      conversationId,
      userId: 'SYSTEM',
      content: `Match scheduled for ${round.scheduledDate} at ${round.scheduledTime} at ${round.venue.name}. Good luck!`,
      type: MessageType.SYSTEM,
      createdAt: now,
    });

    // Create match record
    const match: Match = {
      pk: `MATCH#${sportType}`,
      sk: `MATCH#${matchId}`,
      gsi1pk: `ROUND#${roundId}`,
      gsi1sk: `MATCH#${matchId}`,
      gsi2pk: `USER#${playerIds[0]}`, // Index by first player for user queries
      gsi2sk: `MATCH#${round.scheduledDate}`,
      matchId,
      roundId,
      leagueId: round.leagueId,
      sportType,
      players: playerIds,
      groupNumber: groupIndex + 1,
      scheduledDate: round.scheduledDate,
      scheduledTime: round.scheduledTime,
      venue: round.venue,
      status: MatchStatus.SCHEDULED,
      groupChatId: conversationId,
      scores: {},
      createdAt: now,
      updatedAt: now,
    };

    await createDbMatch(match);
    matches.push(match);

    // Notify all players in this match
    const matchUsers = users.filter((u) => playerIds.includes(u.userId));
    const playerNames = matchUsers.map((u) => u.displayName).join(', ');
    await sendNotificationToUsers(
      matchUsers,
      NotificationType.MATCH_SCHEDULED,
      'Match Scheduled!',
      `You've been grouped for a match on ${round.scheduledDate} at ${round.scheduledTime} at ${round.venue.name}. Your group: ${playerNames}`,
      { matchId, roundId, conversationId },
    );
  }

  // Update round status
  await updateDbRoundStatus(sportType, roundId, RoundStatus.IN_PROGRESS);

  return matches;
};

// REST API Controllers

export const getMatchesByRound = async (req: Request, res: Response) => {
  try {
    const { roundId } = req.params;
    const matches = await getDbMatchesByRound(roundId);
    res.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching matches',
    });
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { sport, matchId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const match = await getDbMatchById(sportType, matchId);
    if (!match) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Match not found' });
    }

    // Get player details
    const users = await getDbUsersByUserIds(sportType, match.players);
    const playersWithDetails = users.map((u) => ({
      userId: u.userId,
      displayName: u.displayName,
      firstName: u.firstName,
      lastName: u.lastName,
      avatarUrl: u.avatarUrl,
      handicap: (u.sportProfiles?.[sportType] as GolfProfile)?.handicapIndex,
    }));

    res.json({ ...match, playersWithDetails });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching match',
    });
  }
};

export const getMyMatches = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const userId = req.user.sub;
    const { limit } = req.query;

    const result = await getDbMatchesByUser(
      userId,
      limit ? parseInt(limit as string) : undefined,
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching user matches:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching matches',
    });
  }
};

export const rescheduleMatch = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, matchId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;
    const { scheduledDate, scheduledTime } = req.body;

    const match = await getDbMatchById(sportType, matchId);
    if (!match) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Match not found' });
    }

    // Verify user is a participant
    if (!match.players.includes(userId)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: 'Only match participants can reschedule',
      });
    }

    // Update match schedule
    await updateDbMatchSchedule(
      sportType,
      matchId,
      scheduledDate,
      scheduledTime,
      userId,
    );

    // Post system message in group chat
    const now = dayjs().toISOString();
    const msgId = uuidv4();
    const user = await getDbUserById(sportType, userId);

    await createDbChatMessage({
      pk: `CHATMESSAGE#${sportType}`,
      sk: `MSG#${now}#${msgId}`,
      gsi1pk: `CONVERSATION#${match.groupChatId}`,
      gsi1sk: `MSG#${now}`,
      messageId: msgId,
      conversationId: match.groupChatId,
      userId: 'SYSTEM',
      content: `${user?.displayName || 'A player'} rescheduled the match to ${scheduledDate} at ${scheduledTime}`,
      type: MessageType.SYSTEM,
      createdAt: now,
    });

    // Notify other players
    const otherPlayerIds = match.players.filter((id) => id !== userId);
    const otherUsers = await getDbUsersByUserIds(sportType, otherPlayerIds);
    await sendNotificationToUsers(
      otherUsers,
      NotificationType.MATCH_RESCHEDULED,
      'Match Rescheduled',
      `${user?.displayName || 'A player'} rescheduled your match to ${scheduledDate} at ${scheduledTime}`,
      { matchId, roundId: match.roundId },
    );

    res.json({ message: 'Match rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling match:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error rescheduling match',
    });
  }
};

/**
 * Trigger match scheduling for a round (called when round closes or manually by admin)
 */
export const triggerMatchScheduling = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, roundId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const matches = await scheduleMatchesForRound(sportType, roundId);

    res.json({
      message: `${matches.length} matches scheduled`,
      matches,
    });
  } catch (error) {
    console.error('Error scheduling matches:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error scheduling matches',
    });
  }
};
