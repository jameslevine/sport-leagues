import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import dayjs from 'dayjs';

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE_NAME = process.env.WEBSOCKET_CONNECTIONS_TABLE!;
const TTL_HOURS = 24;

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId!;

  // Extract userId from query string (passed during WebSocket connect)
  const userId = event.queryStringParameters?.userId;

  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'userId required' }),
    };
  }

  const now = dayjs();

  try {
    await dynamodb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: `WSCONN#${userId}`,
          sk: `CONN#${connectionId}`,
          connectionId,
          userId,
          connectedAt: now.toISOString(),
          ttl: now.add(TTL_HOURS, 'hour').unix(),
        },
      }),
    );

    console.log(`WebSocket connected: ${connectionId} for user ${userId}`);

    return { statusCode: 200, body: 'Connected' };
  } catch (error) {
    console.error('Error saving connection:', error);
    return { statusCode: 500, body: 'Failed to connect' };
  }
};
