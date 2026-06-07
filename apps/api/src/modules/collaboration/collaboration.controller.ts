import { Request, Response, NextFunction } from 'express';
import { CollaborationService } from './collaboration.service';
import { createConversationSchema, sendMessageSchema } from '@project-pilot/validation';
import { io } from '../../index';

const collaborationService = new CollaborationService();

export class CollaborationController {
  // --- CHAT ---

  async createConversation(req: any, res: Response, next: NextFunction) {
    try {
      const validatedData = createConversationSchema.parse(req.body);
      const result = await collaborationService.createConversation(req.user.userId, validatedData);
      
      // Notify participants via socket if they are online
      result.participants.forEach((p: any) => {
        io.to(`user:${p.userId}`).emit('conversation:created', result);
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listConversations(req: any, res: Response, next: NextFunction) {
    try {
      const result = await collaborationService.listConversations(req.user.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: any, res: Response, next: NextFunction) {
    try {
      const validatedData = sendMessageSchema.parse(req.body);
      const result = await collaborationService.sendMessage(req.user.userId, validatedData);
      
      io.to(`conversation:${validatedData.conversationId}`).emit('message:received', result);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await collaborationService.listMessages(req.params.conversationId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // --- NOTIFICATIONS ---

  async listNotifications(req: any, res: Response, next: NextFunction) {
    try {
      const result = await collaborationService.listNotifications(req.user.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await collaborationService.markAsRead(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: any, res: Response, next: NextFunction) {
    try {
      await collaborationService.markAllAsRead(req.user.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
