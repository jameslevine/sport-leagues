import { Router } from 'express';
import { validateBody, validateParams } from '../middleware/validation';
import {
  conversationParamsSchema,
  conversationCreateBodySchema,
  messageBodySchema,
} from '../models/conversation';
import {
  getConversations,
  createConversation,
  getConversationMessages,
  sendMessage,
} from '../controllers/conversations';

export const router = Router({ mergeParams: true });

router.get('/', getConversations);
router.post(
  '/',
  validateBody(conversationCreateBodySchema),
  createConversation,
);
router.get(
  '/:conversationId',
  validateParams(conversationParamsSchema),
  getConversationMessages,
);
router.post(
  '/:conversationId',
  validateParams(conversationParamsSchema),
  validateBody(messageBodySchema),
  sendMessage,
);
