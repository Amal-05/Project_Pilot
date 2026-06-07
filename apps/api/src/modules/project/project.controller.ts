import { Request, Response, NextFunction } from 'express';
import { ProjectService } from './project.service';
import { createProjectSchema, updateProjectSchema } from '@project-pilot/validation';

const projectService = new ProjectService();

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      const result = await projectService.createProject(validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectService.getProject(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listOrganizationProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.query;
      if (!organizationId) {
        return res.status(400).json({ message: 'organizationId is required' });
      }
      const result = await projectService.listOrganizationProjects(organizationId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateProjectSchema.parse(req.body);
      const result = await projectService.updateProject(req.params.id, validatedData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
