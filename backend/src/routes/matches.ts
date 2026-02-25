import { Router } from 'express';
import { validateParams, validateBody } from '../middleware/validation';
import {
  getMatchesByRound,
  getMatchById,
  getMyMatches,
  rescheduleMatch,
  triggerMatchScheduling,
} from '../controllers/matches';
import Joi from 'joi';
import { SportType } from '../types/sport';

const matchParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  matchId: Joi.string().required(),
});

const roundMatchesParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  roundId: Joi.string().required(),
});

const rescheduleBodySchema = Joi.object({
  scheduledDate: Joi.string().isoDate().required(),
  scheduledTime: Joi.string().required(),
});

export const router = Router({ mergeParams: true });

// Get my matches
router.get('/me', getMyMatches);

// Get match by ID
router.get('/:matchId', validateParams(matchParamsSchema), getMatchById);

// Reschedule a match
router.patch(
  '/:matchId/reschedule',
  validateParams(matchParamsSchema),
  validateBody(rescheduleBodySchema),
  rescheduleMatch,
);

// Get matches for a round
router.get(
  '/round/:roundId',
  validateParams(roundMatchesParamsSchema),
  getMatchesByRound,
);

// Trigger match scheduling for a round (admin)
router.post(
  '/round/:roundId/schedule',
  validateParams(roundMatchesParamsSchema),
  triggerMatchScheduling,
);
