import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from './organization.service';
import { 
  createOrganizationSchema, 
  updateOrganizationSchema, 
  inviteMemberSchema, 
  acceptInvitationSchema, 
  updateMemberRoleSchema 
} from '@project-pilot/validation';

const organizationService = new OrganizationService();

export class OrganizationController {
  async create(req: any, res: Response, next: NextFunction) {
    try {
      const validatedData = createOrganizationSchema.parse(req.body);
      const result = await organizationService.createOrganization(req.user.userId, validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await organizationService.getOrganization(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateOrganizationSchema.parse(req.body);
      const result = await organizationService.updateOrganization(req.params.id, validatedData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await organizationService.deleteOrganization(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async listMine(req: any, res: Response, next: NextFunction) {
    try {
      const result = await organizationService.listUserOrganizations(req.user.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async invite(req: any, res: Response, next: NextFunction) {
    try {
      const validatedData = inviteMemberSchema.parse(req.body);
      const result = await organizationService.inviteMember(req.params.id, req.user.userId, validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await organizationService.getMembers(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateMemberRole(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateMemberRoleSchema.parse(req.body);
      const result = await organizationService.updateMemberRole(req.params.id, req.params.userId, validatedData.role);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      await organizationService.removeMember(req.params.id, req.params.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async acceptInvitation(req: any, res: Response, next: NextFunction) {
    try {
      const validatedData = acceptInvitationSchema.parse(req.body);
      const result = await organizationService.acceptInvitation(validatedData.token, req.user.userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
