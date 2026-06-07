import { PrismaClient, UserRole, ProjectStatus, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Super Admin
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@projectpilot.ai' },
    update: {},
    create: {
      email: 'admin@projectpilot.ai',
      firstName: 'System',
      lastName: 'Admin',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
    },
  });

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'ProjectPilot Corp',
      slug: 'project-pilot',
      description: 'The main organization for testing.',
      ownerId: admin.id,
      members: {
        create: {
          userId: admin.id,
          role: UserRole.ORG_ADMIN,
        },
      },
    },
  });

  // Create Project
  const project = await prisma.project.create({
    data: {
      name: 'Internal Platform V1',
      description: 'Building the foundation of ProjectPilot.',
      status: ProjectStatus.ACTIVE,
      organizationId: org.id,
      managerId: admin.id,
    },
  });

  // Create Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design Database Schema',
        description: 'Complete the ER diagram and Prisma models.',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        projectId: project.id,
        creatorId: admin.id,
      },
      {
        title: 'Implement Authentication',
        description: 'Setup JWT and RBAC.',
        status: TaskStatus.DONE,
        priority: TaskPriority.URGENT,
        projectId: project.id,
        creatorId: admin.id,
      },
      {
        title: 'Develop Kanban Board',
        description: 'Frontend drag and drop implementation.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        projectId: project.id,
        creatorId: admin.id,
      },
      {
        title: 'AI Integration',
        description: 'Connect OpenAI for task generation.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        projectId: project.id,
        creatorId: admin.id,
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
