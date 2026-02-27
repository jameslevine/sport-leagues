import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAppStore } from '../store';

const DASHBOARD_KEY = 'dashboard';

interface DashboardStats {
  leagueCount: number;
  upcomingMatchCount: number;
  followingCount: number;
  roundsPlayed: number;
  upcomingMatches: {
    matchId: string;
    roundId: string;
    scheduledDate: string;
    scheduledTime: string;
    status: string;
    groupNumber: number;
    players: { userId: string; displayName?: string }[];
  }[];
  recentLeagues: {
    leagueId: string;
    role: string;
    joinedAt: string;
  }[];
}

export const useDashboard = (options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();

  return useQuery({
    queryKey: [DASHBOARD_KEY, sport],
    queryFn: async () => {
      return apiClient.get<DashboardStats>(`/${sport}/dashboard`);
    },
    ...options,
  });
};
