"use client";

import { useEffect, useRef } from "react";
import { FOOD_CATEGORIES } from "@/lib/constants/homepage-data";
import { CategoryCard } from "@/components/home/CategoryCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function Categories() {
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Sprint 17 — scale/rotate-in stagger per tile (ScrollTrigger), giving
  // this grid its own identity distinct from the fade/rise used at
  // Featured Meals and the horizontal slide at Today's Specials.
  useEffect(() => {
    const el = gridRef.current;
    if (!el || prefersReducedMotion) return;

    const tiles = Array.from(el.children);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tiles,
        { opacity: 0, scale: 0.85, rotate: -3 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.7,
          ease: "back.out(1.6)",
          stagger: 0.07,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="bg-muted/40 py-20 sm:py-28" aria-labelledby="categories-heading">
      <div className="section-container">
        <SectionHeading
          eyebrow="Explore"
          title="Food Categories"
          subtitle="However you're dining today — quick, slow, sweet, or celebratory — there's a menu built for it."
          className="mx-auto mb-14 max-w-3xl"
        />

        <div ref={gridRef} className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {FOOD_CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
