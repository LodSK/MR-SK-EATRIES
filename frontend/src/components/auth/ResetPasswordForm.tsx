"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordSchemaValues } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [done, setDone] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  async function onSubmit(values: ResetPasswordSchemaValues) {
    setServerError(null);
    const result = await resetPassword({ token, password: values.password });
    if (!result.success) {
      setServerError(result.message);
      return;
    }
    setDone(true);
  }

  if (!token) {
    return <FormMessage type="error">This reset link is missing or invalid. Request a new one.</FormMessage>;
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="text-sm text-muted-foreground">Your password has been reset.</p>
        <Button asChild size="lg">
          <Link href="/auth/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {serverError && <FormMessage type="error">{serverError}</FormMessage>}

      <div>
        <label htmlFor="reset-password" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          New Password
        </label>
        <PasswordInput id="reset-password" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        <div className="mt-2">
          <PasswordStrength password={password} />
        </div>
      </div>

      <div>
        <label htmlFor="reset-confirm" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Confirm New Password
        </label>
        <PasswordInput id="reset-confirm" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
      </Button>
    </form>
  );
}
