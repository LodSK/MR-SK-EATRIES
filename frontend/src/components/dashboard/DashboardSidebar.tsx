"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { DASHBOARD_NAV, type DashboardNavItem } from "@/lib/constants/dashboard-nav";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

interface DashboardSidebarProps {
  navItems?: DashboardNavItem[];
  onNavigate?: () => void;
}

export function DashboardSidebar({ navItems = DASHBOARD_NAV, onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav aria-label="Dashboard navigation" className="flex h-full flex-col justify-between">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-primary text-white dark:bg-brand-accent dark:text-brand-secondary"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => logout()}
        className="mt-6 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Log Out
      </button>
    </nav>
  );
}
