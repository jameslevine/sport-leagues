import Joi from 'joi';
import { SportType } from '../types/sport';

export const userParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  userId: Joi.string().required(),
});

export const userUpdateBodySchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  displayName: Joi.string().min(1).max(50).optional(),
  avatarUrl: Joi.string().uri().optional().allow(''),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
  }).optional(),
  sportProfiles: Joi.object()
    .pattern(
      Joi.string(),
      Joi.object({
        handicapIndex: Joi.number().optional(),
        rating: Joi.number().optional(),
        level: Joi.string().optional(),
      }),
    )
    .optional(),
  notificationPreferences: Joi.object({
    push: Joi.boolean().optional(),
    sms: Joi.boolean().optional(),
    email: Joi.boolean().optional(),
  }).optional(),
});
