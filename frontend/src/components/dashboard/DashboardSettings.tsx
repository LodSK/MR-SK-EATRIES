"use client";

import { Globe, Moon, ShieldQuestion } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function DashboardSettings() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardCard title="Appearance">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark mode.</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </DashboardCard>

      <DashboardCard title="Language">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Globe className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
          <div>
            <p className="font-medium text-foreground">English</p>
            <p className="text-xs">Additional languages are planned for a future update.</p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Privacy">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldQuestion className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
          <div>
            <p className="font-medium text-foreground">Data & Privacy Preferences</p>
            <p className="text-xs">Detailed privacy controls are planned for a future update.</p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
