import { Request, Response, NextFunction } from 'express';
import { SprintService } from './sprint.service';
import { createSprintSchema, updateSprintSchema } from '@project-pilot/validation';

const sprintService = new SprintService();

export class SprintController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createSprintSchema.parse(req.body);
      const result = await sprintService.createSprint(validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.query;
      if (!projectId) return res.status(400).json({ message: 'projectId is required' });
      const result = await sprintService.listProjectSprints(projectId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async start(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sprintService.startSprint(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sprintService.completeSprint(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
