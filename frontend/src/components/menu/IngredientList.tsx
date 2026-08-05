import { Check } from "lucide-react";

interface IngredientListProps {
  ingredients: string[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {ingredients.map((ingredient) => (
        <li key={ingredient} className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-3.5 w-3.5 shrink-0 text-brand-primary dark:text-brand-accent" />
          {ingredient}
        </li>
      ))}
    </ul>
  );
}
