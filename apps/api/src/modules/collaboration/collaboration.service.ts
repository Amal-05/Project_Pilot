import { CollaborationRepository } from './collaboration.repository';
import { CreateConversationInput, SendMessageInput } from '@project-pilot/validation';

const collaborationRepository = new CollaborationRepository();

export class CollaborationService {
  // --- CHAT ---

  async createConversation(userId: string, data: CreateConversationInput) {
    // Ensure the creator is included in participants
    const participantIds = Array.from(new Set([...data.participantIds, userId]));
    return collaborationRepository.createConversation({
      ...data,
      participantIds,
    });
  }

  async listConversations(userId: string) {
    return collaborationRepository.listConversations(userId);
  }

  async sendMessage(userId: string, data: SendMessageInput) {
    return collaborationRepository.createMessage({
      content: data.content,
      conversationId: data.conversationId,
      senderId: userId,
    });
  }

  async listMessages(conversationId: string) {
    return collaborationRepository.listMessages(conversationId);
  }

  // --- NOTIFICATIONS ---

  async listNotifications(userId: string) {
    return collaborationRepository.listNotifications(userId);
  }

  async markAsRead(id: string) {
    return collaborationRepository.markNotificationAsRead(id);
  }

  async markAllAsRead(userId: string) {
    return collaborationRepository.markAllNotificationsAsRead(userId);
  }

  async notify(userId: string, type: any, title: string, message: string, link?: string) {
    return collaborationRepository.createNotification({
      userId,
      type,
      title,
      message,
      link,
    });
  }
}
