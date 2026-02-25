import { Router } from 'express';
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
router.patch('/me', updateMe);
router.get('/:userId', getUserById);
router.post('/:userId/follow', followUser);
router.delete('/:userId/follow', unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
