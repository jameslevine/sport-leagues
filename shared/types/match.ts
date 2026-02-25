import { SportType } from './sport';
import { Venue } from './round';

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  RESCHEDULED = 'RESCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Match {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  gsi2pk: string;
  gsi2sk: string;
  matchId: string;
  roundId: string;
  leagueId: string;
  sportType: SportType;
  players: string[]; // Array of userIds
  groupNumber: number; // Group number within the round
  scheduledDate: string;
  scheduledTime: string;
  venue: Venue;
  status: MatchStatus;
  groupChatId: string; // Auto-created conversation ID
  scores: Record<string, number>; // userId -> total score
  rescheduledBy?: string; // userId who last rescheduled
  rescheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}
