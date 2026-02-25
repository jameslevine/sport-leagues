import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import { Score } from '../types/score';
import { SportType } from '../types/sport';
import { dynamodb } from '../lib/dynamodb';

const createPK = (sportType: SportType) => `SCORE#${sportType}`;
const createSK = (roundId: string, userId: string) =>
  `ROUND#${roundId}#USER#${userId}`;

export const getDbScoresByRound = async (
  sportType: SportType,
  roundId: string,
): Promise<Score[]> => {
  const params = {
    TableName: TABLE_NAMES.SCORES,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
    ExpressionAttributeValues: {
      ':pk': createPK(sportType),
      ':skPrefix': `ROUND#${roundId}`,
    },
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return (response.Items || []) as Score[];
  } catch (error) {
    console.error('Error fetching scores by round:', error);
    throw error;
  }
};

export const getDbScoresByUser = async (
  userId: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{ scores: Score[]; lastEvaluatedKey?: Record<string, unknown> }> => {
  const params = {
    TableName: TABLE_NAMES.SCORES,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': `USER#${userId}`,
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      scores: (response.Items || []) as Score[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching scores by user:', error);
    throw error;
  }
};

export const getDbScoresByLeague = async (
  leagueId: string,
  limit: number = 50,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{ scores: Score[]; lastEvaluatedKey?: Record<string, unknown> }> => {
  const params = {
    TableName: TABLE_NAMES.SCORES,
    IndexName: 'gsi2',
    KeyConditionExpression: 'gsi2pk = :gsi2pk',
    ExpressionAttributeValues: {
      ':gsi2pk': `LEAGUE#${leagueId}`,
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      scores: (response.Items || []) as Score[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching scores by league:', error);
    throw error;
  }
};

export const createDbScore = async (score: Score): Promise<Score> => {
  const params = {
    TableName: TABLE_NAMES.SCORES,
    Item: score,
    ConditionExpression: 'attribute_not_exists(pk)',
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return score;
  } catch (error) {
    console.error('Error creating score:', error);
    throw error;
  }
};

export const updateDbScoreVerification = async (
  sportType: SportType,
  roundId: string,
  userId: string,
  verifiedBy: string,
): Promise<void> => {
  const params = {
    TableName: TABLE_NAMES.SCORES,
    Key: {
      pk: createPK(sportType),
      sk: createSK(roundId, userId),
    },
    UpdateExpression:
      'SET verified = :verified, verifiedBy = :verifiedBy, updatedAt = :now',
    ExpressionAttributeValues: {
      ':verified': true,
      ':verifiedBy': verifiedBy,
      ':now': dayjs().toISOString(),
    },
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error verifying score:', error);
    throw error;
  }
};
