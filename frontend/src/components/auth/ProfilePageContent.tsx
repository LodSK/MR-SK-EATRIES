"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AvatarUploader } from "@/components/auth/AvatarUploader";
import { EmailVerificationNotice } from "@/components/auth/EmailVerificationNotice";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { MyReservations } from "@/components/reservations/MyReservations";
import { useAuth } from "@/lib/hooks/useAuth";

function ProfileContent() {
  const { user } = useAuth();

  return (
    <div className="section-container max-w-2xl py-12 sm:py-16">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Your Profile</h1>
      <p className="mt-1 text-sm capitalize text-muted-foreground">{user?.role} account</p>

      <div className="mt-8 flex flex-col gap-8">
        <EmailVerificationNotice />
        <AvatarUploader />
        <div className="rounded-2xl border border-border bg-card p-6">
          <ProfileForm />
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-bold">My Reservations</h2>
          <MyReservations />
        </div>
      </div>
    </div>
  );
}

export function ProfilePageContent() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
