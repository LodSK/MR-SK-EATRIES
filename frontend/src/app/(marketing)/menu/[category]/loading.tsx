import { Skeleton } from "@/components/shared/Skeleton";
import { MenuGridSkeleton } from "@/components/menu/MenuCardSkeleton";

export default function CategoryLoading() {
  return (
    <>
      <div className="flex h-[420px] w-full items-end bg-brand-secondary py-16 sm:h-[460px]">
        <div className="section-container flex flex-col gap-4">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-12 w-64 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>
      </div>
      <div className="section-container py-16 sm:py-20">
        <MenuGridSkeleton count={6} />
      </div>
    </>
  );
}
