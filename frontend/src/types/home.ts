import type { LucideIcon } from "lucide-react";

export interface WhyChooseUsItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface StatItem {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
}
