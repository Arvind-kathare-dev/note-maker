import { create } from 'zustand';
import { User } from '../types';
import { mockUsers } from '../data/mock';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUsers[0], // Default to Super Admin for dev
  isAuthenticated: true,
  isLoading: false,
  login: async (email: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = mockUsers.find((u) => u.email === email) || mockUsers[0];
    set({ user, isAuthenticated: true, isLoading: false });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
