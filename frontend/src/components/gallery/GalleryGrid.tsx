"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GALLERY_ITEMS, GALLERY_FILTERS, type GalleryFilter } from "@/lib/constants/gallery-data";
import { CATEGORY_IMAGE, GALLERY_AMBIANCE_IMAGE } from "@/lib/constants/media";
import { staggerContainer, fadeUp } from "@/lib/animations/variants";
import { cn } from "@/lib/utils/cn";

export function GalleryGrid() {
  const [activeFilter, setActiveFilter] = React.useState<GalleryFilter>("all");

  const items =
    activeFilter === "all" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.filter === activeFilter);

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" aria-label="Gallery categories" className="flex flex-wrap justify-center gap-2">
        {GALLERY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              activeFilter === filter.value
                ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
                : "border-border text-muted-foreground hover:border-brand-primary/50 hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeFilter}
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="visible"
        className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 md:grid-cols-4"
      >
        {items.map((item) => {
          const imageSrc: string =
            (item.category ? CATEGORY_IMAGE[item.category] : GALLERY_AMBIANCE_IMAGE[item.ambianceImageKey ?? ""]) ??
            CATEGORY_IMAGE.dinner;
          return (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className={cn(
                "group relative overflow-hidden rounded-xl",
                item.tall && "row-span-2"
              )}
            >
              <Image
                src={imageSrc}
                alt={item.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(min-width: 768px) 25vw, 50vw"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs font-medium text-white">{item.caption}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
