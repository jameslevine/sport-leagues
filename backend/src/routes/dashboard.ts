import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard';

export const router = Router({ mergeParams: true });

router.get('/', getDashboardStats);
