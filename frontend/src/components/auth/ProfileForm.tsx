"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { profileUpdateSchema, type ProfileUpdateSchemaValues } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateSchemaValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      birthday: user?.birthday ? user.birthday.slice(0, 10) : "",
      bio: user?.bio ?? "",
    },
  });

  async function onSubmit(values: ProfileUpdateSchemaValues) {
    const result = await updateProfile(values);
    setMessage(result.message);
    setStatus(result.success ? "success" : "error");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {status !== "idle" && message && <FormMessage type={status}>{message}</FormMessage>}

      <div>
        <label htmlFor="profile-email" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Email Address
        </label>
        <input
          id="profile-email"
          type="email"
          value={user?.email ?? ""}
          disabled
          className="h-11 w-full rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground outline-none"
        />
        <p className="mt-1 text-xs text-muted-foreground">Email changes will be supported once account verification (Sprint 9) is live.</p>
      </div>

      <div>
        <label htmlFor="profile-name" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Full Name
        </label>
        <input
          id="profile-name"
          type="text"
          {...register("fullName")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="profile-phone" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Phone Number
        </label>
        <input
          id="profile-phone"
          type="tel"
          {...register("phone")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="profile-birthday" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Birthday
        </label>
        <input
          id="profile-birthday"
          type="date"
          {...register("birthday")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
      </div>

      <div>
        <label htmlFor="profile-bio" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Bio
        </label>
        <textarea
          id="profile-bio"
          rows={3}
          placeholder="A little about you…"
          {...register("bio")}
          className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.bio && <p className="mt-1 text-xs text-destructive">{errors.bio.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
      </Button>
    </form>
  );
}
