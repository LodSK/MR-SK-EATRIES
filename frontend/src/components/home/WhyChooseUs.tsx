"use client";

import { WHY_CHOOSE_US_ITEMS } from "@/lib/constants/homepage-data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

export function WhyChooseUs() {
  const gridRef = useScrollReveal<HTMLDivElement>({ y: 24, stagger: 0.1 });

  return (
    <section className="section-container py-20 sm:py-28" aria-labelledby="why-choose-us-heading">
      <SectionHeading
        eyebrow="Why MR_SK EATRIES"
        title="Why Choose Us"
        subtitle="Every detail — from the produce we buy to the team that greets you — is built around one goal: a meal worth talking about."
        className="mx-auto mb-14 max-w-3xl"
      />

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {WHY_CHOOSE_US_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-7 transition-colors duration-300 hover:border-brand-accent/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-brand-accent transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-bold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
