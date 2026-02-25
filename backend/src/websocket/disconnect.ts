import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE_NAME = process.env.WEBSOCKET_CONNECTIONS_TABLE!;

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId!;

  try {
    // We need to find the connection by connectionId
    // Since our PK is userId-based, we need to scan or use a GSI
    // For simplicity, we'll scan with a filter (in production, add a GSI on connectionId)
    const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
    const scanResult = await dynamodb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'connectionId = :connId',
        ExpressionAttributeValues: {
          ':connId': connectionId,
        },
      }),
    );

    if (scanResult.Items && scanResult.Items.length > 0) {
      const item = scanResult.Items[0];
      await dynamodb.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            pk: item.pk,
            sk: item.sk,
          },
        }),
      );
    }

    console.log(`WebSocket disconnected: ${connectionId}`);

    return { statusCode: 200, body: 'Disconnected' };
  } catch (error) {
    console.error('Error removing connection:', error);
    return { statusCode: 500, body: 'Failed to disconnect' };
  }
};
