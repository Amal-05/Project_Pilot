import { create } from 'zustand';
import api from '../lib/api';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  organizationId: string;
  managerId: string;
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: (organizationId: string) => Promise<void>;
  createProject: (data: any) => Promise<void>;
  updateProject: (id: string, data: any) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  error: null,
  fetchProjects: async (organizationId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/projects?organizationId=${organizationId}`);
      set({ projects: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  createProject: async (data) => {
    set({ isLoading: true });
    try {
      const { data: newProject } = await api.post('/projects', data);
      set((state) => ({ 
        projects: [...state.projects, newProject], 
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  updateProject: async (id, data) => {
    set({ isLoading: true });
    try {
      const { data: updatedProject } = await api.patch(`/projects/${id}`, data);
      set((state) => ({
        projects: state.projects.map((proj) => proj.id === id ? updatedProject : proj),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
