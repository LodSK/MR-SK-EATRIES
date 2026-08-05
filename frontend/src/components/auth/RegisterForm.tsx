"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { registerSchema, type RegisterSchemaValues } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { FormMessage } from "@/components/auth/FormMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", agreeToTerms: false },
  });

  const password = watch("password");
  const agreeToTerms = watch("agreeToTerms");

  async function onSubmit(values: RegisterSchemaValues) {
    setServerError(null);
    const result = await registerUser(values);
    if (!result.success) {
      setServerError(result.message);
      return;
    }
    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {serverError && <FormMessage type="error">{serverError}</FormMessage>}

      <div>
        <label htmlFor="register-name" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Full Name
        </label>
        <input
          id="register-name"
          type="text"
          {...register("fullName")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Email Address
        </label>
        <input
          id="register-email"
          type="email"
          {...register("email")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Password
        </label>
        <PasswordInput id="register-password" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        <div className="mt-2">
          <PasswordStrength password={password} />
        </div>
      </div>

      <div>
        <label htmlFor="register-confirm" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Confirm Password
        </label>
        <PasswordInput id="register-confirm" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <Checkbox
            checked={agreeToTerms}
            onCheckedChange={(v) => setValue("agreeToTerms", v === true)}
            className="mt-0.5"
          />
          I agree to the{" "}
          <Link href="/terms" className="font-semibold text-brand-primary hover:underline dark:text-brand-accent">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-brand-primary hover:underline dark:text-brand-accent">
            Privacy Policy
          </Link>
        </label>
        {errors.agreeToTerms && (
          <p className="mt-1 text-xs text-destructive">{errors.agreeToTerms.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-brand-primary hover:underline dark:text-brand-accent">
          Log in
        </Link>
      </p>
    </form>
  );
}
