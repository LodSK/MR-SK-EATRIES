"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { FoodCategory } from "@/types/menu";
import { CATEGORY_ICON } from "@/lib/constants/homepage-data";
import { fadeUp } from "@/lib/animations/variants";

interface CategoryCardProps {
  category: FoodCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = CATEGORY_ICON[category.slug];

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/menu/${category.slug}`}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-glow-primary sm:p-7"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white dark:bg-brand-accent/10 dark:text-brand-accent dark:group-hover:bg-brand-accent dark:group-hover:text-brand-secondary">
            <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <ArrowUpRight className="h-5 w-5 -translate-x-1 translate-y-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
        </div>

        <div className="mt-8">
          <h3 className="font-display text-xl font-bold">{category.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-primary dark:text-brand-accent">
            {category.itemCount} Dishes
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
