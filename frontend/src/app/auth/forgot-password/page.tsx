import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your MR_SK EATRIES account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email and we'll send you a reset link.">
      <GuestRoute>
        <ForgotPasswordForm />
      </GuestRoute>
    </AuthLayout>
  );
}
