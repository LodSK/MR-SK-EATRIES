"use client";

import Image from "next/image";
import { Compass, Sparkles, Target } from "lucide-react";
import { OUR_STORY } from "@/lib/constants/about-data";
import { ABOUT_STORY_IMAGE } from "@/lib/constants/media";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

const PILLARS = [
  { icon: Target, label: "Mission", text: OUR_STORY.mission },
  { icon: Compass, label: "Vision", text: OUR_STORY.vision },
  { icon: Sparkles, label: "Philosophy", text: OUR_STORY.philosophy },
];

export function OurStory() {
  const pillarsRef = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.1 });

  return (
    <section className="section-container py-20 sm:py-28" aria-labelledby="our-story-heading">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow={OUR_STORY.eyebrow}
            title={OUR_STORY.heading}
            align="left"
          />
          <div className="mt-6 flex flex-col gap-4">
            {OUR_STORY.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-balance leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="relative min-h-[280px] overflow-hidden rounded-2xl lg:min-h-full">
          <Image
            src={ABOUT_STORY_IMAGE}
            alt="Inside the MR_SK EATRIES kitchen"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" aria-hidden="true" />
          <span className="absolute bottom-6 left-6 font-accent text-2xl italic text-white sm:text-3xl">
            Est. 2014
          </span>
        </div>
      </div>

      <div ref={pillarsRef} className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.label}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-accent/10 dark:text-brand-accent">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="font-display text-base font-bold">{pillar.label}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
