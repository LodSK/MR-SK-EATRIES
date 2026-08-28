"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Flame, Leaf, Plus } from "lucide-react";
import type { MenuItem } from "@/types/menu";
import { CATEGORY_IMAGE } from "@/lib/constants/media";
import { Rating } from "@/components/shared/Rating";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/menu/PriceTag";
import { fadeUp } from "@/lib/animations/variants";
import { useCart } from "@/lib/hooks/useCart";
import { useImageReveal } from "@/lib/hooks/useImageReveal";

interface MenuCardProps {
  item: MenuItem;
}

const TAG_VARIANT = {
  New: "accent",
  Popular: "primary",
  "Chef's Pick": "secondary",
} as const;

export function MenuCard({ item }: MenuCardProps) {
  const { addItem } = useCart();
  const imageRevealRef = useImageReveal<HTMLDivElement>();

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div ref={imageRevealRef} className="relative h-48 overflow-hidden">
        <Image
          src={item.images?.[0] ?? CATEGORY_IMAGE[item.category]}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" aria-hidden="true" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {item.tag && <Badge variant={TAG_VARIANT[item.tag]}>{item.tag}</Badge>}
        </div>

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {item.isVegetarian && (
            <Badge variant="success" icon={<Leaf className="h-3 w-3" />}>
              Veg
            </Badge>
          )}
          {item.isSpicy && (
            <Badge variant="spicy" icon={<Flame className="h-3 w-3" />}>
              Spicy
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-snug">{item.name}</h3>
          <PriceTag price={item.price} currency={item.currency} size="sm" />
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <Rating value={item.rating} reviewCount={item.reviewCount} />
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {item.prepTimeMinutes} min
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() =>
              addItem({
                id: item.id,
                name: item.name,
                slug: item.slug,
                category: item.category,
                price: item.price,
                currency: item.currency,
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/menu/${item.category}/${item.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
