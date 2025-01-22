import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async (email) => {
    // Simulate API call
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      points: 0,
      completedQuests: [],
    };
    // Set auth cookie - in a real app this would be a secure, httpOnly cookie
    document.cookie = `auth=${user.id};path=/;`;
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    // Remove auth cookie
    document.cookie = 'auth=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    set({ user: null, isAuthenticated: false });
  },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // only persist these fields
    }
  )
);
