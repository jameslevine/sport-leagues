import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { SportType } from '../types/sport';
import { Score } from '../types/score';
import { HTTP_STATUS } from '../constants';
import {
  getDbScoresByRound,
  getDbScoresByUser,
  getDbScoresByLeague,
  createDbScore,
  updateDbScoreVerification,
} from '../adapters/scores';
import { getDbRoundById } from '../adapters/rounds';
import { getDbMatchById } from '../adapters/matches';

export const submitScore = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, roundId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const userId = req.user.sub;

    const round = await getDbRoundById(sportType, roundId);
    if (!round) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Round not found' });
    }

    const now = dayjs().toISOString();
    const scoreId = uuidv4();

    const score: Score = {
      pk: `SCORE#${sportType}`,
      sk: `ROUND#${roundId}#USER#${userId}`,
      gsi1pk: `USER#${userId}`,
      gsi1sk: `SCORE#${roundId}`,
      gsi2pk: `LEAGUE#${round.leagueId}`,
      gsi2sk: `SCORE#${round.scheduledDate}`,
      scoreId,
      roundId,
      leagueId: round.leagueId,
      matchId: req.body.matchId,
      userId,
      sportType,
      scoreData: req.body.scoreData,
      totalScore: req.body.scoreData.totalStrokes || 0,
      verified: false,
      createdAt: now,
      updatedAt: now,
    };

    await createDbScore(score);
    res.status(HTTP_STATUS.CREATED).json(score);
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error submitting score',
    });
  }
};

export const getRoundScores = async (req: Request, res: Response) => {
  try {
    const { sport, roundId } = req.params;
    const sportType = sport.toUpperCase() as SportType;

    const scores = await getDbScoresByRound(sportType, roundId);
    res.json({ scores });
  } catch (error) {
    console.error('Error fetching round scores:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching scores',
    });
  }
};

export const getUserScores = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;

    const result = await getDbScoresByUser(
      userId,
      limit ? parseInt(limit as string) : undefined,
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching scores',
    });
  }
};

export const verifyScore = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { sport, scoreId } = req.params;
    const sportType = sport.toUpperCase() as SportType;
    const verifierId = req.user.sub;

    // scoreId format expected: roundId and userId passed in body
    const { roundId, userId } = req.body;

    if (!roundId || !userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'roundId and userId are required' });
    }

    // Verify the round exists
    const round = await getDbRoundById(sportType, roundId);
    if (!round) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Round not found' });
    }

    // Verify the verifier is not the same as the score submitter
    if (verifierId === userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Cannot verify your own score' });
    }

    // Update the score verification
    await updateDbScoreVerification(sportType, roundId, userId, verifierId);

    res.json({
      message: 'Score verified successfully',
      scoreId,
      verifiedBy: verifierId,
    });
  } catch (error) {
    console.error('Error verifying score:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error verifying score',
    });
  }
};
