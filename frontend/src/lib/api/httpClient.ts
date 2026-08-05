import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends the httpOnly refresh-token cookie
  headers: { "Content-Type": "application/json" },
});

const GUEST_ONLY_PATHS = ["/auth/login", "/auth/register"];

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const isGuestOnlyRequest = GUEST_ONLY_PATHS.some((path) => config.url?.includes(path));
  if (isGuestOnlyRequest) return config;

  const accessToken = useAuthStore.getState().tokens?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const accessToken: string | undefined = response.data?.data?.accessToken;
    return accessToken ?? null;
  } catch {
    return null;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      refreshInFlight ??= refreshAccessToken().finally(() => {
        refreshInFlight = null;
      });

      const newAccessToken = await refreshInFlight;
      if (newAccessToken) {
        const { user, rememberMe } = useAuthStore.getState();
        if (user) {
          useAuthStore.getState().setSession(
            user,
            { accessToken: newAccessToken, refreshToken: "", expiresAt: Date.now() + 15 * 60 * 1000 },
            rememberMe
          );
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      }

      useAuthStore.getState().clearSession();
    }

    return Promise.reject(error);
  }
);

/** Extracts a user-facing message from a failed API call, falling back to a generic one. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;
  }
  return fallback;
}
