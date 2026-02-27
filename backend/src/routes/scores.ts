import { Router } from 'express';
import { validateBody, validateParams } from '../middleware/validation';
import {
  scoreParamsSchema,
  scoreRoundParamsSchema,
  scoreSubmitBodySchema,
  scoreVerifyBodySchema,
} from '../models/score';
import {
  submitScore,
  getRoundScores,
  getUserScores,
  verifyScore,
} from '../controllers/scores';

export const roundScoresRouter = Router({ mergeParams: true });
export const scoresRouter = Router({ mergeParams: true });

// Routes under /:sport/rounds/:roundId/scores
roundScoresRouter.post('/', validateBody(scoreSubmitBodySchema), submitScore);
roundScoresRouter.get('/', getRoundScores);

// Routes under /:sport/scores
scoresRouter.post(
  '/:scoreId/verify',
  validateParams(scoreParamsSchema),
  validateBody(scoreVerifyBodySchema),
  verifyScore,
);

// User scores (accessed via /:sport/users/:userId/scores)
export const userScoresRouter = Router({ mergeParams: true });
userScoresRouter.get('/', getUserScores);
