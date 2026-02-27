import { Router } from 'express';
import express from 'express';
import {
  handleStripeWebhook,
  getMyPayments,
  getPaymentById,
} from '../controllers/payments';

export const router = Router({ mergeParams: true });

// Stripe webhook needs raw body for signature verification
// This route should be mounted BEFORE express.json() middleware
// or use express.raw() specifically for this route
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook,
);

router.get('/', getMyPayments);
router.get('/:paymentId', getPaymentById);
