export enum NotificationType {
  ROUND_STARTING = 'ROUND_STARTING',
  ROUND_CUTOFF_REMINDER = 'ROUND_CUTOFF_REMINDER',
  MATCH_SCHEDULED = 'MATCH_SCHEDULED',
  MATCH_RESCHEDULED = 'MATCH_RESCHEDULED',
  MATCH_STARTING = 'MATCH_STARTING',
  MATCH_COMPLETED = 'MATCH_COMPLETED',
  ROUND_CANCELLED = 'ROUND_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  LEAGUE_JOINED = 'LEAGUE_JOINED',
}

export enum NotificationChannel {
  PUSH = 'PUSH',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export interface Notification {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  notificationId: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  body: string;
  data?: Record<string, string>; // Additional data (e.g., matchId, roundId)
  sentAt?: string;
  createdAt: string;
}

export interface WebSocketConnection {
  pk: string;
  sk: string;
  connectionId: string;
  userId: string;
  connectedAt: string;
  ttl: number; // DynamoDB TTL for auto-cleanup
}
