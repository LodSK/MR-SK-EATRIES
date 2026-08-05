"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";

interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * The cart's state itself lives in a Zustand store (`lib/store/cartStore.ts`),
 * not React Context — Zustand's external-store model already avoids prop
 * drilling without a Provider wrapping the tree. This component still
 * exists as the app's single, explicit integration point for cart-adjacent
 * global UI (today: the `CartDrawer` overlay) and is where Sprint 8 will
 * hook in merging a guest session's cart into an authenticated user's
 * cart on login, without every page needing to know that happened.
 */
export function CartProvider({ children }: CartProviderProps) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
