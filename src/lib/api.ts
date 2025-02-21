import axios, { Axios } from "axios";
import { API_BASE_URL } from "./constants";
import {
  isAccessTokenExpired,
  refreshAccessToken,
  tokenManager,
} from "./utils";
import { useAuthStore } from "./stores/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 seconds
});

api.interceptors.request.use(async (config) => {
  const { accessToken, refreshToken } = tokenManager.getTokens();

  if (!accessToken || !refreshToken) {
    return config;
  }

  if (isAccessTokenExpired(accessToken)) {
    try {
      const response = await refreshAccessToken();
      if (response?.access) {
        config.headers.Authorization = `Bearer ${response.access}`;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      useAuthStore.getState().logout();

      return Promise.reject(error);
    }
  } else {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const response = await refreshAccessToken();
        if (response?.access) {
          // Retry the original request with the new token
          error.config.headers["Authorization"] = `Bearer ${response.access}`;
          return api(error.config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }

      // Clear tokens and redirect if refresh failed
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export const apiGet = <T = unknown>(...args: Parameters<Axios["get"]>) =>
  api.get<T>(...args).then((r) => r.data);
export const apiPost = <T = unknown>(...args: Parameters<Axios["post"]>) =>
  api.post<T>(...args).then((r) => r.data);
export const apiDelete = <T = unknown>(...args: Parameters<Axios["delete"]>) =>
  api.delete<T>(...args).then((r) => r.data);
export const apiPatch = <T = unknown>(...args: Parameters<Axios["patch"]>) =>
  api.patch<T>(...args).then((r) => r.data);
export const apiRequest = <T = unknown>(
  ...args: Parameters<Axios["request"]>
) => api.request<T>(...args).then((r) => r.data);

export default api;
