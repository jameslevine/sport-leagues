import { SportType } from './sport';

export enum RoundStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum ParticipantStatus {
  REGISTERED = 'REGISTERED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export interface Venue {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Round {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  roundId: string;
  leagueId: string;
  sportType: SportType;
  scheduledDate: string;
  scheduledTime: string;
  venue: Venue;
  status: RoundStatus;
  minPlayers: number;
  maxPlayers: number;
  currentPlayers: number;
  entryFee: number;
  registrationDeadline: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoundParticipant {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  roundId: string;
  userId: string;
  paymentId: string;
  paymentStatus: PaymentStatus;
  status: ParticipantStatus;
  joinedAt: string;
}
