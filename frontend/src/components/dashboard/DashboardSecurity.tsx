"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";

export function DashboardSecurity() {
  const { logoutAllDevices } = useAuth();
  const [isLoggingOutAll, setIsLoggingOutAll] = React.useState(false);

  async function handleLogoutAllDevices() {
    setIsLoggingOutAll(true);
    const result = await logoutAllDevices();
    if (!result.success) {
      toast.error(result.message);
      setIsLoggingOutAll(false);
      return;
    }
    toast.success("Signed out of every device.");
    // Local state is already cleared — the redirect covers this tab too.
    window.location.href = "/auth/login";
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardCard title="Change Password">
        <ChangePasswordForm />
      </DashboardCard>

      <DashboardCard title="Sessions">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Log Out All Devices</p>
            <p className="text-xs text-muted-foreground">Ends every active session, including this one.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogoutAllDevices} disabled={isLoggingOutAll}>
            {isLoggingOutAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
            Log Out Everywhere
          </Button>
        </div>
      </DashboardCard>
    </div>
  );
}
