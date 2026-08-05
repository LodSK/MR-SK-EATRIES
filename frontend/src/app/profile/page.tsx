import { redirect } from "next/navigation";

/**
 * Sprint 11: /profile's content now lives at /account/profile inside the
 * Customer Dashboard. This redirect resolves the /profile vs
 * /account/profile duplication flagged as technical debt after Sprint 8 —
 * the old URL keeps working (nothing that bookmarked/linked it breaks),
 * it just forwards to the new canonical location. The original
 * ProfilePageContent.tsx component is left untouched, unmodified, and
 * simply no longer routed to directly.
 */
export default function ProfilePageRedirect() {
  redirect("/account/profile");
}
