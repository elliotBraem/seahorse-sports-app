import { Wallet } from "@/near/wallet";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./types";
import { setAuthCookie, removeAuthCookie } from "@/app/actions";

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
          await wallet.signIn();
        } catch (error) {
          console.error("Failed to connect wallet:", error);
        }
      },
      disconnectWallet: async () => {
        const { wallet } = get();
        if (!wallet) return;

        try {
          await wallet.signOut();
        } catch (error) {
          console.error("Failed to disconnect wallet:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accountId: state.accountId,
      }),
    },
  ),
);
