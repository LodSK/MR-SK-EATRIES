"use client";

import * as React from "react";
import { getMenuItemReviews } from "@/lib/api/reviews";
import type { Review } from "@/types/review";
import { ReviewList } from "@/components/menu/ReviewList";
import { ReviewForm } from "@/components/menu/ReviewForm";
import { Skeleton } from "@/components/shared/Skeleton";

interface MealReviewsProps {
  menuItemId: string;
}

/**
 * Owns the fetch/refresh cycle for a single meal's reviews. The backend
 * already recalculates MenuItem.rating/reviewCount on every create/
 * moderate — this component just needs to re-fetch the list after a
 * successful submit, not update any aggregate itself.
 */
export function MealReviews({ menuItemId }: MealReviewsProps) {
  const [reviews, setReviews] = React.useState<Review[] | null>(null);

  const loadReviews = React.useCallback(() => {
    getMenuItemReviews(menuItemId)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [menuItemId]);

  React.useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  function handleSubmitted() {
    // The new review needs admin approval to appear (isApproved defaults to
    // true today, but re-fetching rather than optimistically appending
    // keeps this correct if that default ever changes) — cheap, one item.
    loadReviews();
  }

  return (
    <div className="border-t border-border pt-8">
      <h2 className="mb-5 font-display text-xl font-bold">Reviews</h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <ReviewForm menuItemId={menuItemId} onSubmitted={handleSubmitted} />
        {reviews === null ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <ReviewList reviews={reviews} />
        )}
      </div>
    </div>
  );
}
