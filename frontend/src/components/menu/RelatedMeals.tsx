import type { MenuItem } from "@/types/menu";
import { MenuCard } from "@/components/menu/MenuCard";

interface RelatedMealsProps {
  items: MenuItem[];
}

export function RelatedMeals({ items }: RelatedMealsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="related-meals-heading">
      <h2 id="related-meals-heading" className="mb-6 font-display text-2xl font-bold">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
