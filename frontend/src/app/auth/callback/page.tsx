import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleCallbackContent } from "@/components/auth/GoogleCallbackContent";

export const metadata: Metadata = {
  title: "Signing In",
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
