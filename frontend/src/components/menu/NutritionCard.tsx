import type { NutritionInfo } from "@/types/menu";

interface NutritionCardProps {
  nutrition: NutritionInfo;
}

const ROWS: { key: keyof NutritionInfo; label: string; unit: string }[] = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "proteinGrams", label: "Protein", unit: "g" },
  { key: "carbsGrams", label: "Carbs", unit: "g" },
  { key: "fatGrams", label: "Fat", unit: "g" },
];

export function NutritionCard({ nutrition }: NutritionCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ROWS.map((row) => (
        <div
          key={row.key}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card py-4 text-center"
        >
          <span className="font-display text-xl font-bold text-brand-primary dark:text-brand-accent">
            {nutrition[row.key]}
            <span className="ml-0.5 text-xs font-normal text-muted-foreground">{row.unit}</span>
          </span>
          <span className="text-xs text-muted-foreground">{row.label}</span>
        </div>
      ))}
    </div>
  );
}
