import { Skeleton } from "@/components/shared/Skeleton";

export default function BlogPostLoading() {
  return (
    <>
      <div className="relative flex min-h-[420px] w-full items-end bg-brand-secondary py-16 sm:min-h-[460px]">
        <div className="section-container flex flex-col gap-4">
          <Skeleton className="h-4 w-40 bg-white/10" />
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-12 w-full max-w-2xl bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>
      </div>
      <div className="section-container max-w-3xl py-16 sm:py-20">
        <div className="mb-8 flex gap-4 border-b border-border pb-6">
          <Skeleton shimmer className="h-4 w-32" />
          <Skeleton shimmer className="h-4 w-32" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} shimmer className="h-4 w-full" />
          ))}
        </div>
      </div>
    </>
  );
}
