import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAppStore } from '../store';

const LEAGUES_KEY = 'leagues';

interface League {
  leagueId: string;
  name: string;
  description: string;
  sportType: string;
  category: string;
  region: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
    address: string;
  };
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
}

export const useLeagues = (options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [LEAGUES_KEY, sport],
    queryFn: async () => {
      const response = await apiClient.get<{ leagues: League[] }>(
        `/${sport}/leagues`,
      );
      return response.leagues ?? [];
    },
    ...options,
  });
};

export const useLeague = (leagueId: string, options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [LEAGUES_KEY, sport, leagueId],
    queryFn: async () => {
      return apiClient.get<League>(`/${sport}/leagues/${leagueId}`);
    },
    enabled: !!leagueId,
    ...options,
  });
};

export const useLeagueMembers = (leagueId: string, options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [LEAGUES_KEY, sport, leagueId, 'members'],
    queryFn: async () => {
      return apiClient.get<{ members: unknown[] }>(
        `/${sport}/leagues/${leagueId}/members`,
      );
    },
    enabled: !!leagueId,
    ...options,
  });
};

export const useCreateLeague = () => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useMutation({
    mutationFn: async (data: Partial<League>) => {
      return apiClient.post<League>(`/${sport}/leagues`, data);
    },
  });
};

export const useJoinLeague = (leagueId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useMutation({
    mutationFn: async () => {
      return apiClient.post(`/${sport}/leagues/${leagueId}/join`);
    },
  });
};

export const useLeaveLeague = (leagueId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useMutation({
    mutationFn: async () => {
      return apiClient.delete(`/${sport}/leagues/${leagueId}/leave`);
    },
  });
};
