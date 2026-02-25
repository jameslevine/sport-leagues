import Joi from 'joi';
import { SportType } from '../types/sport';
import { LeagueCategory } from '../types/league';

export const leagueParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  leagueId: Joi.string().required(),
});

export const sportParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
});

export const leagueCreateBodySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  category: Joi.string()
    .valid(...Object.values(LeagueCategory))
    .required(),
  region: Joi.string().required(),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    address: Joi.string().required(),
  }).required(),
  maxMembers: Joi.number().min(2).max(1000).required(),
  entryFee: Joi.number().min(0).required(),
  minPlayersPerRound: Joi.number().min(2).required(),
  maxPlayersPerRound: Joi.number().min(2).required(),
  rules: Joi.string().max(5000).optional(),
  imageUrl: Joi.string().uri().optional(),
});

export const leagueUpdateBodySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  rules: Joi.string().max(5000).optional(),
  imageUrl: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
  maxMembers: Joi.number().min(2).max(1000).optional(),
  entryFee: Joi.number().min(0).optional(),
});

export const leagueSearchQuerySchema = Joi.object({
  searchText: Joi.string().min(1).max(100).required(),
});
