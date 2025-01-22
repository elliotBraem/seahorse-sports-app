import { Wallet } from '@/near/wallet';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';
import { setCookie, removeCookie } from './utils/cookies';

// 7 days in seconds
const SESSION_DURATION = 7 * 24 * 60 * 60;

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
          // Set secure auth cookie
          setCookie('auth', user.id, {
            maxAge: SESSION_DURATION, // 7 days
            secure: true,
            httpOnly: true,
            sameSite: 'Strict'
          });
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
          removeCookie('auth', {
            secure: true,
            httpOnly: true,
            sameSite: 'Strict'
          });
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
