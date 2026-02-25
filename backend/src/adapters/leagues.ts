import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import {
  League,
  LeagueMember,
  LeagueMemberRole,
  LeagueMemberStatus,
} from '../types/league';
import { SportType } from '../types/sport';
import { dynamodb } from '../lib/dynamodb';

const createPK = (sportType: SportType) => `LEAGUE#${sportType}`;
const createSK = (leagueId: string) => `LEAGUE#${leagueId}`;
const createGSI1PK = (region: string) => `LEAGUE#${region}`;

const createMemberPK = (sportType: SportType) => `LEAGUEMEMBER#${sportType}`;
const createMemberSK = (leagueId: string, userId: string) =>
  `LEAGUE#${leagueId}#USER#${userId}`;
const createMemberGSI1PK = (userId: string) => `USER#${userId}`;

export const getDbLeagueById = async (
  sportType: SportType,
  leagueId: string,
): Promise<League | undefined> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUES,
    Key: {
      pk: createPK(sportType),
      sk: createSK(leagueId),
    },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as League | undefined;
  } catch (error) {
    console.error('Error fetching league by ID:', error);
    throw error;
  }
};

export const getDbLeaguesBySport = async (
  sportType: SportType,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  leagues: League[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUES,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': createPK(sportType),
    },
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      leagues: (response.Items || []) as League[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

export const getDbLeaguesByRegion = async (
  region: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  leagues: League[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUES,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': createGSI1PK(region),
    },
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      leagues: (response.Items || []) as League[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching leagues by region:', error);
    throw error;
  }
};

export const createDbLeague = async (league: League): Promise<League> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUES,
    Item: league,
    ConditionExpression: 'attribute_not_exists(pk)',
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return league;
  } catch (error) {
    console.error('Error creating league:', error);
    throw error;
  }
};

export const updateDbLeague = async (
  sportType: SportType,
  leagueId: string,
  updates: Partial<League>,
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
    TableName: TABLE_NAMES.LEAGUES,
    Key: {
      pk: createPK(sportType),
      sk: createSK(leagueId),
    },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error updating league:', error);
    throw error;
  }
};

// League Members

export const getDbLeagueMember = async (
  sportType: SportType,
  leagueId: string,
  userId: string,
): Promise<LeagueMember | undefined> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUE_MEMBERS,
    Key: {
      pk: createMemberPK(sportType),
      sk: createMemberSK(leagueId, userId),
    },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as LeagueMember | undefined;
  } catch (error) {
    console.error('Error fetching league member:', error);
    throw error;
  }
};

export const getDbLeagueMembers = async (
  sportType: SportType,
  leagueId: string,
  limit: number = 50,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  members: LeagueMember[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUE_MEMBERS,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
    ExpressionAttributeValues: {
      ':pk': createMemberPK(sportType),
      ':skPrefix': `LEAGUE#${leagueId}`,
    },
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      members: (response.Items || []) as LeagueMember[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching league members:', error);
    throw error;
  }
};

export const getDbUserLeagues = async (
  userId: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  members: LeagueMember[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUE_MEMBERS,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': createMemberGSI1PK(userId),
    },
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      members: (response.Items || []) as LeagueMember[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching user leagues:', error);
    throw error;
  }
};

export const createDbLeagueMember = async (
  sportType: SportType,
  leagueId: string,
  userId: string,
  role: LeagueMemberRole = LeagueMemberRole.MEMBER,
): Promise<LeagueMember> => {
  const now = dayjs().toISOString();
  const member: LeagueMember = {
    pk: createMemberPK(sportType),
    sk: createMemberSK(leagueId, userId),
    gsi1pk: createMemberGSI1PK(userId),
    gsi1sk: `LEAGUE#${leagueId}`,
    leagueId,
    userId,
    role,
    joinedAt: now,
    status: LeagueMemberStatus.ACTIVE,
  };

  const params = {
    TableName: TABLE_NAMES.LEAGUE_MEMBERS,
    Item: member,
    ConditionExpression: 'attribute_not_exists(pk)',
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return member;
  } catch (error) {
    console.error('Error creating league member:', error);
    throw error;
  }
};

export const deleteDbLeagueMember = async (
  sportType: SportType,
  leagueId: string,
  userId: string,
): Promise<void> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUE_MEMBERS,
    Key: {
      pk: createMemberPK(sportType),
      sk: createMemberSK(leagueId, userId),
    },
  };

  try {
    await dynamodb.send(new DeleteCommand(params));
  } catch (error) {
    console.error('Error deleting league member:', error);
    throw error;
  }
};

export const incrementDbLeagueMemberCount = async (
  sportType: SportType,
  leagueId: string,
  increment: number = 1,
): Promise<void> => {
  const params = {
    TableName: TABLE_NAMES.LEAGUES,
    Key: {
      pk: createPK(sportType),
      sk: createSK(leagueId),
    },
    UpdateExpression: 'SET memberCount = memberCount + :inc, updatedAt = :now',
    ExpressionAttributeValues: {
      ':inc': increment,
      ':now': dayjs().toISOString(),
    },
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error incrementing league member count:', error);
    throw error;
  }
};
