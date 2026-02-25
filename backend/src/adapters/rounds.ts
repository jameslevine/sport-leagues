import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import {
  Round,
  RoundParticipant,
  RoundStatus,
  ParticipantStatus,
  PaymentStatus,
} from '../types/round';
import { SportType } from '../types/sport';
import { dynamodb } from '../lib/dynamodb';

const createPK = (sportType: SportType) => `ROUND#${sportType}`;
const createSK = (roundId: string) => `ROUND#${roundId}`;
const createGSI1PK = (leagueId: string) => `LEAGUE#${leagueId}`;
const createGSI1SK = (scheduledDate: string) => `ROUND#${scheduledDate}`;

const createParticipantPK = (sportType: SportType) =>
  `ROUNDPARTICIPANT#${sportType}`;
const createParticipantSK = (roundId: string, userId: string) =>
  `ROUND#${roundId}#USER#${userId}`;
const createParticipantGSI1PK = (userId: string) => `USER#${userId}`;

export const getDbRoundById = async (
  sportType: SportType,
  roundId: string,
): Promise<Round | undefined> => {
  const params = {
    TableName: TABLE_NAMES.ROUNDS,
    Key: {
      pk: createPK(sportType),
      sk: createSK(roundId),
    },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as Round | undefined;
  } catch (error) {
    console.error('Error fetching round by ID:', error);
    throw error;
  }
};

export const getDbRoundsByLeague = async (
  leagueId: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  rounds: Round[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.ROUNDS,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': createGSI1PK(leagueId),
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      rounds: (response.Items || []) as Round[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching rounds by league:', error);
    throw error;
  }
};

export const createDbRound = async (round: Round): Promise<Round> => {
  const params = {
    TableName: TABLE_NAMES.ROUNDS,
    Item: round,
    ConditionExpression: 'attribute_not_exists(pk)',
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return round;
  } catch (error) {
    console.error('Error creating round:', error);
    throw error;
  }
};

export const updateDbRoundStatus = async (
  sportType: SportType,
  roundId: string,
  status: RoundStatus,
): Promise<void> => {
  const params = {
    TableName: TABLE_NAMES.ROUNDS,
    Key: {
      pk: createPK(sportType),
      sk: createSK(roundId),
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
    console.error('Error updating round status:', error);
    throw error;
  }
};

export const incrementDbRoundPlayerCount = async (
  sportType: SportType,
  roundId: string,
  increment: number = 1,
): Promise<void> => {
  const params = {
    TableName: TABLE_NAMES.ROUNDS,
    Key: {
      pk: createPK(sportType),
      sk: createSK(roundId),
    },
    UpdateExpression:
      'SET currentPlayers = currentPlayers + :inc, updatedAt = :now',
    ExpressionAttributeValues: {
      ':inc': increment,
      ':now': dayjs().toISOString(),
    },
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error incrementing round player count:', error);
    throw error;
  }
};

// Round Participants

export const getDbRoundParticipant = async (
  sportType: SportType,
  roundId: string,
  userId: string,
): Promise<RoundParticipant | undefined> => {
  const params = {
    TableName: TABLE_NAMES.ROUND_PARTICIPANTS,
    Key: {
      pk: createParticipantPK(sportType),
      sk: createParticipantSK(roundId, userId),
    },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as RoundParticipant | undefined;
  } catch (error) {
    console.error('Error fetching round participant:', error);
    throw error;
  }
};

export const getDbRoundParticipants = async (
  sportType: SportType,
  roundId: string,
): Promise<RoundParticipant[]> => {
  const params = {
    TableName: TABLE_NAMES.ROUND_PARTICIPANTS,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :skPrefix)',
    ExpressionAttributeValues: {
      ':pk': createParticipantPK(sportType),
      ':skPrefix': `ROUND#${roundId}`,
    },
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return (response.Items || []) as RoundParticipant[];
  } catch (error) {
    console.error('Error fetching round participants:', error);
    throw error;
  }
};

export const createDbRoundParticipant = async (
  participant: RoundParticipant,
): Promise<RoundParticipant> => {
  const params = {
    TableName: TABLE_NAMES.ROUND_PARTICIPANTS,
    Item: participant,
    ConditionExpression: 'attribute_not_exists(pk)',
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return participant;
  } catch (error) {
    console.error('Error creating round participant:', error);
    throw error;
  }
};

export const updateDbRoundParticipantStatus = async (
  sportType: SportType,
  roundId: string,
  userId: string,
  status: ParticipantStatus,
  paymentStatus?: PaymentStatus,
): Promise<void> => {
  let updateExpression = 'SET #status = :status';
  const expressionAttributeNames: Record<string, string> = {
    '#status': 'status',
  };
  const expressionAttributeValues: Record<string, unknown> = {
    ':status': status,
  };

  if (paymentStatus) {
    updateExpression += ', paymentStatus = :paymentStatus';
    expressionAttributeValues[':paymentStatus'] = paymentStatus;
  }

  const params = {
    TableName: TABLE_NAMES.ROUND_PARTICIPANTS,
    Key: {
      pk: createParticipantPK(sportType),
      sk: createParticipantSK(roundId, userId),
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error updating round participant status:', error);
    throw error;
  }
};
