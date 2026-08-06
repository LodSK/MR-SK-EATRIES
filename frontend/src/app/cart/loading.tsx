import { Skeleton } from "@/components/shared/Skeleton";

export default function CartLoading() {
  return (
    <div className="section-container grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_400px] lg:gap-14">
      <div>
        <Skeleton shimmer className="mb-4 h-8 w-40" />
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-5">
              <Skeleton shimmer className="h-20 w-20 shrink-0 rounded-xl" />
              <div className="flex-1">
                <Skeleton shimmer className="mb-2 h-4 w-40" />
                <Skeleton shimmer className="h-3 w-24" />
              </div>
              <Skeleton shimmer className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton shimmer className="h-80 rounded-2xl" />
    </div>
  );
}
