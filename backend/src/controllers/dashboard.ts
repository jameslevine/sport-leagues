import { Request, Response } from 'express';
import dayjs from 'dayjs';

import { SportType } from '../types/sport';
import { HTTP_STATUS } from '../constants';
import { getDbUserById } from '../adapters/users';
import { getDbUserLeagues } from '../adapters/leagues';
import { getDbUserRoundParticipations } from '../adapters/rounds';
import { getDbMatchesByUser } from '../adapters/matches';
import { getDbScoresByUser } from '../adapters/scores';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    // Fetch data in parallel
    const [user, userLeagues, userParticipations, userMatches, userScores] =
      await Promise.all([
        getDbUserById(sportType, userId),
        getDbUserLeagues(userId),
        getDbUserRoundParticipations(userId),
        getDbMatchesByUser(userId),
        getDbScoresByUser(userId),
      ]);

    const now = dayjs();

    // Count leagues
    const leagueCount = userLeagues.members.length;

    // Count upcoming matches (scheduled or rescheduled, with future dates)
    const upcomingMatches = userMatches.matches.filter(
      (m) =>
        (m.status === 'SCHEDULED' || m.status === 'RESCHEDULED') &&
        dayjs(m.scheduledDate).isAfter(now),
    );

    // Count completed rounds (participations where status is not CANCELLED)
    const completedParticipations = userParticipations.participants.filter(
      (p) => p.status === 'CONFIRMED' || p.status === 'REGISTERED',
    );

    // Following count from user profile
    const followingCount = user?.followingCount || 0;

    // Rounds played (scores submitted)
    const roundsPlayed = userScores.scores?.length || 0;

    const stats = {
      leagueCount,
      upcomingMatchCount: upcomingMatches.length,
      followingCount,
      roundsPlayed,
      upcomingMatches: upcomingMatches.slice(0, 5).map((m) => ({
        matchId: m.matchId,
        roundId: m.roundId,
        scheduledDate: m.scheduledDate,
        scheduledTime: m.scheduledTime,
        status: m.status,
        groupNumber: m.groupNumber,
        players: m.players,
      })),
      recentLeagues: userLeagues.members.slice(0, 5).map((m) => ({
        leagueId: m.leagueId,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching dashboard stats',
    });
  }
};
