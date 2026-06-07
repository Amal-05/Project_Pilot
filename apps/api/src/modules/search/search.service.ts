import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SearchService {
  async globalSearch(userId: string, query: string, organizationId?: string) {
    const whereClause: any = {};
    if (organizationId) {
      whereClause.organizationId = organizationId;
    }

    const [projects, tasks, users] = await Promise.all([
      prisma.project.findMany({
        where: {
          ...whereClause,
          name: { contains: query, mode: 'insensitive' },
        },
        take: 5,
      }),
      prisma.task.findMany({
        where: {
          project: whereClause,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { project: true },
        take: 10,
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ]);

    return {
      projects,
      tasks,
      users,
    };
  }
}
