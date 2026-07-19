"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FAQ_CATEGORIES } from "@/lib/constants/faq-data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils/cn";
import { fadeUp } from "@/lib/animations/variants";

export function FAQ() {
  const [activeCategory, setActiveCategory] = React.useState(FAQ_CATEGORIES[0]!.slug);

  const activeItems =
    FAQ_CATEGORIES.find((category) => category.slug === activeCategory)?.items ?? [];

  return (
    <section className="section-container py-20 sm:py-28" aria-labelledby="faq-heading">
      <SectionHeading
        eyebrow="Good to Know"
        title="Frequently Asked Questions"
        subtitle="Answers to what guests ask us most — about booking, ordering, delivery, and what to expect when you visit."
        className="mx-auto mb-12 max-w-3xl"
      />

      <div className="mx-auto max-w-3xl">
        <div
          role="tablist"
          aria-label="FAQ categories"
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === category.slug
                  ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
                  : "border-border text-muted-foreground hover:border-brand-primary/50 hover:text-foreground"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeCategory}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-2xl border border-border bg-card px-6 sm:px-8"
        >
          <Accordion type="single" collapsible className="w-full">
            {activeItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
