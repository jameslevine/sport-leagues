import { Router } from 'express';
import { validateBody, validateParams } from '../middleware/validation';
import { userParamsSchema, userUpdateBodySchema } from '../models/user';
import { sportParamsSchema } from '../models/league';
import {
  getMe,
  updateMe,
  getUserById,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../controllers/users';

export const router = Router({ mergeParams: true });

router.get('/me', getMe);
router.patch('/me', validateBody(userUpdateBodySchema), updateMe);
router.get('/:userId', validateParams(userParamsSchema), getUserById);
router.post('/:userId/follow', validateParams(userParamsSchema), followUser);
router.delete(
  '/:userId/follow',
  validateParams(userParamsSchema),
  unfollowUser,
);
router.get(
  '/:userId/followers',
  validateParams(userParamsSchema),
  getFollowers,
);
router.get(
  '/:userId/following',
  validateParams(userParamsSchema),
  getFollowing,
);
