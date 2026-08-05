import type { AuthTokens, User } from "@/types/auth";

interface StoredSession {
  user: User;
  tokens: AuthTokens;
  rememberMe: boolean;
}

const SESSION_KEY = "mrsk-auth-session";

/**
 * Unlike the cart store (Sprint 7), which persists unconditionally via
 * Zustand's `persist` middleware into a single storage, the auth session
 * has to honor "Remember Me": checked → `localStorage` (survives closing
 * the browser), unchecked → `sessionStorage` (cleared when the tab/browser
 * closes). Zustand's `persist` assumes one storage decided at store
 * creation time, which can't express that per-login choice — so the auth
 * store manages persistence explicitly through these functions instead
 * (called from `useAuth()` and restored once by `AuthProvider` on mount).
 */

function getStorage(rememberMe: boolean): Storage | null {
  if (typeof window === "undefined") return null;
  return rememberMe ? window.localStorage : window.sessionStorage;
}

export function saveSession(user: User, tokens: AuthTokens, rememberMe: boolean): void {
  const storage = getStorage(rememberMe);
  if (!storage) return;

  const payload: StoredSession = { user, tokens, rememberMe };
  storage.setItem(SESSION_KEY, JSON.stringify(payload));

  // Clear any stale copy in the other storage so logging in again with a
  // different "remember me" choice doesn't leave two conflicting sessions.
  const other = rememberMe ? window.sessionStorage : window.localStorage;
  other.removeItem(SESSION_KEY);
}

export function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}
