import { Skeleton } from "@/components/shared/Skeleton";

export default function CheckoutLoading() {
  return (
    <div className="section-container grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_400px] lg:gap-14">
      <div className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton shimmer className="mb-4 h-5 w-48" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton shimmer className="h-11 w-full rounded-md" />
              <Skeleton shimmer className="h-11 w-full rounded-md" />
            </div>
          </div>
        ))}
        <Skeleton shimmer className="h-12 w-full rounded-md" />
      </div>
      <Skeleton shimmer className="h-96 rounded-2xl" />
    </div>
  );
}
