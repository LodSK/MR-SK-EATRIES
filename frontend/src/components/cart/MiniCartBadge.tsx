"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/hooks/useCart";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function MiniCartBadge() {
  const { itemCount, hasHydrated } = useCart();
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Framer's AnimatePresence (below) owns the 0 <-> nonzero mount/unmount
  // transition — genuinely a mount/unmount case, its strong suit. This
  // effect owns the separate "still visible, count just changed" case with
  // a GSAP bump, so a 2->3 change doesn't have to remount the whole badge
  // just to get a pop.
  useEffect(() => {
    const el = badgeRef.current;
    if (!el || !hasHydrated || itemCount === 0 || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { scale: 1 }, { scale: 1.3, duration: 0.12, ease: "power1.out", yoyo: true, repeat: 1 });
    }, el);

    return () => ctx.revert();
  }, [itemCount, hasHydrated, prefersReducedMotion]);

  // Avoid a hydration flash: render nothing until the persisted cart has loaded.
  if (!hasHydrated || itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.span
        ref={badgeRef}
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
