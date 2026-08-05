import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your MR_SK EATRIES account.",
};

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to track orders and check out faster.">
      <GuestRoute>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </GuestRoute>
    </AuthLayout>
  );
}
