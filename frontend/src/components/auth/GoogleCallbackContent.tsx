"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getRoleHomeRoute } from "@/lib/utils/auth";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { gsap } from "@/lib/animations/gsap";
import { Button } from "@/components/ui/button";

/**
 * Landing page for the Google OAuth redirect (backend's /auth/google/callback
 * -> here). The refresh cookie is already set server-side by that point —
 * this just hydrates the client session from it and moves on. A failed
 * exchange lands here with no session to hydrate, which reads the same as
 * any other failure below (the backend's own failure path instead redirects
 * straight to /auth/login?error=google_auth_failed, so this branch is
 * mainly a safety net for an interrupted/slow network round trip).
 */
export function GoogleCallbackContent() {
  const router = useRouter();
  const { completeExternalLogin } = useAuth();
  const [status, setStatus] = React.useState<"working" | "error">("working");

  // Sprint 17: `status` drives what's rendered, but `displayStatus` is what
  // actually renders — a beat behind, so a GSAP fade+scale-out can play
  // against the old content before the new content (working -> error)
  // swaps in, instead of a hard jump-cut. Same buffered-state pattern as
  // PageTransition.tsx.
  const [displayStatus, setDisplayStatus] = React.useState(status);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    let cancelled = false;

    completeExternalLogin().then((result) => {
      if (cancelled) return;
      if (result.success) {
        router.replace(getRoleHomeRoute(result.user?.role));
      } else {
        setStatus("error");
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (status === displayStatus) return;

    if (prefersReducedMotion || !containerRef.current) {
      setDisplayStatus(status);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => setDisplayStatus(status),
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  React.useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }
      );
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayStatus]);

  if (displayStatus === "error") {
    return (
      <div ref={containerRef} className="section-container flex flex-col items-center gap-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <XCircle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold">Google Sign-In Failed</h1>
        <p className="max-w-sm text-muted-foreground">We couldn&apos;t complete sign-in with Google. Please try again.</p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="section-container flex flex-col items-center gap-4 py-24 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground">Finishing sign-in…</p>
    </div>
  );
}
