import { cn } from "@/lib/utils/cn";

interface PriceTagProps {
  price: number;
  currency: string;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<PriceTagProps["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function PriceTag({ price, currency, originalPrice, size = "md", className }: PriceTagProps) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-display font-bold text-brand-primary dark:text-brand-accent",
          SIZE_CLASSES[size]
        )}
      >
        {currency} {price}
      </span>
      {typeof originalPrice === "number" && originalPrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {currency} {originalPrice}
        </span>
      )}
    </div>
  );
}
