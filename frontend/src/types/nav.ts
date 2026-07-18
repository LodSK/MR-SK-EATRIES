export interface NavChildItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChildItem[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "tiktok" | "twitter" | "youtube";
}
