import { Skeleton } from "@/components/shared/Skeleton";

export default function ReservationsLoading() {
  return (
    <>
      <div className="relative flex min-h-[420px] w-full items-end bg-brand-secondary py-16 sm:min-h-[460px]">
        <div className="section-container flex flex-col gap-4">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-12 w-80 bg-white/10" />
          <Skeleton className="h-4 w-96 bg-white/10" />
        </div>
      </div>
      <div className="section-container grid grid-cols-1 gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_360px] lg:gap-14">
        <div>
          <Skeleton shimmer className="mb-8 h-24 w-full max-w-md" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} shimmer className="h-11 w-full rounded-md" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton shimmer className="h-40 rounded-2xl" />
          <Skeleton shimmer className="h-56 rounded-2xl" />
        </div>
      </div>
    </>
  );
}
