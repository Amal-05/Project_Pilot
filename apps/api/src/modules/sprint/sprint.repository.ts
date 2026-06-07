import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SprintRepository {
  async create(data: any) {
    return prisma.sprint.create({ data });
  }

  async findById(id: string) {
    return prisma.sprint.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  async listByProject(projectId: string) {
    return prisma.sprint.findMany({
      where: { projectId },
      orderBy: { startDate: 'desc' },
      include: { 
        _count: {
          select: { tasks: true }
        }
      }
    });
  }

  async update(id: string, data: any) {
    return prisma.sprint.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.sprint.delete({ where: { id } });
  }

  async toggleActive(id: string, isActive: boolean) {
    return prisma.sprint.update({ where: { id }, data: { isActive } });
  }
}
