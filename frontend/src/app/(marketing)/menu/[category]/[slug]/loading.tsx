import { Skeleton } from "@/components/shared/Skeleton";

export default function MealDetailLoading() {
  return (
    <>
      <div className="section-container pt-8">
        <Skeleton shimmer className="h-4 w-64" />
      </div>
      <div className="section-container py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <Skeleton shimmer className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton shimmer className="h-4 w-24" />
            <Skeleton shimmer className="h-10 w-3/4" />
            <Skeleton shimmer className="h-6 w-32" />
            <Skeleton shimmer className="h-24 w-full" />
            <Skeleton shimmer className="mt-4 h-12 w-full max-w-xs rounded-md" />
          </div>
        </div>
      </div>
    </>
  );
}
