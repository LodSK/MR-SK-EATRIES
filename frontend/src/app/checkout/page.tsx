import type { Metadata } from "next";
import { CheckoutPageContent } from "@/components/cart/CheckoutPageContent";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your MR_SK EATRIES order — delivery details, payment, and order summary.",
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
