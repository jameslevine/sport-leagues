/**
 * Scheduled Round Processing Lambda
 *
 * Runs daily via EventBridge to:
 * 1. Find rounds past their registration deadline
 * 2. If enough players → trigger match auto-scheduling
 * 3. If not enough players → cancel round and refund all
 *
 * Run manually: npx ts-node src/scripts/process-rounds.ts
 * Or deploy as Lambda triggered by EventBridge schedule
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import dayjs from 'dayjs';

const client = new DynamoDBClient({ region: 'eu-west-1' });
const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const ROUNDS_TABLE = process.env.ROUNDS_TABLE || 'sport-leagues-dev-rounds';
const ROUND_PARTICIPANTS_TABLE =
  process.env.ROUND_PARTICIPANTS_TABLE ||
  'sport-leagues-dev-round-participants';

interface ProcessResult {
  roundId: string;
  leagueId: string;
  action: 'SCHEDULED' | 'CANCELLED' | 'SKIPPED';
  playerCount: number;
  minPlayers: number;
}

export const handler = async (): Promise<{ results: ProcessResult[] }> => {
  const now = dayjs();
  const results: ProcessResult[] = [];

  console.log(`Processing rounds at ${now.toISOString()}`);

  // Scan for all OPEN rounds (in production, use a GSI on status + deadline)
  for (const sportType of ['GOLF', 'FOOTBALL', 'BASKETBALL', 'CRICKET']) {
    const scanResult = await dynamodb.send(
      new ScanCommand({
        TableName: ROUNDS_TABLE,
        FilterExpression: 'pk = :pk AND #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
          ':pk': `ROUND#${sportType}`,
          ':status': 'OPEN',
        },
      }),
    );

    for (const round of scanResult.Items || []) {
      const deadline = dayjs(round.registrationDeadline as string);

      // Skip rounds that haven't passed their deadline yet
      if (now.isBefore(deadline)) {
        continue;
      }

      const currentPlayers = (round.currentPlayers as number) || 0;
      const minPlayers = (round.minPlayers as number) || 2;
      const roundId = round.roundId as string;
      const leagueId = round.leagueId as string;

      if (currentPlayers >= minPlayers) {
        // Enough players - would trigger match scheduling here
        // In production, call scheduleMatchesForRound(sportType, roundId)
        console.log(
          `Round ${roundId}: ${currentPlayers} players (min ${minPlayers}) → SCHEDULING MATCHES`,
        );
        results.push({
          roundId,
          leagueId,
          action: 'SCHEDULED',
          playerCount: currentPlayers,
          minPlayers,
        });
      } else {
        // Not enough players - cancel and refund
        console.log(
          `Round ${roundId}: ${currentPlayers} players (min ${minPlayers}) → CANCELLING`,
        );
        // In production: update round status, process refunds, send notifications
        results.push({
          roundId,
          leagueId,
          action: 'CANCELLED',
          playerCount: currentPlayers,
          minPlayers,
        });
      }
    }
  }

  console.log(`\nProcessing complete: ${results.length} rounds processed`);
  console.log(
    `  Scheduled: ${results.filter((r) => r.action === 'SCHEDULED').length}`,
  );
  console.log(
    `  Cancelled: ${results.filter((r) => r.action === 'CANCELLED').length}`,
  );

  return { results };
};

// Run directly if called as script
if (require.main === module) {
  handler().then(console.log).catch(console.error);
}
