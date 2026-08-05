"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { useAuth } from "@/lib/hooks/useAuth";

function SettingsContent() {
  const { user } = useAuth();

  return (
    <div className="section-container max-w-2xl py-12 sm:py-16">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Account Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your security settings for {user?.email}.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 font-display text-lg font-bold">Change Password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}

export function SettingsPageContent() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
