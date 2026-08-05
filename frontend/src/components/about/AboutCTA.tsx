"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations/variants";

export function AboutCTA() {
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
          <Button asChild size="lg" variant="accent">
            <Link href="/reservations">Reserve a Table</Link>
          </Button>
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
