import { PrismaClient, Project } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectRepository {
  async create(data: any): Promise<Project> {
    return prisma.project.create({ data });
  }

  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        organization: true,
        manager: {
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

  async listByOrganization(organizationId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: { organizationId },
      include: {
        manager: {
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

  async update(id: string, data: any): Promise<Project> {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({ where: { id } });
  }
}
