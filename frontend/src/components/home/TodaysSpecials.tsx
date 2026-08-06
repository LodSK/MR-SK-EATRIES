"use client";

import { useEffect, useRef } from "react";
import { TODAYS_SPECIALS } from "@/lib/constants/specials-data";
import { SpecialCard } from "@/components/home/SpecialCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function TodaysSpecials() {
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Sprint 17 — horizontal-reveal stagger (cards slide in from alternating
  // sides), distinct from the vertical fade/rise reveal used elsewhere, to
  // give the one "kitchen's choice, today only" section its own identity.
  useEffect(() => {
    const el = gridRef.current;
    if (!el || prefersReducedMotion) return;

    const cards = Array.from(el.children);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, x: (i: number) => (i % 2 === 0 ? -48 : 48) },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="bg-muted/40 py-20 sm:py-28" aria-labelledby="todays-specials-heading">
      <div className="section-container">
        <SectionHeading
          eyebrow="Today Only"
          title="Today's Specials"
          subtitle="A short list of dishes at a discount today — kitchen's choice, while they last."
          className="mx-auto mb-14 max-w-3xl"
        />

        <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TODAYS_SPECIALS.map((special) => (
            <SpecialCard key={special.id} special={special} />
          ))}
        </div>
      </div>
    </section>
  );
}
