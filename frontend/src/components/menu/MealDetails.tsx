"use client";

import * as React from "react";
import { Clock, Flame, Leaf } from "lucide-react";
import type { MenuItem } from "@/types/menu";
import { Rating } from "@/components/shared/Rating";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/menu/PriceTag";
import { MealGallery } from "@/components/menu/MealGallery";
import { IngredientList } from "@/components/menu/IngredientList";
import { NutritionCard } from "@/components/menu/NutritionCard";
import { QuantitySelector } from "@/components/menu/QuantitySelector";
import { RelatedMeals } from "@/components/menu/RelatedMeals";
import { MealReviews } from "@/components/menu/MealReviews";
import { useCart } from "@/lib/hooks/useCart";

const TAG_VARIANT = {
  New: "accent",
  Popular: "primary",
  "Chef's Pick": "secondary",
} as const;

interface MealDetailsProps {
  item: MenuItem;
  relatedItems: MenuItem[];
}

export function MealDetails({ item, relatedItems }: MealDetailsProps) {
  const [quantity, setQuantity] = React.useState(1);
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(
      {
        id: item.id,
        name: item.name,
        slug: item.slug,
        category: item.category,
        price: item.price,
        currency: item.currency,
      },
      quantity
    );
  }

  return (
    <div className="section-container py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <MealGallery name={item.name} category={item.category} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {item.tag && <Badge variant={TAG_VARIANT[item.tag]}>{item.tag}</Badge>}
            {item.isVegetarian && (
              <Badge variant="success" icon={<Leaf className="h-3 w-3" />}>
                Vegetarian
              </Badge>
            )}
            {item.isSpicy && (
              <Badge variant="spicy" icon={<Flame className="h-3 w-3" />}>
                Spicy
              </Badge>
            )}
            <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold capitalize text-muted-foreground">
              {item.category}
            </span>
          </div>

          <h1 className="text-balance font-display text-3xl font-bold sm:text-4xl">{item.name}</h1>

          <div className="flex flex-wrap items-center gap-4">
            <Rating value={item.rating} reviewCount={item.reviewCount} size="md" />
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {item.prepTimeMinutes} min prep time
            </span>
          </div>

          <p className="text-balance leading-relaxed text-muted-foreground">
            {item.longDescription}
          </p>

          <PriceTag price={item.price} currency={item.currency} size="lg" />

          <div className="flex flex-col items-start gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
            <QuantitySelector value={quantity} min={1} max={20} onChange={setQuantity} />
            <Button size="lg" className="w-full sm:w-auto" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>

          <div className="border-t border-border pt-5">
            <h2 className="mb-3 font-display text-base font-bold">Ingredients</h2>
            <IngredientList ingredients={item.ingredients} />
          </div>

          <div>
            <h2 className="mb-3 font-display text-base font-bold">Nutritional Information</h2>
            <NutritionCard nutrition={item.nutrition} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <MealReviews menuItemId={item.id} />
      </div>

      <RelatedMeals items={relatedItems} />
    </div>
  );
}
