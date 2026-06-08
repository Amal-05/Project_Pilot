import { create } from 'zustand';
import api from '../lib/api';
import type { Socket } from 'socket.io-client';

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  projectId: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (data: any) => Promise<void>;
  updateTask: (id: string, data: any) => Promise<void>;
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  initSocket: (projectId: string) => void;
  disconnectSocket: (projectId: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  socket: null,

  fetchTasks: async (projectId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/tasks?projectId=${projectId}`);
      set({ tasks: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      await api.post('/tasks', data);
      // Real-time update will handle adding to state
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateTask: async (id, data) => {
    try {
      await api.patch(`/tasks/${id}`, data);
      // Real-time update will handle updating state
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  moveTask: async (id, newStatus) => {
    // Optimistic update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => t.id === id ? { ...t, status: newStatus } : t)
    }));

    try {
      await api.patch(`/tasks/${id}/move`, { status: newStatus });
    } catch (error: any) {
      set({ tasks: previousTasks, error: error.message });
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  initSocket: async (projectId) => {
    if (get().socket) return;

    const { io } = await import('socket.io-client');
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');
    
    socket.emit('join-project', projectId);

    socket.on('task:created', (task: Task) => {
      set((state) => ({ tasks: [task, ...state.tasks] }));
    });

    socket.on('task:updated', (updatedTask: Task) => {
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === updatedTask.id ? updatedTask : t)
      }));
    });

    socket.on('task:moved', (updatedTask: Task) => {
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === updatedTask.id ? updatedTask : t)
      }));
    });

    socket.on('task:deleted', ({ id }: { id: string }) => {
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      }));
    });

    set({ socket });
  },

  disconnectSocket: (projectId) => {
    const { socket } = get();
    if (socket) {
      socket.emit('leave-project', projectId);
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
