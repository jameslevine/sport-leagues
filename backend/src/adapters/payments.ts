import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import { Payment, PaymentStatusType } from '../types/payment';
import { dynamodb } from '../lib/dynamodb';

const createPK = (sportType: string) => `PAYMENT#${sportType}`;
const createSK = (paymentId: string) => `PAYMENT#${paymentId}`;

export const getDbPaymentById = async (
  sportType: string,
  paymentId: string,
): Promise<Payment | undefined> => {
  const params = {
    TableName: TABLE_NAMES.PAYMENTS,
    Key: {
      pk: createPK(sportType),
      sk: createSK(paymentId),
    },
  };

  try {
    const response = await dynamodb.send(new GetCommand(params));
    return response.Item as Payment | undefined;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

export const getDbPaymentsByUser = async (
  userId: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  payments: Payment[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.PAYMENTS,
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
      payments: (response.Items || []) as Payment[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching payments by user:', error);
    throw error;
  }
};

export const getDbPaymentsByRound = async (
  roundId: string,
): Promise<Payment[]> => {
  const params = {
    TableName: TABLE_NAMES.PAYMENTS,
    IndexName: 'gsi2',
    KeyConditionExpression: 'gsi2pk = :gsi2pk',
    ExpressionAttributeValues: {
      ':gsi2pk': `ROUND#${roundId}`,
    },
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return (response.Items || []) as Payment[];
  } catch (error) {
    console.error('Error fetching payments by round:', error);
    throw error;
  }
};

export const createDbPayment = async (payment: Payment): Promise<Payment> => {
  const params = {
    TableName: TABLE_NAMES.PAYMENTS,
    Item: payment,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updateDbPaymentStatus = async (
  sportType: string,
  paymentId: string,
  status: PaymentStatusType,
  refundReason?: string,
): Promise<void> => {
  let updateExpression = 'SET #status = :status, updatedAt = :now';
  const expressionAttributeNames: Record<string, string> = {
    '#status': 'status',
  };
  const expressionAttributeValues: Record<string, unknown> = {
    ':status': status,
    ':now': dayjs().toISOString(),
  };

  if (refundReason) {
    updateExpression += ', refundReason = :refundReason';
    expressionAttributeValues[':refundReason'] = refundReason;
  }

  const params = {
    TableName: TABLE_NAMES.PAYMENTS,
    Key: {
      pk: createPK(sportType),
      sk: createSK(paymentId),
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
