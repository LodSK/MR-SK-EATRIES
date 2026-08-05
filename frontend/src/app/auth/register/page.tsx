import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your MR_SK EATRIES account.",
};

export default function RegisterPage() {
  return (
    <AuthLayout title="Create Your Account" subtitle="Join for faster checkout and order tracking.">
      <GuestRoute>
        <RegisterForm />
      </GuestRoute>
    </AuthLayout>
  );
}
