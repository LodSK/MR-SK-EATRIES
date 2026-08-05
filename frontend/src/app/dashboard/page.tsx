import { redirect } from "next/navigation";

/**
 * The sprint brief asks for "/dashboard" literally. Sprint 1 already
 * scaffolded account/{dashboard,orders,reservations,profile,addresses}
 * for exactly this purpose, and this project's established precedent
 * (Sprint 8) is to use existing scaffolded folders over introducing a
 * literal new top-level route when they'd otherwise duplicate. This
 * redirect satisfies both: /dashboard works as a URL, and the real
 * implementation lives at /account/dashboard.
 */
export default function DashboardRedirect() {
  redirect("/account/dashboard");
}
