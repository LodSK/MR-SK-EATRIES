"use client";

import { motion } from "framer-motion";
import { TRUST_INDICATORS } from "@/lib/constants/about-data";
import { TrustIndicatorCard } from "@/components/about/TrustIndicatorCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer } from "@/lib/animations/variants";

export function WhyCustomersLoveUs() {
  return (
    <section className="bg-muted/40 py-20 sm:py-28" aria-labelledby="why-customers-love-us-heading">
      <div className="section-container">
        <SectionHeading
          eyebrow="Trust"
          title="Why Customers Love Us"
          subtitle="Numbers we're proud of — because they reflect what actually happens in the kitchen and the dining room."
          className="mx-auto mb-14 max-w-3xl"
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {TRUST_INDICATORS.map((indicator) => (
            <TrustIndicatorCard key={indicator.title} indicator={indicator} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
