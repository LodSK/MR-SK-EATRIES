"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginSchemaValues } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { getRoleHomeRoute } from "@/lib/utils/auth";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { RememberMeCheckbox } from "@/components/auth/RememberMeCheckbox";
import { FormMessage } from "@/components/auth/FormMessage";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const rememberMe = watch("rememberMe");

  React.useEffect(() => {
    if (searchParams.get("error") === "google_auth_failed") {
      setServerError("We couldn't complete sign-in with Google. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: LoginSchemaValues) {
    setServerError(null);
    const result = await login(values);
    if (!result.success) {
      setServerError(result.message);
      return;
    }
    const redirect = searchParams.get("redirect");
    router.push(redirect || getRoleHomeRoute(result.user?.role));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {serverError && <FormMessage type="error">{serverError}</FormMessage>}

      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          {...register("email")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Password
        </label>
        <PasswordInput id="login-password" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <RememberMeCheckbox checked={rememberMe} onChange={(v) => setValue("rememberMe", v)} />
        <Link href="/auth/forgot-password" className="text-xs font-semibold text-brand-primary hover:underline dark:text-brand-accent">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-brand-primary hover:underline dark:text-brand-accent">
          Create one
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Demo: demo@mrsk-eatries.com / Demo1234
      </p>
    </form>
  );
}
