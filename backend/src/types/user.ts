import { SportType } from './sport';

export interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface GolfProfile {
  handicapIndex: number;
  homeClub?: string;
  handicapVerified: boolean;
  handicapProvider?: string;
  handicapId?: string;
}

export type SportProfile = GolfProfile;

export interface NotificationPreferences {
  push: boolean;
  sms: boolean;
  email: boolean;
  phoneNumber?: string;
}

export interface User {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
  location?: Location;
  sportProfiles: Partial<Record<SportType, SportProfile>>;
  notificationPreferences: NotificationPreferences;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
}
