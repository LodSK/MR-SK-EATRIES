import { Skeleton } from "@/components/shared/Skeleton";

/**
 * Covers the brief window between navigating to a new /account/* route and
 * that page's own component mounting — DashboardSidebar/DashboardHeader in
 * account/layout.tsx render outside this boundary and stay in place. Tier 3
 * per the Sprint 17 plan: light and consistent, not a cinematic moment —
 * most individual dashboard pages already have their own richer
 * data-loading skeleton for the actual fetch (left untouched here).
 */
export default function AccountLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
