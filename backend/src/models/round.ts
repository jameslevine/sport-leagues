import Joi from 'joi';
import { SportType } from '../types/sport';

export const roundParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  roundId: Joi.string().required(),
});

export const roundCreateBodySchema = Joi.object({
  scheduledDate: Joi.string().isoDate().required(),
  scheduledTime: Joi.string().required(),
  venue: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  minPlayers: Joi.number().min(2).required(),
  maxPlayers: Joi.number().min(2).required(),
  entryFee: Joi.number().min(0).required(),
  registrationDeadline: Joi.string().isoDate().required(),
});

export const roundLeagueParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  leagueId: Joi.string().required(),
});
