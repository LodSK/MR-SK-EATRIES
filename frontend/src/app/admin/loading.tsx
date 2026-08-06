import { Skeleton } from "@/components/shared/Skeleton";

/**
 * Tier 4 per the Sprint 17 plan: functional only, no shimmer/cinematic
 * flourish — admin is a working tool staff use many times a day. Plain
 * `animate-pulse` (Skeleton's default), same as this codebase's existing
 * admin table/card loading states.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
