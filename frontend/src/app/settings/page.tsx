import { redirect } from "next/navigation";

/**
 * Sprint 11: /settings's content (change password) now lives at
 * /account/security inside the Customer Dashboard, alongside the new
 * "Log Out All Devices" placeholder. Same reasoning as /profile's
 * redirect — see that file's comment.
 */
export default function SettingsPageRedirect() {
  redirect("/account/security");
}
