import { create } from 'zustand';
import api from '../lib/api';

interface AiState {
  isGenerating: boolean;
  error: string | null;
  generateTasks: (projectId: string, prompt: string) => Promise<any[]>;
  analyzeRisk: (projectId: string) => Promise<string>;
}

export const useAiStore = create<AiState>((set) => ({
  isGenerating: false,
  error: null,

  generateTasks: async (projectId, prompt) => {
    set({ isGenerating: true, error: null });
    try {
      const { data } = await api.post('/ai/generate-tasks', { projectId, prompt });
      set({ isGenerating: false });
      return data;
    } catch (error: any) {
      set({ isGenerating: false, error: error.message });
      throw error;
    }
  },

  analyzeRisk: async (projectId) => {
    set({ isGenerating: true, error: null });
    try {
      const { data } = await api.post('/ai/analyze-risk', { projectId });
      set({ isGenerating: false });
      return data.analysis;
    } catch (error: any) {
      set({ isGenerating: false, error: error.message });
      throw error;
    }
  },
}));
