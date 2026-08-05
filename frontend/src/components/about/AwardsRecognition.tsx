"use client";

import { motion } from "framer-motion";
import { AWARDS } from "@/lib/constants/about-data";
import { AwardCard } from "@/components/about/AwardCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer } from "@/lib/animations/variants";

export function AwardsRecognition() {
  return (
    <section className="section-container py-20 sm:py-28" aria-labelledby="awards-heading">
      <SectionHeading
        eyebrow="Recognition"
        title="Awards & Recognition"
        subtitle="A decade of consistency, recognized by the guides and associations that guests trust."
        className="mx-auto mb-14 max-w-3xl"
      />

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      >
        {AWARDS.map((award) => (
          <AwardCard key={award.id} award={award} />
        ))}
      </motion.div>
    </section>
  );
}
