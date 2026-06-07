import { Request, Response, NextFunction } from 'express';
import { TaskService } from './task.service';
import { createTaskSchema, updateTaskSchema, moveTaskSchema } from '@project-pilot/validation';
import { io } from '../../index';

const taskService = new TaskService();

export class TaskController {
  async create(req: any, res: Response, next: NextFunction) {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const result = await taskService.createTask(req.user.userId, validatedData);
      
      io.to(`project:${validatedData.projectId}`).emit('task:created', result);
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskService.getTask(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listProjectTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.query;
      if (!projectId) {
        return res.status(400).json({ message: 'projectId is required' });
      }
      const result = await taskService.listProjectTasks(projectId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateTaskSchema.parse(req.body);
      const result = await taskService.updateTask(req.params.id, validatedData);
      
      io.to(`project:${result.projectId}`).emit('task:updated', result);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async move(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = moveTaskSchema.parse(req.body);
      const result = await taskService.moveTask(req.params.id, validatedData);
      
      io.to(`project:${result.projectId}`).emit('task:moved', result);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getTask(req.params.id);
      await taskService.deleteTask(req.params.id);
      
      io.to(`project:${task.projectId}`).emit('task:deleted', { id: req.params.id });
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
