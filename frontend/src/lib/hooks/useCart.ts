"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { calculateItemCount, calculateOrderTotals } from "@/lib/utils/cart";

/**
 * The single entry point for all cart reads and writes. Every cart UI
 * component (`CartDrawer`, `CartItem`, `CheckoutForm`, the Navbar badge,
 * "Add to Cart" buttons across the homepage/menu) calls this hook — none
 * of them import `useCartStore` or `lib/utils/cart` directly. That
 * indirection is what lets Sprint 8 (authenticated carts) or Sprint 9
 * (backend-synced carts) change how state is sourced without touching
 * any consuming component.
 */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  const coupon = useCartStore((s) => s.coupon);
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const openDrawer = useCartStore((s) => s.openDrawer);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);

  const setDeliveryMethod = useCartStore((s) => s.setDeliveryMethod);
  const applyCouponResult = useCartStore((s) => s.applyCouponResult);

  const itemCount = calculateItemCount(items);
  const totals = calculateOrderTotals({ items, deliveryMethod, coupon });

  return {
    items,
    itemCount,
    totals,
    deliveryMethod,
    coupon,
    isDrawerOpen,
    hasHydrated,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setDeliveryMethod,
    applyCouponResult,
  };
}
