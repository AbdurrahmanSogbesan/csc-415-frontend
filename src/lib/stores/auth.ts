import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tokenManager } from "../utils";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  login: (tokens: TokenResponse) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      login: (tokens) => {
        try {
          tokenManager.setTokens(tokens.access, tokens.refresh);
          set({ isAuthenticated: true });
        } catch (error) {
          console.error("Failed to set tokens:", error);
          get().logout();
        }
      },

      logout: () => {
        tokenManager.clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const { accessToken } = tokenManager.getTokens();
        if (!accessToken) {
          get().logout();
          return false;
        }
        return true;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
