"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { DASHBOARD_NAV, type DashboardNavItem } from "@/lib/constants/dashboard-nav";
import { useAuth } from "@/lib/hooks/useAuth";
import { getInitials } from "@/lib/utils/auth";
import { ProfileAvatar } from "@/components/auth/ProfileAvatar";

interface DashboardHeaderProps {
  navItems?: DashboardNavItem[];
  onOpenSidebar: () => void;
}

export function DashboardHeader({ navItems = DASHBOARD_NAV, onOpenSidebar }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const currentSection = navItems.find((item) => item.href === pathname);

  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open dashboard menu"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-bold sm:text-xl">
          {currentSection?.label ?? "Dashboard"}
        </h1>
      </div>

      {user && (
        <div className="flex items-center gap-2.5">
          <span className="hidden text-sm font-medium sm:block">{user.fullName}</span>
          <ProfileAvatar initials={getInitials(user.fullName)} avatarUrl={user.avatarUrl} size="sm" />
        </div>
      )}
    </header>
  );
}
