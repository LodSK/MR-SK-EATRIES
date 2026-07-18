"use client";

import { motion } from "framer-motion";
import { FOOD_CATEGORIES } from "@/lib/constants/homepage-data";
import { CategoryCard } from "@/components/home/CategoryCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer } from "@/lib/animations/variants";

export function Categories() {
  return (
    <section className="bg-muted/40 py-20 sm:py-28" aria-labelledby="categories-heading">
      <div className="section-container">
        <SectionHeading
          eyebrow="Explore"
          title="Food Categories"
          subtitle="However you're dining today — quick, slow, sweet, or celebratory — there's a menu built for it."
          className="mx-auto mb-14 max-w-3xl"
        />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5"
        >
          {FOOD_CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
