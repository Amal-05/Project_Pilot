import { create } from 'zustand';
import api from '../lib/api';

interface Sprint {
  id: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  projectId: string;
  _count?: {
    tasks: number;
  };
}

interface SprintState {
  sprints: Sprint[];
  isLoading: boolean;
  fetchSprints: (projectId: string) => Promise<void>;
  createSprint: (data: any) => Promise<void>;
  startSprint: (id: string) => Promise<void>;
  completeSprint: (id: string) => Promise<void>;
}

export const useSprintStore = create<SprintState>((set) => ({
  sprints: [],
  isLoading: false,

  fetchSprints: async (projectId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/sprints?projectId=${projectId}`);
      set({ sprints: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createSprint: async (data) => {
    try {
      const { data: newSprint } = await api.post('/sprints', data);
      set((state) => ({ sprints: [newSprint, ...state.sprints] }));
    } catch (error) {}
  },

  startSprint: async (id) => {
    try {
      const { data: updatedSprint } = await api.patch(`/sprints/${id}/start`);
      set((state) => ({
        sprints: state.sprints.map((s) => s.id === id ? updatedSprint : s)
      }));
    } catch (error) {}
  },

  completeSprint: async (id) => {
    try {
      const { data: updatedSprint } = await api.patch(`/sprints/${id}/complete`);
      set((state) => ({
        sprints: state.sprints.map((s) => s.id === id ? updatedSprint : s)
      }));
    } catch (error) {}
  },
}));
