import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutVerifyContent } from "@/components/cart/CheckoutVerifyContent";

export const metadata: Metadata = {
  title: "Confirming Payment",
};

export default function CheckoutVerifyPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutVerifyContent />
    </Suspense>
  );
}
