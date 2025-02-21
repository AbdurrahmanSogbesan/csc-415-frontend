import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
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
          const decoded = jwtDecode<User>(tokens.access);
          set({ user: decoded, isAuthenticated: true });
        } catch (error) {
          console.error("Failed to decode user from token:", error);
          get().logout();
        }
      },

      logout: () => {
        tokenManager.clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const { accessToken } = tokenManager.getTokens();
        // console.log(accessToken, "accessToken");

        if (!accessToken) {
          get().logout();
          return false;
        }

        try {
          const decoded = jwtDecode<User>(accessToken);
          set({ user: decoded, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error("Failed to decode access token:", error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
