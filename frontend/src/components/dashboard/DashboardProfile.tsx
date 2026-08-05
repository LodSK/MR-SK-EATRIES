import { AvatarUploader } from "@/components/auth/AvatarUploader";
import { EmailVerificationNotice } from "@/components/auth/EmailVerificationNotice";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export function DashboardProfile() {
  return (
    <div className="flex flex-col gap-6">
      <EmailVerificationNotice />
      <AvatarUploader />
      <DashboardCard>
        <ProfileForm />
      </DashboardCard>
    </div>
  );
}
