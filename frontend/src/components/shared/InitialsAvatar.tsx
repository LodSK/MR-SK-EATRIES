import { cn } from "@/lib/utils/cn";

interface InitialsAvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<InitialsAvatarProps["size"]>, string> = {
  sm: "h-11 w-11 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-xl",
};

/**
 * A branded initials circle standing in for a photo avatar — used
 * wherever we don't yet have real headshots (testimonials, chef
 * profiles) so the visual language stays consistent site-wide.
 */
export function InitialsAvatar({ initials, size = "sm", className }: InitialsAvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-secondary font-bold text-brand-accent",
        SIZE_CLASSES[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
