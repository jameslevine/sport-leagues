import { Request, Response } from 'express';
import Stripe from 'stripe';
import dayjs from 'dayjs';

import { HTTP_STATUS } from '../constants';
import { stripe } from '../lib/stripe';
import {
  getDbPaymentById,
  getDbPaymentsByUser,
  updateDbPaymentStatus,
} from '../adapters/payments';
import {
  updateDbRoundParticipantStatus,
  incrementDbRoundPlayerCount,
} from '../adapters/rounds';
import { ParticipantStatus, PaymentStatus } from '../types/round';
import { PaymentStatusType } from '../types/payment';

/**
 * Stripe webhook handler
 * Handles payment_intent.succeeded and payment_intent.payment_failed events
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // For development without webhook signature verification
      event = req.body as Stripe.Event;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Webhook signature verification failed',
    });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

        const { sportType, paymentId, roundId, userId } =
          paymentIntent.metadata;

        if (paymentId && sportType) {
          // Update payment status
          await updateDbPaymentStatus(
            sportType,
            paymentId,
            'SUCCEEDED' as PaymentStatusType,
          );

          // Update participant status to CONFIRMED
          if (roundId && userId) {
            await updateDbRoundParticipantStatus(
              sportType as any,
              roundId,
              userId,
              ParticipantStatus.CONFIRMED,
              PaymentStatus.PAID,
            );
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`PaymentIntent failed: ${paymentIntent.id}`);

        const { sportType, paymentId, roundId, userId } =
          paymentIntent.metadata;

        if (paymentId && sportType) {
          await updateDbPaymentStatus(
            sportType,
            paymentId,
            'FAILED' as PaymentStatusType,
          );

          // Cancel participant registration
          if (roundId && userId) {
            await updateDbRoundParticipantStatus(
              sportType as any,
              roundId,
              userId,
              ParticipantStatus.CANCELLED,
            );

            // Decrement player count
            await incrementDbRoundPlayerCount(sportType as any, roundId, -1);
          }
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge refunded: ${charge.id}`);
        // Refund processing is handled by the process-rounds Lambda
        // This is just for logging/auditing
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error processing webhook',
    });
  }
};

/**
 * Get user's payment history
 */
export const getMyPayments = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const userId = req.user.sub;
    const { limit } = req.query;

    const result = await getDbPaymentsByUser(
      userId,
      limit ? parseInt(limit as string) : undefined,
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching payments',
    });
  }
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { sport, paymentId } = req.params;
    const sportType = sport.toUpperCase();

    const payment = await getDbPaymentById(sportType, paymentId);
    if (!payment) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching payment',
    });
  }
};
