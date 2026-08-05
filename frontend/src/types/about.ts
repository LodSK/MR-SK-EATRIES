import type { LucideIcon } from "lucide-react";
import type { SocialLink } from "@/types/nav";

export interface ChefSocialLink {
  icon: SocialLink["icon"];
  href: string;
}

export interface ChefProfile {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experienceYears: number;
  bio: string;
  avatarInitials: string;
  socials: ChefSocialLink[];
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  icon: LucideIcon;
}

export interface TrustIndicator {
  icon: LucideIcon;
  title: string;
  description: string;
  stat: string;
}
