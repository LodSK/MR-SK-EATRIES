"use client";

import * as React from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { loadSession } from "@/lib/utils/session";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Runs once on mount: checks for a persisted session (localStorage if
 * "remember me" was checked, sessionStorage otherwise — see
 * `lib/utils/session.ts`) and populates the auth store. Consumers read
 * `isLoadingSession` from `useAuth()` to avoid flashing a logged-out UI
 * before this settles.
 *
 * Deliberately doesn't check whether the stored access token is already
 * expired: `httpClient.ts`'s response interceptor already handles that
 * correctly and transparently (401 -> refresh via the real backend
 * endpoint -> retry) on whatever the first real API call turns out to
 * be. An earlier version tried to refresh proactively here too, but
 * against a leftover pre-Sprint-9 helper that fabricated a fake local
 * token instead of calling the backend — worse than doing nothing, since
 * every request made with that fake token would fail regardless.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const setStatus = useAuthStore((s) => s.setStatus);
  const setSession = useAuthStore((s) => s.setSession);

  React.useEffect(() => {
    setStatus("loading");

    const stored = loadSession();
    if (!stored) {
      setStatus("guest");
      return;
    }

    setSession(stored.user, stored.tokens, stored.rememberMe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
