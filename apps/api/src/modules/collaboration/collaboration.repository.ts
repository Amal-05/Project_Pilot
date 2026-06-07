import { PrismaClient, Conversation, Message, Notification } from '@prisma/client';

const prisma = new PrismaClient();

export class CollaborationRepository {
  // --- CHAT ---

  async createConversation(data: any): Promise<Conversation> {
    const { participantIds, ...conversationData } = data;
    return prisma.conversation.create({
      data: {
        ...conversationData,
        participants: {
          create: participantIds.map((userId: string) => ({ userId })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async listConversations(userId: string): Promise<Conversation[]> {
    return prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createMessage(data: any): Promise<Message> {
    return prisma.message.create({
      data,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async listMessages(conversationId: string, limit = 50, skip = 0): Promise<Message[]> {
    return prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    });
  }

  // --- NOTIFICATIONS ---

  async createNotification(data: any): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async listNotifications(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllNotificationsAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
