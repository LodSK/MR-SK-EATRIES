"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordSchemaValues } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [sent, setSent] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordSchemaValues) {
    const result = await forgotPassword(values);
    setServerMessage(result.message);
    if (result.success) setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Mail className="h-6 w-6" />
        </div>
        <p className="text-sm text-muted-foreground">{serverMessage}</p>
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-brand-primary hover:underline dark:text-brand-accent"
        >
          Back to Log In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {serverMessage && <FormMessage type="error">{serverMessage}</FormMessage>}

      <div>
        <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Email Address
        </label>
        <input
          id="forgot-email"
          type="email"
          {...register("email")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="font-semibold text-brand-primary hover:underline dark:text-brand-accent">
          Back to Log In
        </Link>
      </p>
    </form>
  );
}
