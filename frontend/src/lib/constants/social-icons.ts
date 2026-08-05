import { Facebook, Instagram, Twitter } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SocialLink } from "@/types/nav";

/**
 * Centralized icon lookup for social platform keys, used by the Footer,
 * chef profile cards, and anywhere else a `SocialLink["icon"]` needs to
 * render. TikTok/YouTube currently fall back to the Instagram glyph until
 * dedicated brand icons are added — update here once, not per call site.
 */
export const SOCIAL_ICON_MAP: Record<SocialLink["icon"], LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  tiktok: Instagram,
  youtube: Instagram,
};
