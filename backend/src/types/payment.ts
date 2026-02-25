export enum PaymentStatusType {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export interface Payment {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  gsi2pk: string;
  gsi2sk: string;
  paymentId: string;
  userId: string;
  roundId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatusType;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}
