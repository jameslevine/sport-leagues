import Joi from 'joi';
import { SportType } from '../types/sport';
import { ConversationType } from '../types/conversation';

export const conversationParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  conversationId: Joi.string().required(),
});

export const conversationCreateBodySchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(ConversationType))
    .required(),
  participants: Joi.array().items(Joi.string()).min(1).required(),
  name: Joi.string().max(100).optional(),
  leagueId: Joi.string().optional(),
});

export const messageBodySchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  type: Joi.string().valid('TEXT', 'IMAGE').default('TEXT'),
});
