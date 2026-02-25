import { SportType } from './sport';

export enum LeagueCategory {
  OPEN = 'OPEN',
  WOMEN = 'WOMEN',
  KIDS = 'KIDS',
  BEGINNERS = 'BEGINNERS',
  SENIORS = 'SENIORS',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum LeagueMemberRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export enum LeagueMemberStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  LEFT = 'LEFT',
}

export interface LeagueLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
  address: string;
}

export interface League {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  leagueId: string;
  name: string;
  description: string;
  sportType: SportType;
  category: LeagueCategory;
  region: string;
  location: LeagueLocation;
  maxMembers: number;
  memberCount: number;
  entryFee: number;
  minPlayersPerRound: number;
  maxPlayersPerRound: number;
  rules?: string;
  imageUrl?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeagueMember {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  leagueId: string;
  userId: string;
  role: LeagueMemberRole;
  joinedAt: string;
  status: LeagueMemberStatus;
}
