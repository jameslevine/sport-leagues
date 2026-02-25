import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAppStore } from '../store';

const MATCHES_KEY = 'matches';

interface Match {
  matchId: string;
  roundId: string;
  leagueId: string;
  sportType: string;
  players: string[];
  groupNumber: number;
  scheduledDate: string;
  scheduledTime: string;
  venue: { name: string; address: string; lat: number; lng: number };
  status: string;
  groupChatId: string;
  scores: Record<string, number>;
  playersWithDetails?: {
    userId: string;
    displayName: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    handicap?: number;
  }[];
}

export const useMyMatches = (options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [MATCHES_KEY, sport, 'me'],
    queryFn: async () => {
      const response = await apiClient.get<{ matches: Match[] }>(
        `/${sport}/matches/me`,
      );
      return response.matches ?? [];
    },
    ...options,
  });
};

export const useMatch = (matchId: string, options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [MATCHES_KEY, sport, matchId],
    queryFn: async () => {
      return apiClient.get<Match>(`/${sport}/matches/${matchId}`);
    },
    enabled: !!matchId,
    ...options,
  });
};

export const useRoundMatches = (roundId: string, options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [MATCHES_KEY, sport, 'round', roundId],
    queryFn: async () => {
      const response = await apiClient.get<{ matches: Match[] }>(
        `/${sport}/matches/round/${roundId}`,
      );
      return response.matches ?? [];
    },
    enabled: !!roundId,
    ...options,
  });
};

export const useRescheduleMatch = (matchId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      scheduledDate: string;
      scheduledTime: string;
    }) => {
      return apiClient.patch(`/${sport}/matches/${matchId}/reschedule`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATCHES_KEY] });
    },
  });
};

export const useTriggerMatchScheduling = (roundId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiClient.post(`/${sport}/matches/round/${roundId}/schedule`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATCHES_KEY] });
    },
  });
};
