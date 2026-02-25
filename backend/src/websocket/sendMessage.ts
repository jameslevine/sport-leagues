import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const CONNECTIONS_TABLE = process.env.WEBSOCKET_CONNECTIONS_TABLE!;
const MESSAGES_TABLE = process.env.CHAT_MESSAGES_TABLE!;
const CONVERSATIONS_TABLE = process.env.CONVERSATIONS_TABLE!;
const WEBSOCKET_ENDPOINT = process.env.WEBSOCKET_ENDPOINT!;

interface SendMessagePayload {
  action: string;
  conversationId: string;
  content: string;
  sportType: string;
}

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId!;

  try {
    const body: SendMessagePayload = JSON.parse(event.body || '{}');
    const { conversationId, content, sportType } = body;

    if (!conversationId || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'conversationId and content required',
        }),
      };
    }

    // Find the userId for this connection
    const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
    const scanResult = await dynamodb.send(
      new ScanCommand({
        TableName: CONNECTIONS_TABLE,
        FilterExpression: 'connectionId = :connId',
        ExpressionAttributeValues: { ':connId': connectionId },
        Limit: 1,
      }),
    );

    if (!scanResult.Items || scanResult.Items.length === 0) {
      return { statusCode: 401, body: 'Connection not found' };
    }

    const userId = scanResult.Items[0].userId as string;
    const now = dayjs().toISOString();
    const messageId = uuidv4();

    // Save message to DynamoDB
    await dynamodb.send(
      new PutCommand({
        TableName: MESSAGES_TABLE,
        Item: {
          pk: `CHATMESSAGE#${sportType || 'GOLF'}`,
          sk: `MSG#${now}#${messageId}`,
          gsi1pk: `CONVERSATION#${conversationId}`,
          gsi1sk: `MSG#${now}`,
          messageId,
          conversationId,
          userId,
          content,
          type: 'TEXT',
          createdAt: now,
        },
      }),
    );

    // Update conversation lastMessageAt
    await dynamodb.send(
      new UpdateCommand({
        TableName: CONVERSATIONS_TABLE,
        Key: {
          pk: `CONVERSATION#${sportType || 'GOLF'}`,
          sk: `CONVERSATION#${conversationId}`,
        },
        UpdateExpression: 'SET lastMessageAt = :now',
        ExpressionAttributeValues: { ':now': now },
      }),
    );

    // Get conversation to find participants
    const convResult = await dynamodb.send(
      new GetCommand({
        TableName: CONVERSATIONS_TABLE,
        Key: {
          pk: `CONVERSATION#${sportType || 'GOLF'}`,
          sk: `CONVERSATION#${conversationId}`,
        },
      }),
    );

    const participants = (convResult.Item?.participants as string[]) || [];

    // Broadcast to all connected participants
    const apiGw = new ApiGatewayManagementApiClient({
      endpoint: WEBSOCKET_ENDPOINT,
    });

    const messagePayload = Buffer.from(
      JSON.stringify({
        type: 'NEW_MESSAGE',
        conversationId,
        message: {
          messageId,
          conversationId,
          userId,
          content,
          type: 'TEXT',
          createdAt: now,
        },
      }),
    );

    for (const participantId of participants) {
      // Get all connections for this participant
      const connResult = await dynamodb.send(
        new QueryCommand({
          TableName: CONNECTIONS_TABLE,
          KeyConditionExpression: 'pk = :pk',
          ExpressionAttributeValues: {
            ':pk': `WSCONN#${participantId}`,
          },
        }),
      );

      for (const conn of connResult.Items || []) {
        try {
          await apiGw.send(
            new PostToConnectionCommand({
              ConnectionId: conn.connectionId as string,
              Data: messagePayload,
            }),
          );
        } catch (err: unknown) {
          const error = err as { statusCode?: number };
          if (error.statusCode === 410) {
            // Stale connection, remove it
            await dynamodb.send(
              new (await import('@aws-sdk/lib-dynamodb')).DeleteCommand({
                TableName: CONNECTIONS_TABLE,
                Key: { pk: conn.pk, sk: conn.sk },
              }),
            );
          }
        }
      }
    }

    return { statusCode: 200, body: 'Message sent' };
  } catch (error) {
    console.error('Error sending message:', error);
    return { statusCode: 500, body: 'Failed to send message' };
  }
};
