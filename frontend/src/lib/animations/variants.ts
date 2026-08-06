import type { Variants } from "framer-motion";

/** Standard "out-expo" easing used across the site for a premium, decelerated feel. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

/** Wrap a group of children with this on the parent, then apply `fadeUp` to each child. */
export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/** Mobile menu panel slide + fade, paired with AnimatePresence. */
export const menuPanel: Variants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.35, ease: EASE_OUT_EXPO },
  },
};

/** Backdrop fade, paired with menuPanel. */
export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
