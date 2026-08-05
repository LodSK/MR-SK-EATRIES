import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the items in your MR_SK EATRIES cart before checking out.",
};

export default function CartPage() {
  return <CartPageContent />;
}
