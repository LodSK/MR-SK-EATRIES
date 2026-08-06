"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import * as authApi from "@/lib/api/auth";
import { saveSession, clearSession as clearStoredSession } from "@/lib/utils/session";
import { hasPermission, hasRole, type Permission } from "@/lib/utils/auth";
import type {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UserRole,
} from "@/types/auth";

/**
 * The single entry point for everything auth-related. Every form
 * (`LoginForm`, `RegisterForm`, ...), route guard (`ProtectedRoute`,
 * `GuestRoute`), and the Navbar's `UserDropdown` all call this hook —
 * none of them import `useAuthStore`, `lib/api/auth`, or
 * `lib/utils/session` directly. Sprint 9 changes what happens inside
 * this file (real API calls, real tokens) without any consumer changing.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const tokens = useAuthStore((s) => s.tokens);
  const rememberMe = useAuthStore((s) => s.rememberMe);
  const status = useAuthStore((s) => s.status);
  const setSession = useAuthStore((s) => s.setSession);
  const updateUserState = useAuthStore((s) => s.updateUser);
  const clearSessionState = useAuthStore((s) => s.clearSession);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const result = await authApi.login(payload);
      if (result.success && result.user && result.tokens) {
        setSession(result.user, result.tokens, payload.rememberMe);
        saveSession(result.user, result.tokens, payload.rememberMe);
      }
      return result;
    },
    [setSession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const result = await authApi.register(payload);
      if (result.success && result.user && result.tokens) {
        setSession(result.user, result.tokens, false);
        saveSession(result.user, result.tokens, false);
      }
      return result;
    },
    [setSession]
  );

  /**
   * Called once, on mount, by the /auth/callback page Google's OAuth
   * redirect lands on. The backend already set the httpOnly refresh
   * cookie during the redirect — this just mints an access token from it
   * (POST /auth/refresh) and fetches the profile (GET /auth/me), the same
   * two calls AuthProvider effectively relies on for any existing session,
   * so no new backend endpoint was needed for this.
   */
  const completeExternalLogin = useCallback(async () => {
    const refreshed = await authApi.refreshSession("");
    if (!refreshed.success || !refreshed.tokens) {
      return { success: false, message: refreshed.message };
    }
    const profile = await authApi.getCurrentUser();
    if (!profile.success || !profile.user) {
      return { success: false, message: profile.message };
    }
    setSession(profile.user, refreshed.tokens, true);
    saveSession(profile.user, refreshed.tokens, true);
    return { success: true, message: "Signed in.", user: profile.user };
  }, [setSession]);

  const logout = useCallback(async () => {
    await authApi.logout();
    clearSessionState();
    clearStoredSession();
  }, [clearSessionState]);

  const logoutAllDevices = useCallback(async () => {
    const result = await authApi.logoutAllDevices();
    clearSessionState();
    clearStoredSession();
    return result;
  }, [clearSessionState]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      if (!user) return { success: false, message: "Not signed in." };
      const result = await authApi.updateProfile(user.id, payload);
      if (result.success && result.user) {
        updateUserState(result.user);
        if (tokens) saveSession(result.user, tokens, rememberMe);
      }
      return result;
    },
    [user, tokens, rememberMe, updateUserState]
  );

  const changePassword = useCallback(
    async (payload: ChangePasswordPayload) => {
      if (!user) return { success: false, message: "Not signed in." };
      return authApi.changePassword(user.id, payload);
    },
    [user]
  );

  const can = useCallback((permission: Permission) => hasPermission(user?.role, permission), [user]);
  const isRole = useCallback((roles: UserRole[]) => hasRole(user?.role, roles), [user]);

  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isLoadingSession: status === "idle" || status === "loading",

    login,
    register,
    completeExternalLogin,
    logout,
    logoutAllDevices,
    updateProfile,
    changePassword,

    // These don't need a user in context — pass straight through.
    forgotPassword: authApi.forgotPassword,
    resetPassword: authApi.resetPassword,
    verifyEmail: authApi.verifyEmail,
    resendVerificationEmail: authApi.resendVerificationEmail,

    can,
    isRole,
  };
}
