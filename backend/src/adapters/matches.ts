import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import { Match, MatchStatus } from '../types/match';
import { SportType } from '../types/sport';
import { dynamodb } from '../lib/dynamodb';

const createPK = (sportType: SportType) => `MATCH#${sportType}`;
const createSK = (matchId: string) => `MATCH#${matchId}`;
const createGSI1PK = (roundId: string) => `ROUND#${roundId}`;
const createGSI2PK = (userId: string) => `USER#${userId}`;

export const getDbMatchById = async (
  sportType: SportType,
  matchId: string,
): Promise<Match | undefined> => {
  const params = {
    TableName: TABLE_NAMES.MATCHES,
    Key: {
      pk: createPK(sportType),
      sk: createSK(matchId),
    },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as Match | undefined;
  } catch (error) {
    console.error('Error fetching match:', error);
    throw error;
  }
};

export const getDbMatchesByRound = async (
  roundId: string,
): Promise<Match[]> => {
  const params = {
    TableName: TABLE_NAMES.MATCHES,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': createGSI1PK(roundId),
    },
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return (response.Items || []) as Match[];
  } catch (error) {
    console.error('Error fetching matches by round:', error);
    throw error;
  }
};

export const getDbMatchesByUser = async (
  userId: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  matches: Match[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.MATCHES,
    IndexName: 'gsi2',
    KeyConditionExpression: 'gsi2pk = :gsi2pk',
    ExpressionAttributeValues: {
      ':gsi2pk': createGSI2PK(userId),
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      matches: (response.Items || []) as Match[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching matches by user:', error);
    throw error;
  }
};

export const createDbMatch = async (match: Match): Promise<Match> => {
  const params = {
    TableName: TABLE_NAMES.MATCHES,
    Item: match,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return match;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const updateDbMatchSchedule = async (
  sportType: SportType,
  matchId: string,
  scheduledDate: string,
  scheduledTime: string,
  rescheduledBy: string,
): Promise<void> => {
  const now = dayjs().toISOString();
  const params = {
    TableName: TABLE_NAMES.MATCHES,
    Key: {
      pk: createPK(sportType),
      sk: createSK(matchId),
    },
    UpdateExpression:
      'SET scheduledDate = :date, scheduledTime = :time, #status = :status, rescheduledBy = :by, rescheduledAt = :at, updatedAt = :now',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':date': scheduledDate,
      ':time': scheduledTime,
      ':status': MatchStatus.RESCHEDULED,
      ':by': rescheduledBy,
      ':at': now,
      ':now': now,
    },
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error updating match schedule:', error);
    throw error;
  }
};

export const updateDbMatchStatus = async (
  sportType: SportType,
  matchId: string,
  status: MatchStatus,
): Promise<void> => {
  const params = {
    TableName: TABLE_NAMES.MATCHES,
    Key: {
      pk: createPK(sportType),
      sk: createSK(matchId),
    },
    UpdateExpression: 'SET #status = :status, updatedAt = :now',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':now': dayjs().toISOString(),
    },
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error updating match status:', error);
    throw error;
  }
};
