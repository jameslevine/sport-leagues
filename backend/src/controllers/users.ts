import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { SportType } from '../types/sport';
import { User } from '../types/user';
import { HTTP_STATUS } from '../constants';
import {
  getDbUserById,
  getDbUserByEmail,
  createDbUser,
  updateDbUser,
  getDbUsersByUserIds,
} from '../adapters/users';
import {
  createDbFollow,
  deleteDbFollow,
  getDbFollowers,
  getDbFollowing,
} from '../adapters/follows';

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    let user = await getDbUserById(sportType, userId);

    // Auto-create user on first access
    if (!user) {
      const now = dayjs().toISOString();
      const email =
        (req.user.email as string) ||
        (req.user['cognito:username'] as string) ||
        '';

      user = {
        pk: `USER#${sportType}`,
        sk: `USER#${userId}`,
        gsi1pk: `USER#${email}`,
        gsi1sk: `USER#${userId}`,
        userId,
        email,
        firstName: '',
        lastName: '',
        displayName: email.split('@')[0],
        sportProfiles: {},
        notificationPreferences: {
          push: true,
          sms: false,
          email: true,
        },
        followersCount: 0,
        followingCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      await createDbUser(user);
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching user profile',
    });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    const allowedFields = [
      'firstName',
      'lastName',
      'displayName',
      'avatarUrl',
      'location',
      'sportProfiles',
      'notificationPreferences',
    ];

    const updates: Partial<User> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = req.body[field];
      }
    }

    updates.updatedAt = dayjs().toISOString();

    await updateDbUser(sportType, userId, updates);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating profile',
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { sport, userId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const user = await getDbUserById(sportType, userId);
    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    // Return public profile (exclude sensitive fields)
    const publicProfile = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      location: user.location,
      sportProfiles: user.sportProfiles,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      createdAt: user.createdAt,
    };

    res.json(publicProfile);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching user',
    });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, userId: targetUserId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const followerId = req.user.sub;

    if (followerId === targetUserId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Cannot follow yourself' });
    }

    // Verify target user exists
    const targetUser = await getDbUserById(sportType, targetUserId);
    if (!targetUser) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    await createDbFollow(sportType, followerId, targetUserId);

    // Update follower/following counts
    await updateDbUser(sportType, targetUserId, {
      followersCount: (targetUser.followersCount || 0) + 1,
      updatedAt: dayjs().toISOString(),
    } as Partial<User>);

    const follower = await getDbUserById(sportType, followerId);
    if (follower) {
      await updateDbUser(sportType, followerId, {
        followingCount: (follower.followingCount || 0) + 1,
        updatedAt: dayjs().toISOString(),
      } as Partial<User>);
    }

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error following user',
    });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, userId: targetUserId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const followerId = req.user.sub;

    await deleteDbFollow(sportType, followerId, targetUserId);

    // Update counts
    const targetUser = await getDbUserById(sportType, targetUserId);
    if (targetUser) {
      await updateDbUser(sportType, targetUserId, {
        followersCount: Math.max((targetUser.followersCount || 0) - 1, 0),
        updatedAt: dayjs().toISOString(),
      } as Partial<User>);
    }

    const follower = await getDbUserById(sportType, followerId);
    if (follower) {
      await updateDbUser(sportType, followerId, {
        followingCount: Math.max((follower.followingCount || 0) - 1, 0),
        updatedAt: dayjs().toISOString(),
      } as Partial<User>);
    }

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error unfollowing user',
    });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { sport, userId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const result = await getDbFollowers(sportType, userId);

    // Get user details for each follower
    const followerIds = result.follows.map((f) => f.followerId);
    const users = await getDbUsersByUserIds(sportType, followerIds);

    const followers = users.map((u) => ({
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
    }));

    res.json({ followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching followers',
    });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { sport, userId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const result = await getDbFollowing(sportType, userId);

    const followingIds = result.follows.map((f) => f.followingId);
    const users = await getDbUsersByUserIds(sportType, followingIds);

    const following = users.map((u) => ({
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
    }));

    res.json({ following });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching following',
    });
  }
};
