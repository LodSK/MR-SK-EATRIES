"use client";

import { motion } from "framer-motion";

/**
 * Full-viewport branded loader. Used by app/loading.tsx (route-level
 * Suspense fallback) and can be reused for client-side transitions.
 */
export function LoadingScreen() {
  const letters = "MR_SK EATRIES".split("");

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-brand-secondary"
    >
      <div className="flex overflow-hidden">
        {letters.map((letter, i) => (
          <motion.span
            key={`${letter}-${i}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: i * 0.035,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-display text-2xl font-semibold tracking-[0.15em] text-brand-cream sm:text-4xl"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="h-[2px] w-40 origin-left bg-brand-accent sm:w-56"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="font-accent text-lg italic text-brand-accent/90 sm:text-xl"
      >
        Taste Beyond Expectations
      </motion.p>
    </div>
  );
}
