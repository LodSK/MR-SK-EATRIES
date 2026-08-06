"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations/variants";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { verifyEmail } = useAuth();

  const [status, setStatus] = React.useState<"checking" | "success" | "error">("checking");
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    verifyEmail(token).then((result) => {
      if (cancelled) return;
      setStatus(result.success ? "success" : "error");
      setMessage(result.message);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="section-container flex flex-col items-center gap-4 py-24 text-center"
    >
      {status === "checking" && (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Verifying your email…</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">Email Verified</h1>
          <p className="max-w-sm text-muted-foreground">{message}</p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/profile">Go to Profile</Link>
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">Verification Failed</h1>
          <p className="max-w-sm text-muted-foreground">{message}</p>
          <Button asChild size="lg" variant="outline" className="mt-2">
            <Link href="/profile">Back to Profile</Link>
          </Button>
        </>
      )}
    </motion.div>
  );
}
