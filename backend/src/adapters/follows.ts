import { DeleteCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import { Follow } from '../types/follow';
import { SportType } from '../types/sport';
import { dynamodb } from '../lib/dynamodb';

const createPK = (sportType: SportType) => `FOLLOW#${sportType}`;
const createSK = (followerId: string, followingId: string) =>
  `FOLLOWER#${followerId}#FOLLOWING#${followingId}`;

export const getDbFollowers = async (
  sportType: SportType,
  followingId: string,
  limit: number = 50,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  follows: Follow[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.FOLLOWS,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': `FOLLOWING#${followingId}`,
    },
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      follows: (response.Items || []) as Follow[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

export const getDbFollowing = async (
  sportType: SportType,
  followerId: string,
  limit: number = 50,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  follows: Follow[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.FOLLOWS,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
    ExpressionAttributeValues: {
      ':pk': createPK(sportType),
      ':skPrefix': `FOLLOWER#${followerId}`,
    },
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      follows: (response.Items || []) as Follow[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};

export const createDbFollow = async (
  sportType: SportType,
  followerId: string,
  followingId: string,
): Promise<Follow> => {
  const now = dayjs().toISOString();
  const follow: Follow = {
    pk: createPK(sportType),
    sk: createSK(followerId, followingId),
    gsi1pk: `FOLLOWING#${followingId}`,
    gsi1sk: `FOLLOWER#${followerId}`,
    followerId,
    followingId,
    createdAt: now,
  };

  const params = {
    TableName: TABLE_NAMES.FOLLOWS,
    Item: follow,
    ConditionExpression: 'attribute_not_exists(pk)',
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return follow;
  } catch (error) {
    console.error('Error creating follow:', error);
    throw error;
  }
};

export const deleteDbFollow = async (
  sportType: SportType,
  followerId: string,
  followingId: string,
): Promise<void> => {
  const params = {
    TableName: TABLE_NAMES.FOLLOWS,
    Key: {
      pk: createPK(sportType),
      sk: createSK(followerId, followingId),
    },
  };

  try {
    await dynamodb.send(new DeleteCommand(params));
  } catch (error) {
    console.error('Error deleting follow:', error);
    throw error;
  }
};
