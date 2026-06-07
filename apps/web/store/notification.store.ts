import { create } from 'zustand';
import api from '../lib/api';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/collaboration/notifications');
      set({ 
        notifications: data, 
        unreadCount: data.filter((n: any) => !n.isRead).length,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/collaboration/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {}
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/collaboration/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {}
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
