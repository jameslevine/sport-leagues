import { SportType } from './sport';

export interface GolfHoleScore {
  hole: number;
  par: number;
  strokes: number;
  putts: number;
}

export interface GolfScoreData {
  holes: GolfHoleScore[];
  totalStrokes: number;
  totalPutts: number;
  handicapIndex: number;
  courseHandicap: number;
  netScore: number;
  courseName: string;
  courseRating: number;
  slopeRating: number;
}

export type ScoreData = GolfScoreData;

export interface Score {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  gsi2pk: string;
  gsi2sk: string;
  scoreId: string;
  roundId: string;
  leagueId: string;
  matchId: string;
  userId: string;
  sportType: SportType;
  scoreData: ScoreData;
  totalScore: number;
  verified: boolean;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}
