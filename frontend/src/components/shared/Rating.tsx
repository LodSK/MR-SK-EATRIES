import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Rating({ value, reviewCount, size = "sm", className }: RatingProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const rounded = Math.round(value * 2) / 2; // nearest half star

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center" role="img" aria-label={`Rated ${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled ? "fill-brand-accent text-brand-accent" : "fill-transparent text-muted-foreground/40",
                half && "fill-brand-accent/50 text-brand-accent"
              )}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {value.toFixed(1)}
        {typeof reviewCount === "number" && ` (${reviewCount})`}
      </span>
    </div>
  );
}
