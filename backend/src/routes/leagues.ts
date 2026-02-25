import { Router } from 'express';
import { validateParams, validateBody } from '../middleware/validation';
import {
  leagueParamsSchema,
  sportParamsSchema,
  leagueCreateBodySchema,
  leagueUpdateBodySchema,
} from '../models/league';
import {
  getLeagues,
  getLeagueById,
  createLeague,
  updateLeague,
  joinLeague,
  leaveLeague,
  getLeagueMembers,
} from '../controllers/leagues';

export const router = Router({ mergeParams: true });

router.get('/', validateParams(sportParamsSchema), getLeagues);
router.post(
  '/',
  validateParams(sportParamsSchema),
  validateBody(leagueCreateBodySchema),
  createLeague,
);
router.get('/:leagueId', validateParams(leagueParamsSchema), getLeagueById);
router.patch(
  '/:leagueId',
  validateParams(leagueParamsSchema),
  validateBody(leagueUpdateBodySchema),
  updateLeague,
);
router.post('/:leagueId/join', validateParams(leagueParamsSchema), joinLeague);
router.delete(
  '/:leagueId/leave',
  validateParams(leagueParamsSchema),
  leaveLeague,
);
router.get(
  '/:leagueId/members',
  validateParams(leagueParamsSchema),
  getLeagueMembers,
);
