import { Wallet } from '@/near/wallet';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  wallet: Wallet | null;
  accountId: string | null;
  setUser: (user: User | null) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  setWallet: (wallet: Wallet) => void;
  setAccountId: (accountId: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      wallet: null,
      accountId: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setWallet: (wallet) => set({ wallet }),
      setAccountId: (accountId) => set({ accountId }),
      connectWallet: async () => {
        const { wallet } = get();
        if (!wallet) return;

        try {
          const email = "test@example.com"
          const user: User = {
            id: '1',
            email,
            name: "test",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            points: 0,
            completedQuests: [],
          };
          await wallet.signIn();
          // Set auth cookie - in a real app this would be a secure, httpOnly cookie
          document.cookie = `auth=${user.id};path=/;`;
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      },
      disconnectWallet: async () => {
        const { wallet } = get();
        if (!wallet) return;

        try {
          await wallet.signOut();
          document.cookie = 'auth=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          set({ accountId: null, user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Failed to disconnect wallet:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accountId: state.accountId
      }),
    }
  )
);
