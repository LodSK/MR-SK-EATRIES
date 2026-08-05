import Image from "next/image";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { cn } from "@/lib/utils/cn";

interface ProfileAvatarProps {
  initials: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_PX: Record<NonNullable<ProfileAvatarProps["size"]>, number> = {
  sm: 44,
  md: 56,
  lg: 80,
};

const SIZE_CLASS: Record<NonNullable<ProfileAvatarProps["size"]>, string> = {
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

export function ProfileAvatar({ initials, avatarUrl, size = "sm", className }: ProfileAvatarProps) {
  if (avatarUrl) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full ring-2 ring-brand-accent/40",
          SIZE_CLASS[size],
          className
        )}
      >
        <Image src={avatarUrl} alt="" fill sizes={`${SIZE_PX[size]}px`} className="object-cover" />
      </div>
    );
  }

  return (
    <InitialsAvatar
      initials={initials}
      size={size}
      className={cn("ring-2 ring-brand-accent/40", className)}
    />
  );
}
