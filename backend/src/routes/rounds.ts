import { Router } from 'express';
import { validateParams, validateBody } from '../middleware/validation';
import {
  roundParamsSchema,
  roundCreateBodySchema,
  roundLeagueParamsSchema,
} from '../models/round';
import {
  getRoundsByLeague,
  getRoundById,
  createRound,
  joinRound,
  leaveRound,
  getRoundParticipants,
  cancelRound,
} from '../controllers/rounds';

export const leagueRoundsRouter = Router({ mergeParams: true });
export const roundsRouter = Router({ mergeParams: true });

// Routes under /:sport/leagues/:leagueId/rounds
leagueRoundsRouter.get(
  '/',
  validateParams(roundLeagueParamsSchema),
  getRoundsByLeague,
);
leagueRoundsRouter.post(
  '/',
  validateParams(roundLeagueParamsSchema),
  validateBody(roundCreateBodySchema),
  createRound,
);

// Routes under /:sport/rounds
roundsRouter.get('/:roundId', validateParams(roundParamsSchema), getRoundById);
roundsRouter.post(
  '/:roundId/join',
  validateParams(roundParamsSchema),
  joinRound,
);
roundsRouter.delete(
  '/:roundId/leave',
  validateParams(roundParamsSchema),
  leaveRound,
);
roundsRouter.get(
  '/:roundId/participants',
  validateParams(roundParamsSchema),
  getRoundParticipants,
);
roundsRouter.post(
  '/:roundId/cancel',
  validateParams(roundParamsSchema),
  cancelRound,
);
