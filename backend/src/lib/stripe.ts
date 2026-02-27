import Stripe from 'stripe';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const secretsManager = new SecretsManagerClient({ region: 'eu-west-1' });
const STRIPE_SECRET_NAME =
  process.env.STRIPE_SECRET_NAME || 'sport-leagues-dev/stripe-secret-key';

let stripeInstance: Stripe | null = null;

/**
 * Get Stripe instance, loading secret key from Secrets Manager on first call.
 * Falls back to STRIPE_SECRET_KEY env var if set.
 */
export async function getStripe(): Promise<Stripe> {
  if (stripeInstance) return stripeInstance;

  let secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    try {
      const response = await secretsManager.send(
        new GetSecretValueCommand({ SecretId: STRIPE_SECRET_NAME }),
      );
      secretKey = response.SecretString;
    } catch (err) {
      console.error('Failed to load Stripe secret from Secrets Manager:', err);
    }
  }

  stripeInstance = new Stripe(secretKey || '', {
    apiVersion: '2023-10-16',
  });

  return stripeInstance;
}

// Synchronous instance for backward compatibility (uses env var only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});
