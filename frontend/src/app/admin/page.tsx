import { redirect } from "next/navigation";

/**
 * Sprint 12.1: /admin returned a 404 with no page.tsx here — the actual
 * pages all live under /admin/{dashboard,orders,...}. Mirrors the exact
 * /dashboard → /account/dashboard redirect pattern from Sprint 11.
 */
export default function AdminRootRedirect() {
  redirect("/admin/dashboard");
}
