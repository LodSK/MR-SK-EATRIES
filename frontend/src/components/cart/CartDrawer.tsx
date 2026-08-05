"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { backdropFade, menuPanel } from "@/lib/animations/variants";

export function CartDrawer() {
  const { items, totals, itemCount, isDrawerOpen, closeDrawer } = useCart();

  React.useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const currency = items[0]?.currency ?? "GHS";

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeDrawer}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-[100] flex w-[90%] max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-lg font-bold">
                Your Cart {itemCount > 0 && <span className="text-muted-foreground">({itemCount})</span>}
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="py-10">
                  <EmptyCart onContinueShopping={closeDrawer} />
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} compact />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <CartSummary totals={totals} currency={currency} onContinueShopping={closeDrawer} />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
