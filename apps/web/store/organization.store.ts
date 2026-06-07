import { create } from 'zustand';
import api from '../lib/api';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
}

interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  fetchOrganizations: () => Promise<void>;
  setCurrentOrganization: (org: Organization | null) => void;
  createOrganization: (data: any) => Promise<void>;
  updateOrganization: (id: string, data: any) => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  organizations: [],
  currentOrganization: null,
  isLoading: false,
  error: null,
  fetchOrganizations: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/organizations');
      set({ organizations: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  createOrganization: async (data) => {
    set({ isLoading: true });
    try {
      const { data: newOrg } = await api.post('/organizations', data);
      set((state) => ({ 
        organizations: [...state.organizations, newOrg], 
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  updateOrganization: async (id, data) => {
    set({ isLoading: true });
    try {
      const { data: updatedOrg } = await api.patch(`/organizations/${id}`, data);
      set((state) => ({
        organizations: state.organizations.map((org) => org.id === id ? updatedOrg : org),
        currentOrganization: state.currentOrganization?.id === id ? updatedOrg : state.currentOrganization,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
