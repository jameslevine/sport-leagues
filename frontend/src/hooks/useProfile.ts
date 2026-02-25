import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAppStore } from '../store';

const PROFILE_KEY = 'profile';

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
  location?: { lat: number; lng: number; city: string; country: string };
  sportProfiles: Record<string, unknown>;
  notificationPreferences: {
    push: boolean;
    sms: boolean;
    email: boolean;
    phoneNumber?: string;
  };
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

export const useProfile = (options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [PROFILE_KEY, sport],
    queryFn: async () => {
      return apiClient.get<UserProfile>(`/${sport}/users/me`);
    },
    ...options,
  });
};

export const useUpdateProfile = () => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      return apiClient.patch(`/${sport}/users/me`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] });
    },
  });
};

export const useUserProfile = (userId: string, options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [PROFILE_KEY, sport, userId],
    queryFn: async () => {
      return apiClient.get<UserProfile>(`/${sport}/users/${userId}`);
    },
    enabled: !!userId,
    ...options,
  });
};

export const useFollowUser = (userId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useMutation({
    mutationFn: async () => {
      return apiClient.post(`/${sport}/users/${userId}/follow`);
    },
  });
};

export const useUnfollowUser = (userId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useMutation({
    mutationFn: async () => {
      return apiClient.delete(`/${sport}/users/${userId}/follow`);
    },
  });
};
