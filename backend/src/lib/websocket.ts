import { DeleteCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import { WebSocketConnection } from '../types/notification';
import { dynamodb } from './dynamodb';

const WEBSOCKET_ENDPOINT = process.env.WEBSOCKET_ENDPOINT!;
const TTL_HOURS = 24;

export const saveConnection = async (
  connectionId: string,
  userId: string,
): Promise<void> => {
  const now = dayjs();
  const connection: WebSocketConnection = {
    pk: `WSCONN#${userId}`,
    sk: `CONN#${connectionId}`,
    connectionId,
    userId,
    connectedAt: now.toISOString(),
    ttl: now.add(TTL_HOURS, 'hour').unix(),
  };

  await dynamodb.send(
    new PutCommand({
      TableName: TABLE_NAMES.WEBSOCKET_CONNECTIONS,
      Item: connection,
    }),
  );
};

export const removeConnection = async (
  connectionId: string,
  userId: string,
): Promise<void> => {
  await dynamodb.send(
    new DeleteCommand({
      TableName: TABLE_NAMES.WEBSOCKET_CONNECTIONS,
      Key: {
        pk: `WSCONN#${userId}`,
        sk: `CONN#${connectionId}`,
      },
    }),
  );
};

export const getConnectionsByUserId = async (
  userId: string,
): Promise<WebSocketConnection[]> => {
  const response = await dynamodb.send(
    new QueryCommand({
      TableName: TABLE_NAMES.WEBSOCKET_CONNECTIONS,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `WSCONN#${userId}`,
      },
    }),
  );

  return (response.Items || []) as WebSocketConnection[];
};

export const broadcastToUsers = async (
  userIds: string[],
  message: Record<string, unknown>,
): Promise<void> => {
  const client = new ApiGatewayManagementApiClient({
    endpoint: WEBSOCKET_ENDPOINT,
  });

  const payload = Buffer.from(JSON.stringify(message));

  for (const userId of userIds) {
    const connections = await getConnectionsByUserId(userId);

    for (const conn of connections) {
      try {
        await client.send(
          new PostToConnectionCommand({
            ConnectionId: conn.connectionId,
            Data: payload,
          }),
        );
      } catch (error: unknown) {
        const err = error as { statusCode?: number };
        if (err.statusCode === 410) {
          // Connection is stale, remove it
          await removeConnection(conn.connectionId, userId);
        } else {
          console.error(
            `Error sending to connection ${conn.connectionId}:`,
            error,
          );
        }
      }
    }
  }
};

export const broadcastToConversation = async (
  participantIds: string[],
  message: Record<string, unknown>,
): Promise<void> => {
  await broadcastToUsers(participantIds, {
    type: 'NEW_MESSAGE',
    ...message,
  });
};
