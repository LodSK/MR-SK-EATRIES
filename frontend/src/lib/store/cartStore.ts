import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CouponResult, DeliveryMethod } from "@/types/cart";
import { cartSessionStorage } from "@/lib/utils/cartStorage";

interface CartState {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  coupon: CouponResult | null;
  isDrawerOpen: boolean;
  /** True once the persisted cart has been read from sessionStorage on the client. */
  hasHydrated: boolean;

  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  setDeliveryMethod: (method: DeliveryMethod) => void;
  applyCouponResult: (result: CouponResult | null) => void;

  setHasHydrated: (value: boolean) => void;
}

/**
 * The cart's single source of truth. Components never call this store
 * directly — they go through `useCart()` (`lib/hooks/useCart.ts`), which
 * is the real public API and also derives totals/item counts. Keeping
 * this file free of derived/computed values (those live in
 * `lib/utils/cart.ts`) is what makes it trivial to later sync this state
 * with an authenticated user's session (Sprint 8) or a backend cart
 * (Sprint 9): the actions below are the exact same shape a server-backed
 * store would expose.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      deliveryMethod: "pickup",
      coupon: null,
      isDrawerOpen: false,
      hasHydrated: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          const items = existing
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            : [...state.items, { ...item, quantity }];
          return { items, isDrawerOpen: true };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [], coupon: null }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      setDeliveryMethod: (method) => set({ deliveryMethod: method }),
      applyCouponResult: (result) => set({ coupon: result }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "mrsk-cart",
      storage: createJSONStorage(() => cartSessionStorage),
      // Drawer visibility and hydration status are ephemeral UI state —
      // only the actual cart data should survive a reload.
      partialize: (state) => ({
        items: state.items,
        deliveryMethod: state.deliveryMethod,
        coupon: state.coupon,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
