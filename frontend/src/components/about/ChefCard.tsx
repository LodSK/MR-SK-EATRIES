"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ChefProfile } from "@/types/about";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { SOCIAL_ICON_MAP } from "@/lib/constants/social-icons";
import { CHEF_IMAGE } from "@/lib/constants/media";
import { fadeUp } from "@/lib/animations/variants";

interface ChefCardProps {
  chef: ChefProfile;
}

export function ChefCard({ chef }: ChefCardProps) {
  const photoSrc = CHEF_IMAGE[chef.id];

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-7 text-center transition-shadow duration-300 hover:shadow-lg"
    >
      {photoSrc ? (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
          <Image src={photoSrc} alt={chef.name} fill className="object-cover" sizes="80px" />
        </div>
      ) : (
        <InitialsAvatar initials={chef.avatarInitials} size="lg" />
      )}

      <div>
        <h3 className="font-display text-lg font-bold">{chef.name}</h3>
        <p className="text-sm font-medium text-brand-primary dark:text-brand-accent">
          {chef.role}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {chef.specialty}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {chef.experienceYears}+ Years
        </span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{chef.bio}</p>

      <div className="mt-1 flex items-center gap-2">
        {chef.socials.map((social) => {
          const Icon = SOCIAL_ICON_MAP[social.icon];
          return (
            <a
              key={social.icon}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${chef.name} on ${social.icon}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-brand-primary hover:text-brand-primary dark:hover:border-brand-accent dark:hover:text-brand-accent"
            >
              <Icon className="h-4 w-4" />
            </a>
          );
        })}
      </div>
    </motion.article>
  );
}
