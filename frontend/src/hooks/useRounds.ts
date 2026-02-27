import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAppStore } from '../store';

const ROUNDS_KEY = 'rounds';

interface Round {
  roundId: string;
  leagueId: string;
  sportType: string;
  scheduledDate: string;
  scheduledTime: string;
  venue: { name: string; address: string };
  status: string;
  minPlayers: number;
  maxPlayers: number;
  currentPlayers: number;
  entryFee: number;
  registrationDeadline: string;
}

interface Participant {
  roundId: string;
  userId: string;
  paymentId: string;
  paymentStatus: string;
  status: string;
  joinedAt: string;
}

export const useRound = (roundId: string, options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  return useQuery({
    queryKey: [ROUNDS_KEY, sport, 'detail', roundId],
    queryFn: async () => {
      return apiClient.get<Round>(`/${sport}/rounds/${roundId}`);
    },
    enabled: !!roundId,
    ...options,
  });
};

export const useRoundParticipants = (roundId: string, options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  return useQuery({
    queryKey: [ROUNDS_KEY, sport, 'participants', roundId],
    queryFn: async () => {
      const res = await apiClient.get<{ participants: Participant[] }>(
        `/${sport}/rounds/${roundId}/participants`,
      );
      return res.participants ?? [];
    },
    enabled: !!roundId,
    ...options,
  });
};

export const useLeagueRounds = (leagueId: string, options = {}) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  return useQuery({
    queryKey: [ROUNDS_KEY, sport, leagueId],
    queryFn: async () => {
      const res = await apiClient.get<{ rounds: Round[] }>(
        `/${sport}/leagues/${leagueId}/rounds`,
      );
      return res.rounds ?? [];
    },
    enabled: !!leagueId,
    ...options,
  });
};

export const useJoinRound = (roundId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      apiClient.post<{ clientSecret: string; paymentId: string }>(
        `/${sport}/rounds/${roundId}/join`,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ROUNDS_KEY] });
    },
  });
};

export const useLeaveRound = (roundId: string) => {
  const sport = useAppStore((s) => s.selectedSport).toLowerCase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      apiClient.delete(`/${sport}/rounds/${roundId}/leave`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ROUNDS_KEY] });
    },
  });
};
