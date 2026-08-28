"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";
import { SOCIAL_POSTS } from "@/lib/constants/social-gallery-data";
import { CATEGORY_ICON } from "@/lib/constants/homepage-data";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/config/site";
import { SOCIAL_IMAGE_POOL } from "@/lib/constants/media";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils/cn";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const instagramProfile = SOCIAL_LINKS.find((s) => s.icon === "instagram")?.href ?? "#";

export function InstagramGallery() {
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Sprint 17 — staggered scale-in reveal, giving the gallery a "curated
  // wall" feel rather than a static grid.
  useEffect(() => {
    const el = gridRef.current;
    if (!el || prefersReducedMotion) return;

    const tiles = Array.from(el.children);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tiles,
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="section-container py-20 sm:py-28" aria-labelledby="social-gallery-heading">
      <SectionHeading
        eyebrow="Follow Along"
        title="From Our Table to Yours"
        subtitle={`Tag us @mrsk.eatries for a chance to be featured — or follow along for the dishes that don't always make it to the menu.`}
        className="mx-auto mb-14 max-w-3xl"
      />

      <div
        ref={gridRef}
        className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[160px] sm:gap-4 md:grid-cols-4"
      >
        {SOCIAL_POSTS.map((post, index) => {
          const Icon = CATEGORY_ICON[post.category];
          const imageSrc = SOCIAL_IMAGE_POOL[index % SOCIAL_IMAGE_POOL.length]!;
          return (
            <a
              key={post.id}
              href={instagramProfile}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View on Instagram: ${post.caption}`}
              className={cn(
                "group relative flex items-center justify-center overflow-hidden rounded-xl bg-card",
                post.tall && "row-span-2"
              )}
            >
              <Image
                src={imageSrc}
                alt=""
                loading="lazy"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10" aria-hidden="true" />
              <Icon className="absolute h-10 w-10 text-white/70" strokeWidth={1.25} aria-hidden="true" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 p-4 text-center opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-white" />
                <p className="text-xs font-medium text-white/90">{post.caption}</p>
              </div>
            </a>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <a
          href={instagramProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-primary hover:underline dark:text-brand-accent"
        >
          @{SITE_CONFIG.shortName.toLowerCase()}.eatries
        </a>{" "}
        on Instagram
      </p>
    </section>
  );
}
