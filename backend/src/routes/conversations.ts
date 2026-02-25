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
router.post('/', createConversation);
router.get('/:conversationId', getConversationMessages);
router.post('/:conversationId', sendMessage);
