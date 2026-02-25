import { Router } from 'express';
import {
  submitScore,
  getRoundScores,
  getUserScores,
  verifyScore,
} from '../controllers/scores';

export const roundScoresRouter = Router({ mergeParams: true });
export const scoresRouter = Router({ mergeParams: true });

// Routes under /:sport/rounds/:roundId/scores
roundScoresRouter.post('/', submitScore);
roundScoresRouter.get('/', getRoundScores);

// Routes under /:sport/scores
scoresRouter.post('/:scoreId/verify', verifyScore);

// User scores (accessed via /:sport/users/:userId/scores)
export const userScoresRouter = Router({ mergeParams: true });
userScoresRouter.get('/', getUserScores);
