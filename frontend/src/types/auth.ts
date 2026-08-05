import type { Address } from "@/types/address";

export type UserRole = "customer" | "staff" | "manager" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarInitials: string;
  /** Real uploaded photo, if any — falls back to avatarInitials when absent. Backend has returned this since Sprint 9; only wired into the UI in Sprint 11. */
  avatarUrl?: string;
  isEmailVerified: boolean;
  birthday?: string;
  bio?: string;
  addresses: Address[];
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** Epoch milliseconds. */
  expiresAt: number;
}

export type SessionStatus = "idle" | "loading" | "authenticated" | "guest";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  birthday?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  tokens?: AuthTokens;
}

export interface SimpleResult {
  success: boolean;
  message: string;
}
