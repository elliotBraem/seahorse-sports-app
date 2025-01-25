import { User } from "@renegade-fanclub/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accountId: string | null;
  setUser: (user: User | null) => void;
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
      setAccountId: (accountId) => set({ accountId }),
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
