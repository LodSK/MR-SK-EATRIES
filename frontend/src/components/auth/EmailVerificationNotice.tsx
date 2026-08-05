"use client";

import * as React from "react";
import { Loader2, MailWarning } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function EmailVerificationNotice() {
  const { user, resendVerificationEmail } = useAuth();
  const [sent, setSent] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  if (!user || user.isEmailVerified) return null;

  async function handleResend() {
    setIsSending(true);
    const result = await resendVerificationEmail();
    setIsSending(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
        <MailWarning className="h-4 w-4 shrink-0 translate-y-0.5" />
        <span>
          {sent
            ? "Verification email sent — check your inbox."
            : "Please verify your email address to unlock all features."}
        </span>
      </div>
      {!sent && (
        <Button variant="outline" size="sm" onClick={handleResend} disabled={isSending}>
          {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Resend Email
        </Button>
      )}
    </div>
  );
}
