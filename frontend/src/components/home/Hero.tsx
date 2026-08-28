"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, MapPin, UtensilsCrossed } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations/variants";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const HEADLINE_WORDS = ["Where", "Every", "Plate"];
const HEADLINE_WORDS_LINE_2 = ["Tells", "a"];

interface HeroProps {
  /** Optional real photography — falls back to a designed gradient scene until assets are supplied. */
  imageSrc?: string;
  /** Optional background video (mp4) — takes priority over `imageSrc` when provided. */
  videoSrc?: string;
}

/**
 * Sprint 17 — subtle steam/smoke drift behind the hero image. Deliberately
 * not a canvas/particle system (the animation plan rules that out on
 * performance grounds): three blurred gradient wisps, same visual language
 * as the existing placeholder gradient blobs below, looped with GSAP.
 * Static (no loop) under prefers-reduced-motion rather than hidden — it
 * still reads as atmospheric lighting even without the drift.
 */
function SteamDrift({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const wispRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const wisps = wispRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (wisps.length === 0) return;

    const ctx = gsap.context(() => {
      wisps.forEach((el, i) => {
        gsap.to(el, {
          y: -28 - i * 6,
          x: i % 2 === 0 ? 14 : -14,
          opacity: 0.5,
          duration: 5 + i,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.6,
        });
      });
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            wispRefs.current[i] = el;
          }}
          className="absolute h-40 w-40 rounded-full bg-white/[0.07] opacity-30 blur-3xl"
          style={{
            left: `${28 + i * 22}%`,
            top: `${38 - i * 8}%`,
          }}
        />
      ))}
    </div>
  );
}

export function Hero({ imageSrc, videoSrc }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // GSAP Phase — animated typography: each headline word flies in on its
  // own stagger, independent of (and layered under) the Framer-driven
  // fade/rise the rest of the hero content already uses.
  useEffect(() => {
    if (prefersReducedMotion || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll<HTMLElement>(".hero-word");
    const tween = gsap.fromTo(
      words,
      { opacity: 0, y: "110%", rotateX: -40 },
      {
        opacity: 1,
        y: "0%",
        rotateX: 0,
        duration: 0.9,
        stagger: 0.06,
        delay: 0.15,
        ease: "power4.out",
      }
    );
    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion]);

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-brand-secondary"
    >
      {/* Background layer — no negative z-index: the section's own bg-brand-secondary
          paints in front of negative-z-index children in this stacking context, so
          layering is done via DOM order (background, then overlays, then content)
          instead. Caught live in a browser: a real photo here rendered as solid
          black until this was fixed — negative z-index had silently hidden every
          hero background image/gradient blob sitewide the whole project, unnoticed
          because the fallback gradient's absence looked enough like the intended
          dark scene to not be obviously broken. */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
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
            alt="Bright modern dining room at MR_SK EATRIES"
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

      <SteamDrift prefersReducedMotion={prefersReducedMotion} />

      {/* Legibility overlay — the gradient alone (tuned in tailwind.config.ts)
          already carries bottom-weighted legibility; this flat layer is
          just a light, uniform assist for the center-positioned content,
          not a second heavy darken pass (see the hero-gradient comment
          for why that combination crushed real photography to black). */}
      <div className="absolute inset-0 bg-hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/15" aria-hidden="true" />

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

        <h1
          ref={headlineRef}
          style={{ perspective: 800 }}
          className="text-balance font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
        >
          <span className="block overflow-hidden">
            {HEADLINE_WORDS.map((word) => (
              <span key={word} className="hero-word mr-3 inline-block last:mr-0">
                {word}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden">
            {HEADLINE_WORDS_LINE_2.map((word) => (
              <span key={word} className="hero-word mr-3 inline-block last:mr-0">
                {word}
              </span>
            ))}
            <span className="hero-word inline-block text-brand-accent">Story</span>
          </span>
        </h1>

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
