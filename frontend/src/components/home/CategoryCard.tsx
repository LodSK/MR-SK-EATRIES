"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { FoodCategory } from "@/types/menu";
import { CATEGORY_ICON } from "@/lib/constants/homepage-data";
import { CATEGORY_IMAGE } from "@/lib/constants/media";
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
        className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-glow-primary sm:p-7"
      >
        <Image
          src={CATEGORY_IMAGE[category.slug]}
          alt=""
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" aria-hidden="true" />

        <div className="relative flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-brand-secondary">
            <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <ArrowUpRight className="h-5 w-5 -translate-x-1 translate-y-1 text-white/80 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
        </div>

        <div className="relative mt-8 text-white">
          <h3 className="font-display text-xl font-bold">{category.name}</h3>
          <p className="mt-1 text-sm text-white/75">{category.description}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-accent">
            {category.itemCount} Dishes
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
