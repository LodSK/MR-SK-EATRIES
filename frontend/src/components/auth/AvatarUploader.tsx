"use client";

import * as React from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getInitials } from "@/lib/utils/auth";
import { uploadImage } from "@/lib/api/upload";
import { ProfileAvatar } from "@/components/auth/ProfileAvatar";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function AvatarUploader() {
  const { user, updateProfile } = useAuth();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("Please choose an image under 5MB.");
      return;
    }

    setError(null);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImage(file, "avatars");
      const result = await updateProfile({
        fullName: user.fullName,
        phone: user.phone,
        birthday: user.birthday,
        bio: user.bio,
        avatarUrl: uploadedUrl,
      });
      if (!result.success) setError(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const displayUrl = previewUrl ?? user?.avatarUrl;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <ProfileAvatar initials={getInitials(user?.fullName ?? "?")} avatarUrl={displayUrl} size="lg" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          aria-label="Upload photo"
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-brand-primary text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
        >
          {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="sr-only"
        />
      </div>
      <div>
        <p className="text-sm font-semibold">Profile Photo</p>
        <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP — up to 5MB.</p>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
