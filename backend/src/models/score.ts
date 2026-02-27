import Joi from 'joi';
import { SportType } from '../types/sport';

export const scoreParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  scoreId: Joi.string().required(),
});

export const scoreRoundParamsSchema = Joi.object({
  sport: Joi.string()
    .valid(...Object.values(SportType))
    .insensitive()
    .uppercase()
    .required(),
  roundId: Joi.string().required(),
});

export const scoreSubmitBodySchema = Joi.object({
  matchId: Joi.string().optional(),
  scoreData: Joi.object({
    // Golf-specific
    holes: Joi.array()
      .items(
        Joi.object({
          hole: Joi.number().required(),
          par: Joi.number().required(),
          strokes: Joi.number().required(),
          putts: Joi.number().optional(),
        }),
      )
      .optional(),
    totalStrokes: Joi.number().optional(),
    totalPutts: Joi.number().optional(),
    handicapIndex: Joi.number().optional(),
    courseHandicap: Joi.number().optional(),
    netScore: Joi.number().optional(),
    courseName: Joi.string().optional(),
    courseRating: Joi.number().optional(),
    slopeRating: Joi.number().optional(),
    // Tennis-specific
    sets: Joi.array()
      .items(
        Joi.object({
          set: Joi.number().required(),
          player1: Joi.number().required(),
          player2: Joi.number().required(),
        }),
      )
      .optional(),
    winner: Joi.string().optional(),
    aces: Joi.number().optional(),
    doubleFaults: Joi.number().optional(),
    rating: Joi.number().optional(),
  }).required(),
});

export const scoreVerifyBodySchema = Joi.object({
  roundId: Joi.string().required(),
  userId: Joi.string().required(),
});
