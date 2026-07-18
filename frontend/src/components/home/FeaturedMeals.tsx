"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FEATURED_MEALS } from "@/lib/constants/homepage-data";
import { MealCard } from "@/components/home/MealCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { staggerContainer } from "@/lib/animations/variants";

export function FeaturedMeals() {
  return (
    <section className="section-container py-20 sm:py-28" aria-labelledby="featured-meals-heading">
      <SectionHeading
        eyebrow="From Our Kitchen"
        title="Featured Meals"
        subtitle="A handful of guest favorites — the dishes people come back for, plated the way they were meant to be."
        className="mx-auto mb-14 max-w-3xl"
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURED_MEALS.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </motion.div>

      <div className="mt-12 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/menu">
            View Full Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
