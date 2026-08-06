"use client";

import { TIMELINE_MILESTONES } from "@/lib/constants/about-data";
import type { TimelineMilestone } from "@/types/about";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useFocusReveal } from "@/lib/hooks/useFocusReveal";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/** Mirrors tailwind.config.ts's brand.accent / brand.primary — inline
 * style needs literal values, Tailwind doesn't expose theme colors as
 * CSS custom properties by default. */
const EMBER_GRADIENT = "radial-gradient(circle, #FFD54F 0%, #C62828 32%, transparent 72%)";

/**
 * "Off the Fire" — the site's one committed dark moment, not a themed
 * section. An ember (the site's own brand-primary/brand-accent — already
 * named "ember / chili" and "saffron gold" in tailwind.config.ts, this
 * just finally puts that to use) drifts continuously along the spine,
 * independent of scroll — atmosphere, not a reveal effect. Each milestone
 * sits dim and soft off-center and sharpens into focus as it nears the
 * middle of the viewport, in both directions — a spotlight moving through
 * a dark room, not content arriving once and staying put. Stays dark in
 * both site themes on purpose: an ember is a light-emitting phenomenon,
 * it doesn't have a convincing daylight translation, and one deliberate
 * dark interlude against the rest of the (light-mode) page is the point.
 */
export function JourneyTimeline() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand-secondary py-20 sm:py-28" aria-labelledby="journey-timeline-heading">
      <SectionHeading
        eyebrow="Our Journey"
        title="A Decade in the Making"
        subtitle="From a folding table to a full dining room — the milestones that shaped MR_SK EATRIES."
        light
        className="relative z-10 mx-auto mb-20 max-w-3xl px-6 sm:mb-28"
      />

      <div className="relative mx-auto max-w-xl px-6">
        <div className="absolute inset-x-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/10" aria-hidden="true" />

        {!prefersReducedMotion && (
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full opacity-20 mix-blend-screen blur-3xl animate-ember-drift"
            style={{ background: EMBER_GRADIENT }}
            aria-hidden="true"
          />
        )}

        <ol className="relative flex flex-col gap-2">
          {TIMELINE_MILESTONES.map((milestone) => (
            <TimelineBeat key={milestone.id} milestone={milestone} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TimelineBeat({ milestone }: { milestone: TimelineMilestone }) {
  const { ref, inFocus } = useFocusReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={cn(
        "flex min-h-[38vh] flex-col items-center justify-center gap-2 py-10 text-center transition-all duration-500 ease-out-expo",
        inFocus ? "scale-100 opacity-100 blur-none" : "scale-[0.97] opacity-30 blur-[2px]"
      )}
    >
      <span
        className={cn(
          "mb-1 h-2 w-2 rounded-full bg-brand-accent transition-shadow duration-500",
          inFocus && "shadow-[0_0_16px_3px_rgba(255,213,79,0.6)]"
        )}
        aria-hidden="true"
      />
      <span className="text-3xl font-bold text-brand-accent sm:text-4xl">{milestone.year}</span>
      <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{milestone.title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-white/65">{milestone.description}</p>
    </li>
  );
}
