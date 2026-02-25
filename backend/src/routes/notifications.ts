import { Router } from 'express';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { getDbNotificationsByUser } from '../lib/notifications';
import { updateDbUser } from '../adapters/users';
import { SportType } from '../types/sport';
import { validateBody } from '../middleware/validation';
import Joi from 'joi';

const notificationPreferencesSchema = Joi.object({
  push: Joi.boolean().required(),
  sms: Joi.boolean().required(),
  email: Joi.boolean().required(),
  phoneNumber: Joi.string().optional().allow(null, ''),
});

export const router = Router({ mergeParams: true });

// Get user notifications
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const userId = req.user.sub;
    const { limit } = req.query;

    const result = await getDbNotificationsByUser(
      userId,
      limit ? parseInt(limit as string) : undefined,
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching notifications',
    });
  }
});

// Update notification preferences
router.patch(
  '/preferences',
  validateBody(notificationPreferencesSchema),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const { sport } = req.params;
      const sportType = sport.toUpperCase() as SportType;
      const userId = req.user.sub;

      await updateDbUser(sportType, userId, {
        notificationPreferences: req.body,
      } as any);

      res.json({ message: 'Notification preferences updated' });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating notification preferences',
      });
    }
  },
);
