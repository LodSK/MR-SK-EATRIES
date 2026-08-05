"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { changePasswordSchema, type ChangePasswordSchemaValues } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordSchemaValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const newPassword = watch("newPassword");

  async function onSubmit(values: ChangePasswordSchemaValues) {
    const result = await changePassword(values);
    setMessage(result.message);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {status !== "idle" && message && <FormMessage type={status}>{message}</FormMessage>}

      <div>
        <label htmlFor="current-password" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Current Password
        </label>
        <PasswordInput id="current-password" {...register("currentPassword")} />
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="new-password" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          New Password
        </label>
        <PasswordInput id="new-password" {...register("newPassword")} />
        {errors.newPassword && <p className="mt-1 text-xs text-destructive">{errors.newPassword.message}</p>}
        <div className="mt-2">
          <PasswordStrength password={newPassword} />
        </div>
      </div>

      <div>
        <label htmlFor="confirm-new-password" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Confirm New Password
        </label>
        <PasswordInput id="confirm-new-password" {...register("confirmNewPassword")} />
        {errors.confirmNewPassword && (
          <p className="mt-1 text-xs text-destructive">{errors.confirmNewPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
      </Button>
    </form>
  );
}
