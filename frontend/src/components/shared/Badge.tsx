import { cn } from "@/lib/utils/cn";

export type BadgeVariant = "accent" | "primary" | "secondary" | "outline" | "success" | "spicy";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  accent: "bg-brand-accent text-brand-secondary",
  primary: "bg-brand-primary text-white",
  secondary: "bg-brand-secondary text-brand-accent",
  outline: "border border-current bg-transparent",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  spicy: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export function Badge({ children, variant = "primary", icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
