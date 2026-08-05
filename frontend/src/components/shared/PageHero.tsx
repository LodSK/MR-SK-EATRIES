"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/Breadcrumb";
import { staggerContainer, fadeUp } from "@/lib/animations/variants";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbItems: BreadcrumbItem[];
  /** Optional real photography — falls back to a designed gradient scene until assets are supplied. */
  imageSrc?: string;
  /** Optional background video (mp4) — takes priority over `imageSrc` when provided. */
  videoSrc?: string;
  /** Slot for page-specific controls rendered below the subtitle (e.g. a search bar). */
  children?: React.ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbItems,
  imageSrc,
  videoSrc,
  children,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[420px] w-full items-end overflow-hidden bg-brand-secondary py-16 sm:min-h-[460px]">
      {/* No negative z-index (the section's own bg-brand-secondary paints in front
          of negative-z-index children); DOM order handles layering instead.
          See Hero.tsx for the full note on this bug. */}
      <div className="absolute inset-0">
        {videoSrc ? (
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster={imageSrc}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : imageSrc ? (
          <Image src={imageSrc} alt="" fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-primary-dark/40 via-brand-secondary to-black">
            <div className="bg-noise absolute inset-0 opacity-[0.06]" aria-hidden="true" />
            <div
              className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-brand-accent/20 blur-[100px]"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-hero-gradient" aria-hidden="true" />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="visible"
        className="section-container relative flex flex-col gap-4"
      >
        <motion.div variants={fadeUp}>
          <Breadcrumb items={breadcrumbItems} light />
        </motion.div>

        {eyebrow && (
          <motion.span variants={fadeUp} className="eyebrow text-brand-accent">
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          variants={fadeUp}
          className="text-balance font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p variants={fadeUp} className="max-w-xl text-balance text-white/70">
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div variants={fadeUp} className="mt-2">
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
