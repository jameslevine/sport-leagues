import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { TABLE_NAMES } from '../constants';
import { User } from '../types/user';
import { SportType } from '../types/sport';
import { dynamodb } from '../lib/dynamodb';

const createPK = (sportType: SportType) => `USER#${sportType}`;
const createSK = (userId: string) => `USER#${userId}`;
const createGSI1PK = (email: string) => `USER#${email}`;

export const getDbUserById = async (
  sportType: SportType,
  userId: string,
): Promise<User | undefined> => {
  const params = {
    TableName: TABLE_NAMES.USERS,
    Key: {
      pk: createPK(sportType),
      sk: createSK(userId),
    },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as User | undefined;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

export const getDbUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  const params = {
    TableName: TABLE_NAMES.USERS,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': createGSI1PK(email),
    },
    Limit: 1,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return response.Items?.[0] as User | undefined;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

export const createDbUser = async (user: User): Promise<User> => {
  const params = {
    TableName: TABLE_NAMES.USERS,
    Item: user,
    ConditionExpression: 'attribute_not_exists(pk)',
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateDbUser = async (
  sportType: SportType,
  userId: string,
  updates: Partial<User>,
): Promise<void> => {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (
      key !== 'pk' &&
      key !== 'sk' &&
      key !== 'gsi1pk' &&
      key !== 'gsi1sk' &&
      value !== undefined
    ) {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  if (updateExpressions.length === 0) return;

  const params = {
    TableName: TABLE_NAMES.USERS,
    Key: {
      pk: createPK(sportType),
      sk: createSK(userId),
    },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getDbUsersByUserIds = async (
  sportType: SportType,
  userIds: string[],
): Promise<User[]> => {
  const users: User[] = [];

  for (const userId of userIds) {
    const user = await getDbUserById(sportType, userId);
    if (user) {
      users.push(user);
    }
  }

  return users;
};
