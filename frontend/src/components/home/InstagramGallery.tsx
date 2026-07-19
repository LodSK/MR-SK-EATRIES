"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { SOCIAL_POSTS } from "@/lib/constants/social-gallery-data";
import { CATEGORY_ICON } from "@/lib/constants/homepage-data";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/config/site";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { staggerContainer, fadeUp } from "@/lib/animations/variants";
import { cn } from "@/lib/utils/cn";

const instagramProfile = SOCIAL_LINKS.find((s) => s.icon === "instagram")?.href ?? "#";

export function InstagramGallery() {
  return (
    <section className="section-container py-20 sm:py-28" aria-labelledby="social-gallery-heading">
      <SectionHeading
        eyebrow="Follow Along"
        title="From Our Table to Yours"
        subtitle={`Tag us @mrsk.eatries for a chance to be featured — or follow along for the dishes that don't always make it to the menu.`}
        className="mx-auto mb-14 max-w-3xl"
      />

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[160px] sm:gap-4 md:grid-cols-4"
      >
        {SOCIAL_POSTS.map((post) => {
          const Icon = CATEGORY_ICON[post.category];
          return (
            <motion.a
              key={post.id}
              variants={fadeUp}
              href={instagramProfile}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View on Instagram: ${post.caption}`}
              className={cn(
                "group relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-secondary via-brand-secondary to-brand-primary-dark",
                post.tall && "row-span-2"
              )}
            >
              <div className="bg-noise absolute inset-0 opacity-[0.05]" aria-hidden="true" />
              <Icon
                className="h-10 w-10 text-white/20 transition-transform duration-500 group-hover:scale-110"
                strokeWidth={1.25}
                aria-hidden="true"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 p-4 text-center opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-white" />
                <p className="text-xs font-medium text-white/90">{post.caption}</p>
              </div>
            </motion.a>
          );
        })}
      </motion.div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <a
          href={instagramProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-primary hover:underline dark:text-brand-accent"
        >
          @{SITE_CONFIG.shortName.toLowerCase()}.eatries
        </a>{" "}
        on Instagram
      </p>
    </section>
  );
}
