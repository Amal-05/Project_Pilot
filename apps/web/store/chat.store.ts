import { create } from 'zustand';
import api from '../lib/api';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface Conversation {
  id: string;
  name?: string;
  type: string;
  participants: any[];
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/collaboration/conversations');
      set({ conversations: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      const { data } = await api.get(`/collaboration/conversations/${conversationId}/messages`);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages: data } : c
        ),
        activeConversation: state.activeConversation?.id === conversationId 
          ? { ...state.activeConversation, messages: data } 
          : state.activeConversation,
      }));
    } catch (error) {}
  },

  sendMessage: async (conversationId, content) => {
    try {
      await api.post('/collaboration/messages', { conversationId, content });
      // Real-time update will handle adding to state
    } catch (error) {}
  },

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  addMessage: (conversationId, message) => {
    set((state) => {
      const updatedConversations = state.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...(c.messages || []), message] } : c
      );
      
      const updatedActive = state.activeConversation?.id === conversationId
        ? { ...state.activeConversation, messages: [...(state.activeConversation.messages || []), message] }
        : state.activeConversation;

      return { conversations: updatedConversations, activeConversation: updatedActive };
    });
  },
}));
