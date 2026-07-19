"use client";

import { motion } from "framer-motion";
import { TODAYS_SPECIALS } from "@/lib/constants/specials-data";
import { SpecialCard } from "@/components/home/SpecialCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer } from "@/lib/animations/variants";

export function TodaysSpecials() {
  return (
    <section className="bg-muted/40 py-20 sm:py-28" aria-labelledby="todays-specials-heading">
      <div className="section-container">
        <SectionHeading
          eyebrow="Today Only"
          title="Today's Specials"
          subtitle="A short list of dishes at a discount today — kitchen's choice, while they last."
          className="mx-auto mb-14 max-w-3xl"
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TODAYS_SPECIALS.map((special) => (
            <SpecialCard key={special.id} special={special} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
