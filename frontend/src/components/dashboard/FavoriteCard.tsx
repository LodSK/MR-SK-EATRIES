"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import type { MenuItem } from "@/types/menu";
import { CATEGORY_IMAGE } from "@/lib/constants/media";
import { Rating } from "@/components/shared/Rating";
import { PriceTag } from "@/components/menu/PriceTag";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";

interface FavoriteCardProps {
  item: MenuItem;
  onRemove: (id: string) => void;
}

export function FavoriteCard({ item, onRemove }: FavoriteCardProps) {
  const { addItem } = useCart();
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative h-32 overflow-hidden">
        <Image src={item.images?.[0] ?? CATEGORY_IMAGE[item.category]} alt={item.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from favorites`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-brand-accent backdrop-blur-sm hover:bg-white/25"
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/menu/${item.category}/${item.slug}`} className="font-display text-sm font-bold hover:text-brand-primary dark:hover:text-brand-accent">
          {item.name}
        </Link>
        <div className="flex items-center justify-between">
          <Rating value={item.rating} size="sm" />
          <PriceTag price={item.price} currency={item.currency} size="sm" />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-1"
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
          <Plus className="h-3.5 w-3.5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
