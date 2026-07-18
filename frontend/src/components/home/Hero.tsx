"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, MapPin, UtensilsCrossed } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations/variants";

interface HeroProps {
  /** Optional real photography — falls back to a designed gradient scene until assets are supplied. */
  imageSrc?: string;
  /** Optional background video (mp4) — takes priority over `imageSrc` when provided. */
  videoSrc?: string;
}

export function Hero({ imageSrc, videoSrc }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-brand-secondary"
    >
      {/* Background layer */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 scale-110">
        {videoSrc ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={imageSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : imageSrc ? (
          <Image
            src={imageSrc}
            alt="A signature dish at MR_SK EATRIES, elegantly plated"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          // Designed placeholder scene — swapped for real hero photography when available.
          <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary-dark/40 via-brand-secondary to-black">
            <div className="bg-noise absolute inset-0 opacity-[0.06]" aria-hidden="true" />
            <div
              className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-primary/30 blur-[100px]"
              aria-hidden="true"
            />
            <div
              className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-brand-accent/20 blur-[110px]"
              aria-hidden="true"
            />
          </div>
        )}
      </motion.div>

      {/* Legibility overlay */}
      <div className="absolute inset-0 -z-[5] bg-hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 -z-[5] bg-black/35" aria-hidden="true" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        variants={staggerContainer(0.14, 0.15)}
        initial="hidden"
        animate="visible"
        className="section-container relative flex flex-col items-center gap-6 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="eyebrow rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-brand-accent backdrop-blur-sm"
        >
          <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
          Now Open — Reservations Available Daily
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-balance font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
        >
          Where Every Plate
          <br />
          Tells a <span className="text-brand-accent">Story</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="max-w-xl text-balance font-accent text-xl italic text-white/80 sm:text-2xl"
        >
          Taste Beyond Expectations
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="max-w-lg text-balance text-sm leading-relaxed text-white/65 sm:text-base"
        >
          Modern comfort food, crafted cocktails, and a room built for
          celebrations big and small — from a quiet breakfast to a night to
          remember.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-2 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" variant="accent">
            <Link href="/reservations">Reserve a Table</Link>
          </Button>
          <Button asChild size="lg" variant="default">
            <Link href="/order">Order Online</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Link href="/menu">View Menu</Link>
          </Button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-1 flex items-center gap-1.5 text-xs text-white/50"
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          12 Independence Avenue, Accra
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
          Scroll
        </span>
        <div className="animate-float">
          <ChevronDown className="h-5 w-5 text-white/60" />
        </div>
      </motion.div>
    </section>
  );
}
