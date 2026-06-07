import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
  async create(data: any): Promise<Task> {
    return prisma.task.create({
      data,
      include: {
        assignee: {
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

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        subtasks: true,
        dependencies: {
          include: {
            dependencyTask: true,
          },
        },
      },
    });
  }

  async listByProject(projectId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: {
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

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  }

  async addDependency(dependentTaskId: string, dependencyTaskId: string) {
    return prisma.taskDependency.create({
      data: {
        dependentTaskId,
        dependencyTaskId,
      },
    });
  }
}
