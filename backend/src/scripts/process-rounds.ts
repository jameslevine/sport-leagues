/**
 * Scheduled Round Processing Lambda
 *
 * Runs daily via EventBridge to:
 * 1. Find rounds past their registration deadline
 * 2. If enough players → trigger match auto-scheduling
 * 3. If not enough players → cancel round and refund all participants
 *
 * Run manually: npx ts-node src/scripts/process-rounds.ts
 * Or deploy as Lambda triggered by EventBridge schedule
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import Stripe from 'stripe';
import dayjs from 'dayjs';

const client = new DynamoDBClient({ region: 'eu-west-1' });
const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const ROUNDS_TABLE = process.env.ROUNDS_TABLE || 'sport-leagues-dev-rounds';
const ROUND_PARTICIPANTS_TABLE =
  process.env.ROUND_PARTICIPANTS_TABLE ||
  'sport-leagues-dev-round-participants';
const PAYMENTS_TABLE =
  process.env.PAYMENTS_TABLE || 'sport-leagues-dev-payments';
const USERS_TABLE = process.env.USERS_TABLE || 'sport-leagues-dev-users';

// Import adapters and controllers - these use the shared dynamodb client
// For the Lambda, we import from the compiled dist
import {
  getDbRoundParticipants,
  updateDbRoundStatus,
  updateDbRoundParticipantStatus,
} from '../adapters/rounds';
import {
  getDbPaymentsByRound,
  updateDbPaymentStatus,
} from '../adapters/payments';
import { getDbUsersByUserIds } from '../adapters/users';
import { scheduleMatchesForRound } from '../controllers/matches';
import { sendNotificationToUsers } from '../lib/notifications';
import { SportType } from '../types/sport';
import {
  RoundStatus,
  ParticipantStatus,
  PaymentStatus,
  Round,
} from '../types/round';
import { NotificationType } from '../types/notification';
import { PaymentStatusType } from '../types/payment';

interface ProcessResult {
  roundId: string;
  leagueId: string;
  sportType: string;
  action: 'SCHEDULED' | 'CANCELLED' | 'SKIPPED' | 'ERROR';
  playerCount: number;
  minPlayers: number;
  matchesCreated?: number;
  refundsProcessed?: number;
  error?: string;
}

const SPORT_TYPES = ['GOLF', 'FOOTBALL', 'BASKETBALL', 'CRICKET'];

/**
 * Get all OPEN rounds for a given sport type
 */
const getOpenRounds = async (sportType: string): Promise<Round[]> => {
  const result = await dynamodb.send(
    new QueryCommand({
      TableName: ROUNDS_TABLE,
      KeyConditionExpression: 'pk = :pk',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':pk': `ROUND#${sportType}`,
        ':status': 'OPEN',
      },
    }),
  );

  return (result.Items || []) as Round[];
};

/**
 * Process refunds for all participants in a cancelled round
 */
const processRefundsForRound = async (
  sportType: string,
  roundId: string,
): Promise<number> => {
  let refundsProcessed = 0;

  // Get all payments for this round
  const payments = await getDbPaymentsByRound(roundId);
  const succeededPayments = payments.filter((p) => p.status === 'SUCCEEDED');

  for (const payment of succeededPayments) {
    try {
      // Process Stripe refund
      if (payment.stripePaymentIntentId) {
        await stripe.refunds.create({
          payment_intent: payment.stripePaymentIntentId,
          reason: 'requested_by_customer',
        });
      }

      // Update payment status in DynamoDB
      await updateDbPaymentStatus(
        sportType,
        payment.paymentId,
        'REFUNDED' as PaymentStatusType,
        'Round cancelled - insufficient players',
      );

      refundsProcessed++;
    } catch (error) {
      console.error(`Error refunding payment ${payment.paymentId}:`, error);
      // Continue processing other refunds even if one fails
    }
  }

  // Update all participant statuses to CANCELLED with REFUNDED payment
  const participants = await getDbRoundParticipants(
    sportType as SportType,
    roundId,
  );
  for (const participant of participants) {
    try {
      await updateDbRoundParticipantStatus(
        sportType as SportType,
        roundId,
        participant.userId,
        ParticipantStatus.CANCELLED,
        PaymentStatus.REFUNDED,
      );
    } catch (error) {
      console.error(`Error updating participant ${participant.userId}:`, error);
    }
  }

  return refundsProcessed;
};

/**
 * Send cancellation notifications to all participants
 */
const notifyCancellation = async (
  sportType: string,
  roundId: string,
  round: Round,
): Promise<void> => {
  try {
    const participants = await getDbRoundParticipants(
      sportType as SportType,
      roundId,
    );
    const userIds = participants.map((p) => p.userId);

    if (userIds.length === 0) return;

    const users = await getDbUsersByUserIds(sportType as SportType, userIds);

    await sendNotificationToUsers(
      users,
      NotificationType.ROUND_CANCELLED,
      'Round Cancelled',
      `The round scheduled for ${round.scheduledDate} at ${round.venue?.name || 'TBD'} has been cancelled due to insufficient players. Your entry fee will be refunded.`,
      { roundId, leagueId: round.leagueId },
    );
  } catch (error) {
    console.error('Error sending cancellation notifications:', error);
  }
};

/**
 * Send reminder notifications for rounds approaching their deadline
 */
const sendDeadlineReminders = async (
  sportType: string,
  round: Round,
): Promise<void> => {
  try {
    const participants = await getDbRoundParticipants(
      sportType as SportType,
      round.roundId,
    );
    const userIds = participants.map((p) => p.userId);

    if (userIds.length === 0) return;

    const users = await getDbUsersByUserIds(sportType as SportType, userIds);

    await sendNotificationToUsers(
      users,
      NotificationType.ROUND_CUTOFF_REMINDER,
      'Round Registration Closing Soon',
      `Registration for the round on ${round.scheduledDate} at ${round.venue?.name || 'TBD'} closes tomorrow. Currently ${round.currentPlayers}/${round.minPlayers} minimum players registered.`,
      { roundId: round.roundId, leagueId: round.leagueId },
    );
  } catch (error) {
    console.error('Error sending deadline reminders:', error);
  }
};

/**
 * Main handler - processes all rounds past their registration deadline
 */
export const handler = async (): Promise<{ results: ProcessResult[] }> => {
  const now = dayjs();
  const tomorrow = now.add(1, 'day');
  const results: ProcessResult[] = [];

  console.log(`Processing rounds at ${now.toISOString()}`);

  for (const sportType of SPORT_TYPES) {
    const openRounds = await getOpenRounds(sportType);

    for (const round of openRounds) {
      const deadline = dayjs(round.registrationDeadline);
      const roundId = round.roundId;
      const leagueId = round.leagueId;
      const currentPlayers = round.currentPlayers || 0;
      const minPlayers = round.minPlayers || 2;

      // Send reminder for rounds with deadline tomorrow
      if (
        deadline.isAfter(now) &&
        deadline.isBefore(tomorrow) &&
        currentPlayers < minPlayers
      ) {
        console.log(
          `Round ${roundId}: Sending deadline reminder (${currentPlayers}/${minPlayers} players)`,
        );
        await sendDeadlineReminders(sportType, round);
        continue;
      }

      // Skip rounds that haven't passed their deadline yet
      if (now.isBefore(deadline)) {
        continue;
      }

      // Round is past deadline - process it
      if (currentPlayers >= minPlayers) {
        // Enough players → schedule matches
        console.log(
          `Round ${roundId}: ${currentPlayers} players (min ${minPlayers}) → SCHEDULING MATCHES`,
        );

        try {
          const matches = await scheduleMatchesForRound(
            sportType as SportType,
            roundId,
          );

          results.push({
            roundId,
            leagueId,
            sportType,
            action: 'SCHEDULED',
            playerCount: currentPlayers,
            minPlayers,
            matchesCreated: matches.length,
          });
        } catch (error) {
          console.error(
            `Error scheduling matches for round ${roundId}:`,
            error,
          );
          results.push({
            roundId,
            leagueId,
            sportType,
            action: 'ERROR',
            playerCount: currentPlayers,
            minPlayers,
            error: (error as Error).message,
          });
        }
      } else {
        // Not enough players → cancel and refund
        console.log(
          `Round ${roundId}: ${currentPlayers} players (min ${minPlayers}) → CANCELLING & REFUNDING`,
        );

        try {
          // Update round status to CANCELLED
          await updateDbRoundStatus(
            sportType as SportType,
            roundId,
            RoundStatus.CANCELLED,
          );

          // Process refunds
          const refundsProcessed = await processRefundsForRound(
            sportType,
            roundId,
          );

          // Send cancellation notifications
          await notifyCancellation(sportType, roundId, round);

          results.push({
            roundId,
            leagueId,
            sportType,
            action: 'CANCELLED',
            playerCount: currentPlayers,
            minPlayers,
            refundsProcessed,
          });
        } catch (error) {
          console.error(`Error cancelling round ${roundId}:`, error);
          results.push({
            roundId,
            leagueId,
            sportType,
            action: 'ERROR',
            playerCount: currentPlayers,
            minPlayers,
            error: (error as Error).message,
          });
        }
      }
    }
  }

  const scheduled = results.filter((r) => r.action === 'SCHEDULED').length;
  const cancelled = results.filter((r) => r.action === 'CANCELLED').length;
  const errors = results.filter((r) => r.action === 'ERROR').length;

  console.log(`\nProcessing complete: ${results.length} rounds processed`);
  console.log(`  Scheduled: ${scheduled}`);
  console.log(`  Cancelled: ${cancelled}`);
  console.log(`  Errors: ${errors}`);

  return { results };
};

// Run directly if called as script
if (require.main === module) {
  handler().then(console.log).catch(console.error);
}
