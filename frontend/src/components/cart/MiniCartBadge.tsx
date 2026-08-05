"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/hooks/useCart";

export function MiniCartBadge() {
  const { itemCount, hasHydrated } = useCart();

  // Avoid a hydration flash: render nothing until the persisted cart has loaded.
  if (!hasHydrated || itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.span
        key={itemCount}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white"
      >
        {itemCount > 99 ? "99+" : itemCount}
      </motion.span>
    </AnimatePresence>
  );
}
