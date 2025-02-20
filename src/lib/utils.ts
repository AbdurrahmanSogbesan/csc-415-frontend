import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "./constants";
import { useAuthStore } from "./stores/auth";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TokenManagerConfig {
  accessTokenKey: string;
  refreshTokenKey: string;
  cookieOptions?: Cookies.CookieAttributes;
}

const TOKEN_CONFIG: TokenManagerConfig = {
  accessTokenKey: "access_token",
  refreshTokenKey: "refresh_token",
  cookieOptions: {
    secure: import.meta.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    // todo: Consider adding 'expires' based on your JWT expiration
  },
};

export const tokenManager = {
  setTokens: (accessToken: string, refreshToken: string) => {
    if (!accessToken || !refreshToken) {
      throw new Error("Invalid tokens provided");
    }
    Cookies.set(
      TOKEN_CONFIG.accessTokenKey,
      accessToken,
      TOKEN_CONFIG.cookieOptions,
    );
    Cookies.set(
      TOKEN_CONFIG.refreshTokenKey,
      refreshToken,
      TOKEN_CONFIG.cookieOptions,
    );
  },

  clearTokens: (): void => {
    Cookies.remove(TOKEN_CONFIG.accessTokenKey, TOKEN_CONFIG.cookieOptions);
    Cookies.remove(TOKEN_CONFIG.refreshTokenKey, TOKEN_CONFIG.cookieOptions);
  },

  getTokens: () => {
    return {
      accessToken: Cookies.get(TOKEN_CONFIG.accessTokenKey),
      refreshToken: Cookies.get(TOKEN_CONFIG.refreshTokenKey),
    };
  },

  setToken: (token: string, type: "access" | "refresh"): void => {
    if (!token) {
      throw new Error("Invalid token provided");
    }
    const key =
      type === "access"
        ? TOKEN_CONFIG.accessTokenKey
        : TOKEN_CONFIG.refreshTokenKey;
    Cookies.set(key, token, TOKEN_CONFIG.cookieOptions);
  },

  getToken: (type: "access" | "refresh"): string | undefined => {
    const key =
      type === "access"
        ? TOKEN_CONFIG.accessTokenKey
        : TOKEN_CONFIG.refreshTokenKey;
    return Cookies.get(key);
  },
};

export const isAccessTokenExpired = (access_token: string) => {
  try {
    const decodedToken = jwtDecode(access_token);
    return decodedToken.exp && decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Token validation error:", error);
    return true;
  }
};

export const refreshAccessToken = async () => {
  try {
    const { refreshToken } = tokenManager.getTokens();
    if (!refreshToken) return null;

    const response = await axios.post<TokenResponse>(
      `${API_BASE_URL}/user/token/refresh/`,
      {
        refresh: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.access) {
      useAuthStore.getState().login(response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh token", error);
    useAuthStore.getState().logout();
    return null;
  }
};
