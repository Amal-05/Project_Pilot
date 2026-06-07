import { OrganizationRepository } from './organization.repository';
import { EmailService } from '../../services/email.service';
import { CreateOrganizationInput, UpdateOrganizationInput, InviteMemberInput } from '@project-pilot/validation';
import crypto from 'crypto';

const organizationRepository = new OrganizationRepository();
const emailService = new EmailService();

export class OrganizationService {
  async createOrganization(userId: string, data: CreateOrganizationInput) {
    const existingSlug = await organizationRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw new Error('Organization slug already exists');
    }

    return organizationRepository.create({
      ...data,
      ownerId: userId,
    });
  }

  async getOrganization(id: string) {
    const org = await organizationRepository.findById(id);
    if (!org) {
      throw new Error('Organization not found');
    }
    return org;
  }

  async updateOrganization(id: string, data: UpdateOrganizationInput) {
    if (data.slug) {
      const existingSlug = await organizationRepository.findBySlug(data.slug);
      if (existingSlug && existingSlug.id !== id) {
        throw new Error('Organization slug already exists');
      }
    }

    return organizationRepository.update(id, data);
  }

  async deleteOrganization(id: string) {
    return organizationRepository.delete(id);
  }

  async listUserOrganizations(userId: string) {
    return organizationRepository.listByUser(userId);
  }

  async inviteMember(organizationId: string, invitedById: string, data: InviteMemberInput) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new Error('Organization not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await organizationRepository.createInvitation({
      email: data.email,
      role: data.role,
      token,
      expiresAt,
      organizationId,
      invitedById,
    });

    await emailService.sendInvitationEmail(data.email, org.name, token);

    return invitation;
  }

  async getMembers(organizationId: string) {
    return organizationRepository.getMembers(organizationId);
  }

  async updateMemberRole(organizationId: string, userId: string, role: any) {
    return organizationRepository.updateMemberRole(organizationId, userId, role);
  }

  async removeMember(organizationId: string, userId: string) {
    return organizationRepository.removeMember(organizationId, userId);
  }

  async acceptInvitation(token: string, userId: string) {
    const invitation = await organizationRepository.findInvitationByToken(token);
    if (!invitation || invitation.status !== 'PENDING' || invitation.expiresAt < new Date()) {
      throw new Error('Invalid or expired invitation');
    }

    await organizationRepository.addMember(invitation.organizationId, userId, invitation.role);
    await organizationRepository.updateInvitationStatus(invitation.id, 'ACCEPTED');

    return { message: 'Invitation accepted successfully' };
  }
}
