import { Router } from 'express';
import { CollaborationController } from './collaboration.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
const collaborationController = new CollaborationController();

router.use(protect);

// Chat
router.post('/conversations', collaborationController.createConversation);
router.get('/conversations', collaborationController.listConversations);
router.post('/messages', collaborationController.sendMessage);
router.get('/conversations/:conversationId/messages', collaborationController.listMessages);

// Notifications
router.get('/notifications', collaborationController.listNotifications);
router.patch('/notifications/:id/read', collaborationController.markAsRead);
router.patch('/notifications/read-all', collaborationController.markAllAsRead);

export default router;
