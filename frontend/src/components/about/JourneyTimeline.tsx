"use client";

import { TIMELINE_MILESTONES } from "@/lib/constants/about-data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { cn } from "@/lib/utils/cn";

export function JourneyTimeline() {
  const listRef = useScrollReveal<HTMLOListElement>({ y: 28, stagger: 0.15 });

  return (
    <section className="section-container py-20 sm:py-28" aria-labelledby="journey-timeline-heading">
      <SectionHeading
        eyebrow="Our Journey"
        title="A Decade in the Making"
        subtitle="From a folding table to a full dining room — the milestones that shaped MR_SK EATRIES."
        className="mx-auto mb-16 max-w-3xl"
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Center line on desktop, left-aligned line on mobile */}
        <div
          className="absolute bottom-0 left-4 top-0 w-px bg-border sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden="true"
        />

        <ol ref={listRef} className="flex flex-col gap-10">
          {TIMELINE_MILESTONES.map((milestone, index) => {
            const isEven = index % 2 === 0;
            return (
              <li
                key={milestone.id}
                className={cn(
                  "relative flex flex-col gap-2 pl-12 sm:w-1/2 sm:pl-0",
                  isEven ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12 sm:text-left"
                )}
              >
                <span
                  className={cn(
                    "absolute left-[9px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-brand-primary sm:top-1",
                    isEven ? "sm:-right-[7px] sm:left-auto" : "sm:-left-[7px]"
                  )}
                  aria-hidden="true"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-brand-primary dark:text-brand-accent">
                  {milestone.year}
                </span>
                <h3 className="font-display text-lg font-bold">{milestone.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {milestone.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
