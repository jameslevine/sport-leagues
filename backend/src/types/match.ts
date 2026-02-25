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
  players: string[];
  groupNumber: number;
  scheduledDate: string;
  scheduledTime: string;
  venue: Venue;
  status: MatchStatus;
  groupChatId: string;
  scores: Record<string, number>;
  rescheduledBy?: string;
  rescheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}
