"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Restrict to specific roles beyond just "signed in". */
  allowedRoles?: UserRole[];
  /**
   * Sprint 12.1: when set, authenticated staff/manager/admin users are
   * redirected here instead of rendering children — used by
   * account/layout.tsx to send staff away from the customer dashboard to
   * /admin/dashboard. Unset by default, so every other consumer
   * (including admin/layout.tsx's own role gating via allowedRoles) is
   * completely unaffected.
   */
  staffRedirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, staffRedirectTo }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoadingSession, isRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const shouldRedirectStaffAway = !!staffRedirectTo && !!user && user.role !== "customer";

  React.useEffect(() => {
    if (isLoadingSession) return;
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (allowedRoles && !isRole(allowedRoles)) {
      router.replace("/");
    } else if (shouldRedirectStaffAway) {
      router.replace(staffRedirectTo);
    }
  }, [isLoadingSession, isAuthenticated, allowedRoles, isRole, router, pathname, shouldRedirectStaffAway, staffRedirectTo]);

  if (
    isLoadingSession ||
    !isAuthenticated ||
    (allowedRoles && !isRole(allowedRoles)) ||
    shouldRedirectStaffAway
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
