import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { SportType } from '../types/sport';
import { League, LeagueMemberRole } from '../types/league';
import { HTTP_STATUS } from '../constants';
import {
  getDbLeagueById,
  getDbLeaguesBySport,
  getDbLeaguesByRegion,
  createDbLeague,
  updateDbLeague,
  getDbLeagueMember,
  getDbLeagueMembers,
  createDbLeagueMember,
  deleteDbLeagueMember,
  incrementDbLeagueMemberCount,
} from '../adapters/leagues';
import { getDbUsersByUserIds } from '../adapters/users';

export const getLeagues = async (req: Request, res: Response) => {
  try {
    const { sport } = req.params;
    const { region, limit } = req.query;
    const sportType = sport.toUpperCase() as SportType;

    let result;
    if (region) {
      result = await getDbLeaguesByRegion(
        region as string,
        limit ? parseInt(limit as string) : undefined,
      );
    } else {
      result = await getDbLeaguesBySport(
        sportType,
        limit ? parseInt(limit as string) : undefined,
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching leagues',
    });
  }
};

export const getLeagueById = async (req: Request, res: Response) => {
  try {
    const { sport, leagueId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const league = await getDbLeagueById(sportType, leagueId);
    if (!league) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'League not found' });
    }

    res.json(league);
  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching league',
    });
  }
};

export const createLeague = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;
    const now = dayjs().toISOString();
    const leagueId = uuidv4();

    const league: League = {
      pk: `LEAGUE#${sportType}`,
      sk: `LEAGUE#${leagueId}`,
      gsi1pk: `LEAGUE#${req.body.region}`,
      gsi1sk: `LEAGUE#${leagueId}`,
      leagueId,
      name: req.body.name,
      description: req.body.description,
      sportType,
      category: req.body.category,
      region: req.body.region,
      location: req.body.location,
      maxMembers: req.body.maxMembers,
      memberCount: 1,
      entryFee: req.body.entryFee,
      minPlayersPerRound: req.body.minPlayersPerRound,
      maxPlayersPerRound: req.body.maxPlayersPerRound,
      rules: req.body.rules,
      imageUrl: req.body.imageUrl,
      isActive: true,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };

    const createdLeague = await createDbLeague(league);

    // Add creator as admin member
    await createDbLeagueMember(
      sportType,
      leagueId,
      userId,
      LeagueMemberRole.ADMIN,
    );

    res.status(HTTP_STATUS.CREATED).json(createdLeague);
  } catch (error) {
    console.error('Error creating league:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating league',
    });
  }
};

export const updateLeague = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, leagueId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    // Check if user is admin
    const member = await getDbLeagueMember(sportType, leagueId, userId);
    if (!member || member.role !== LeagueMemberRole.ADMIN) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'Only admins can update the league' });
    }

    await updateDbLeague(sportType, leagueId, {
      ...req.body,
      updatedAt: dayjs().toISOString(),
    });

    res.json({ message: 'League updated successfully' });
  } catch (error) {
    console.error('Error updating league:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating league',
    });
  }
};

export const joinLeague = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, leagueId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    // Check if league exists
    const league = await getDbLeagueById(sportType, leagueId);
    if (!league) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'League not found' });
    }

    // Check if already a member
    const existingMember = await getDbLeagueMember(sportType, leagueId, userId);
    if (existingMember) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: 'Already a member of this league' });
    }

    // Check if league is full
    if (league.memberCount >= league.maxMembers) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'League is full' });
    }

    await createDbLeagueMember(sportType, leagueId, userId);
    await incrementDbLeagueMemberCount(sportType, leagueId, 1);

    res.json({ message: 'Joined league successfully' });
  } catch (error) {
    console.error('Error joining league:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error joining league',
    });
  }
};

export const leaveLeague = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, leagueId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    const member = await getDbLeagueMember(sportType, leagueId, userId);
    if (!member) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Not a member of this league' });
    }

    if (member.role === LeagueMemberRole.ADMIN) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({
          message: 'Admins cannot leave the league. Transfer ownership first.',
        });
    }

    await deleteDbLeagueMember(sportType, leagueId, userId);
    await incrementDbLeagueMemberCount(sportType, leagueId, -1);

    res.json({ message: 'Left league successfully' });
  } catch (error) {
    console.error('Error leaving league:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error leaving league',
    });
  }
};

export const getLeagueMembers = async (req: Request, res: Response) => {
  try {
    const { sport, leagueId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const result = await getDbLeagueMembers(sportType, leagueId);

    // Get user details for each member
    const userIds = result.members.map((m) => m.userId);
    const users = await getDbUsersByUserIds(sportType, userIds);

    const membersWithUsers = result.members.map((member) => {
      const user = users.find((u) => u.userId === member.userId);
      return {
        ...member,
        user: user
          ? {
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              displayName: user.displayName,
              avatarUrl: user.avatarUrl,
            }
          : null,
      };
    });

    res.json({ members: membersWithUsers });
  } catch (error) {
    console.error('Error fetching league members:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching league members',
    });
  }
};
