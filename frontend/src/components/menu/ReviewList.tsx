import type { Review } from "@/types/review";
import { Rating } from "@/components/shared/Rating";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { getInitials } from "@/lib/utils/auth";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first to share what you thought of this dish."
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-3 border-b border-border pb-5 last:border-b-0 last:pb-0">
          <InitialsAvatar initials={getInitials(review.user.fullName)} size="sm" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{review.user.fullName}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Rating value={review.rating} size="sm" className="mt-1" />
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
