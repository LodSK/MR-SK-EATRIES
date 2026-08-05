import { create } from "zustand";
import type { AuthTokens, SessionStatus, User } from "@/types/auth";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  rememberMe: boolean;
  status: SessionStatus;

  setSession: (user: User, tokens: AuthTokens, rememberMe: boolean) => void;
  updateUser: (patch: Partial<User>) => void;
  clearSession: () => void;
  setStatus: (status: SessionStatus) => void;
}

/**
 * The single source of truth for the current user/session. Like the
 * cart store, components never read this directly — they go through
 * `useAuth()` (`lib/hooks/useAuth.ts`), which also handles persistence
 * and calls into `lib/api/auth.ts`.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  rememberMe: false,
  status: "idle",

  setSession: (user, tokens, rememberMe) => set({ user, tokens, rememberMe, status: "authenticated" }),

  updateUser: (patch) =>
    set((state) => (state.user ? { user: { ...state.user, ...patch } } : {})),

  clearSession: () => set({ user: null, tokens: null, rememberMe: false, status: "guest" }),

  setStatus: (status) => set({ status }),
}));
