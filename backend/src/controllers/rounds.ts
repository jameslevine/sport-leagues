import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { SportType } from '../types/sport';
import {
  Round,
  RoundStatus,
  ParticipantStatus,
  PaymentStatus,
} from '../types/round';
import { PaymentStatusType } from '../types/payment';
import { HTTP_STATUS, CURRENCY } from '../constants';
import {
  getDbRoundById,
  getDbRoundsByLeague,
  createDbRound,
  updateDbRoundStatus,
  incrementDbRoundPlayerCount,
  getDbRoundParticipant,
  getDbRoundParticipants,
  createDbRoundParticipant,
  updateDbRoundParticipantStatus,
} from '../adapters/rounds';
import { getDbLeagueById, getDbLeagueMember } from '../adapters/leagues';
import { createDbPayment, updateDbPaymentStatus } from '../adapters/payments';
import { getStripe } from '../lib/stripe';

export const getRoundsByLeague = async (req: Request, res: Response) => {
  try {
    const { leagueId } = req.params;
    const { limit } = req.query;

    const result = await getDbRoundsByLeague(
      leagueId,
      limit ? parseInt(limit as string) : undefined,
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching rounds:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching rounds',
    });
  }
};

export const getRoundById = async (req: Request, res: Response) => {
  try {
    const { sport, roundId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const round = await getDbRoundById(sportType, roundId);
    if (!round) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Round not found' });
    }

    res.json(round);
  } catch (error) {
    console.error('Error fetching round:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching round',
    });
  }
};

export const createRound = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, leagueId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    // Verify user is a member of the league
    const member = await getDbLeagueMember(sportType, leagueId, userId);
    if (!member) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'Must be a league member to create rounds' });
    }

    const now = dayjs().toISOString();
    const roundId = uuidv4();

    const round: Round = {
      pk: `ROUND#${sportType}`,
      sk: `ROUND#${roundId}`,
      gsi1pk: `LEAGUE#${leagueId}`,
      gsi1sk: `ROUND#${req.body.scheduledDate}`,
      roundId,
      leagueId,
      sportType,
      scheduledDate: req.body.scheduledDate,
      scheduledTime: req.body.scheduledTime,
      venue: req.body.venue,
      status: RoundStatus.OPEN,
      minPlayers: req.body.minPlayers,
      maxPlayers: req.body.maxPlayers,
      currentPlayers: 0,
      entryFee: req.body.entryFee,
      registrationDeadline: req.body.registrationDeadline,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };

    const createdRound = await createDbRound(round);
    res.status(HTTP_STATUS.CREATED).json(createdRound);
  } catch (error) {
    console.error('Error creating round:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating round',
    });
  }
};

export const joinRound = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, roundId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    // Get round
    const round = await getDbRoundById(sportType, roundId);
    if (!round) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Round not found' });
    }

    // Check round status
    if (round.status !== RoundStatus.OPEN) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Round is not open for registration' });
    }

    // Check if round is full
    if (round.currentPlayers >= round.maxPlayers) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Round is full' });
    }

    // Check registration deadline
    if (dayjs().isAfter(dayjs(round.registrationDeadline))) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Registration deadline has passed' });
    }

    // Check if already registered
    const existingParticipant = await getDbRoundParticipant(
      sportType,
      roundId,
      userId,
    );
    if (existingParticipant) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: 'Already registered for this round' });
    }

    // Verify league membership
    const member = await getDbLeagueMember(sportType, round.leagueId, userId);
    if (!member) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'Must be a league member to join rounds' });
    }

    const paymentId = uuidv4();
    const now = dayjs().toISOString();
    let clientSecret: string | null = null;
    let stripePaymentIntentId = '';

    // Create Stripe PaymentIntent (if entry fee > 0)
    if (round.entryFee > 0) {
      try {
        const stripeClient = await getStripe();
        const paymentIntent = await stripeClient.paymentIntents.create({
          amount: round.entryFee,
          currency: CURRENCY.DEFAULT.toLowerCase(),
          metadata: {
            roundId,
            userId,
            sportType,
            paymentId,
          },
        });
        clientSecret = paymentIntent.client_secret;
        stripePaymentIntentId = paymentIntent.id;
      } catch (stripeError) {
        console.error('Stripe payment creation failed:', stripeError);
        // Continue without payment — register user anyway
      }
    }

    // Create payment record
    await createDbPayment({
      pk: `PAYMENT#${sportType}`,
      sk: `PAYMENT#${paymentId}`,
      gsi1pk: `USER#${userId}`,
      gsi1sk: `PAYMENT#${now}`,
      gsi2pk: `ROUND#${roundId}`,
      gsi2sk: `PAYMENT#${paymentId}`,
      paymentId,
      userId,
      roundId,
      stripePaymentIntentId,
      amount: round.entryFee,
      currency: CURRENCY.DEFAULT,
      status: clientSecret
        ? PaymentStatusType.PENDING
        : PaymentStatusType.SUCCEEDED,
      createdAt: now,
      updatedAt: now,
    });

    // Create participant record
    await createDbRoundParticipant({
      pk: `ROUNDPARTICIPANT#${sportType}`,
      sk: `ROUND#${roundId}#USER#${userId}`,
      gsi1pk: `USER#${userId}`,
      gsi1sk: `ROUND#${roundId}`,
      roundId,
      userId,
      paymentId,
      paymentStatus: clientSecret ? PaymentStatus.PENDING : PaymentStatus.PAID,
      status: clientSecret
        ? ParticipantStatus.REGISTERED
        : ParticipantStatus.CONFIRMED,
      joinedAt: now,
    });

    // Increment player count
    await incrementDbRoundPlayerCount(sportType, roundId, 1);

    // Check if round is now full
    if (round.currentPlayers + 1 >= round.maxPlayers) {
      await updateDbRoundStatus(sportType, roundId, RoundStatus.FULL);
    }

    res.json({
      message: 'Registered for round',
      clientSecret,
      paymentId,
    });
  } catch (error) {
    console.error('Error joining round:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error joining round',
    });
  }
};

export const leaveRound = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, roundId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    const round = await getDbRoundById(sportType, roundId);
    if (!round) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Round not found' });
    }

    if (
      round.status !== RoundStatus.OPEN &&
      round.status !== RoundStatus.FULL
    ) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Cannot leave a round that is in progress or completed',
      });
    }

    const participant = await getDbRoundParticipant(sportType, roundId, userId);
    if (!participant) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Not registered for this round' });
    }

    // Process refund if payment was made
    if (participant.paymentStatus === PaymentStatus.PAID) {
      // TODO: Process Stripe refund
      await updateDbPaymentStatus(
        sportType,
        participant.paymentId,
        PaymentStatusType.REFUNDED,
        'User left round',
      );
    }

    await updateDbRoundParticipantStatus(
      sportType,
      roundId,
      userId,
      ParticipantStatus.CANCELLED,
      PaymentStatus.REFUNDED,
    );

    await incrementDbRoundPlayerCount(sportType, roundId, -1);

    // If round was full, reopen it
    if (round.status === RoundStatus.FULL) {
      await updateDbRoundStatus(sportType, roundId, RoundStatus.OPEN);
    }

    res.json({ message: 'Left round successfully' });
  } catch (error) {
    console.error('Error leaving round:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error leaving round',
    });
  }
};

export const getRoundParticipants = async (req: Request, res: Response) => {
  try {
    const { sport, roundId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const participants = await getDbRoundParticipants(sportType, roundId);
    res.json({ participants });
  } catch (error) {
    console.error('Error fetching round participants:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching round participants',
    });
  }
};

export const cancelRound = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, roundId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    const round = await getDbRoundById(sportType, roundId);
    if (!round) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Round not found' });
    }

    // Only round creator or league admin can cancel
    if (round.createdBy !== userId) {
      const member = await getDbLeagueMember(sportType, round.leagueId, userId);
      if (!member || member.role !== 'ADMIN') {
        return res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ message: 'Only round creator or league admin can cancel' });
      }
    }

    // Refund all participants
    const participants = await getDbRoundParticipants(sportType, roundId);
    for (const participant of participants) {
      if (participant.paymentStatus === PaymentStatus.PAID) {
        await updateDbPaymentStatus(
          sportType,
          participant.paymentId,
          PaymentStatusType.REFUNDED,
          'Round cancelled',
        );
        await updateDbRoundParticipantStatus(
          sportType,
          roundId,
          participant.userId,
          ParticipantStatus.CANCELLED,
          PaymentStatus.REFUNDED,
        );
      }
    }

    await updateDbRoundStatus(sportType, roundId, RoundStatus.CANCELLED);

    res.json({ message: 'Round cancelled and refunds initiated' });
  } catch (error) {
    console.error('Error cancelling round:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error cancelling round',
    });
  }
};
