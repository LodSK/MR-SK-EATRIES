"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoadingSession } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoadingSession && isAuthenticated) {
      router.replace("/profile");
    }
  }, [isLoadingSession, isAuthenticated, router]);

  if (isLoadingSession) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
