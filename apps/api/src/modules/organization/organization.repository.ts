import { PrismaClient, Organization, OrganizationMember, OrganizationInvitation } from '@prisma/client';

const prisma = new PrismaClient();

export class OrganizationRepository {
  async create(data: any): Promise<Organization> {
    return prisma.organization.create({
      data: {
        ...data,
        members: {
          create: {
            userId: data.ownerId,
            role: 'ORG_ADMIN',
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return prisma.organization.findUnique({ where: { slug } });
  }

  async update(id: string, data: any): Promise<Organization> {
    return prisma.organization.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Organization> {
    return prisma.organization.delete({ where: { id } });
  }

  async listByUser(userId: string): Promise<Organization[]> {
    return prisma.organization.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
    });
  }

  async addMember(organizationId: string, userId: string, role: any): Promise<OrganizationMember> {
    return prisma.organizationMember.create({
      data: {
        organizationId,
        userId,
        role,
      },
    });
  }

  async getMembers(organizationId: string): Promise<any[]> {
    return prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async removeMember(organizationId: string, userId: string): Promise<OrganizationMember> {
    return prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
  }

  async updateMemberRole(organizationId: string, userId: string, role: any): Promise<OrganizationMember> {
    return prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      data: { role },
    });
  }

  async createInvitation(data: any): Promise<OrganizationInvitation> {
    return prisma.organizationInvitation.create({ data });
  }

  async findInvitationByToken(token: string): Promise<OrganizationInvitation | null> {
    return prisma.organizationInvitation.findUnique({
      where: { token },
      include: { organization: true },
    });
  }

  async updateInvitationStatus(id: string, status: any): Promise<OrganizationInvitation> {
    return prisma.organizationInvitation.update({
      where: { id },
      data: { status },
    });
  }
}
