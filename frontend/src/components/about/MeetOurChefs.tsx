"use client";

import { motion } from "framer-motion";
import { CHEFS } from "@/lib/constants/about-data";
import { ChefCard } from "@/components/about/ChefCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer } from "@/lib/animations/variants";

export function MeetOurChefs() {
  return (
    <section className="bg-muted/40 py-20 sm:py-28" aria-labelledby="meet-our-chefs-heading">
      <div className="section-container">
        <SectionHeading
          eyebrow="The Kitchen"
          title="Meet Our Chefs"
          subtitle="The team behind every plate — decades of combined experience, one shared standard."
          className="mx-auto mb-14 max-w-3xl"
        />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CHEFS.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
