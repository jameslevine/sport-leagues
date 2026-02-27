import { Router } from 'express';
import { getUploadUrl } from '../controllers/uploads';

export const router = Router({ mergeParams: true });

router.get('/avatar-url', getUploadUrl);
