"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations/variants";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const MAGNETIC_STRENGTH = 0.35;
const MAGNETIC_MAX_OFFSET = 10;

/**
 * A pointer-tracking effect like this is a continuous imperative
 * interaction, not an entry/exit/layout transition — GSAP's `quickTo` is
 * built for exactly this (a reusable, high-perf tween updated every
 * pointermove) where Framer Motion would need `useMotionValue` wiring for
 * the same result. Kept local to this one CTA rather than a shared hook —
 * this is the only magnetic-hover use case in the plan.
 */
function useMagneticHover<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = useReducedMotion();

  function handleMouseMove(e: React.MouseEvent<T>) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const x = gsap.utils.clamp(-MAGNETIC_MAX_OFFSET, MAGNETIC_MAX_OFFSET, relX * MAGNETIC_STRENGTH);
    const y = gsap.utils.clamp(-MAGNETIC_MAX_OFFSET, MAGNETIC_MAX_OFFSET, relY * MAGNETIC_STRENGTH);
    gsap.to(ref.current, { x, y, duration: 0.3, ease: "power2.out" });
  }

  function handleMouseLeave() {
    if (prefersReducedMotion || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
  }

  return { ref, handleMouseMove, handleMouseLeave };
}

export function AboutCTA() {
  const magnetic = useMagneticHover<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden bg-brand-secondary py-20 sm:py-24">
      <div className="bg-noise absolute inset-0 opacity-[0.04]" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-primary/20 blur-[120px]"
        aria-hidden="true"
      />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="section-container relative flex flex-col items-center gap-6 text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-balance font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          Come Taste the Story Yourself
        </motion.h2>
        <motion.p variants={fadeUp} className="max-w-xl text-balance text-white/65">
          Whether it's a quiet dinner or a table for twelve, we'd love to have you.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <div
            ref={magnetic.ref}
            onMouseMove={magnetic.handleMouseMove}
            onMouseLeave={magnetic.handleMouseLeave}
            className="inline-block"
          >
            <Button asChild size="lg" variant="accent">
              <Link href="/reservations">Reserve a Table</Link>
            </Button>
          </div>
          <Button asChild size="lg" variant="default">
            <Link href="/menu">View Menu</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
