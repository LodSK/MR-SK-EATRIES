import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  href: string;
  onClick?: () => void;
}

export function QuickActionCard({ icon: Icon, label, href, onClick }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-5 text-center transition-colors hover:border-brand-primary/40"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-secondary text-brand-accent transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
