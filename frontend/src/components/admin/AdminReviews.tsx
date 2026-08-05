"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { adminListReviews, adminModerateReview } from "@/lib/api/reviews";
import type { AdminReview } from "@/types/review";
import { Rating } from "@/components/shared/Rating";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";

export function AdminReviews() {
  const [reviews, setReviews] = React.useState<AdminReview[] | null>(null);

  const load = React.useCallback(() => {
    adminListReviews()
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(id: string, isApproved: boolean) {
    await adminModerateReview(id, !isApproved);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderate customer reviews. Hiding a review removes it from the public menu item page and
          excludes it from that item&apos;s rating average.
        </p>
      </div>

      {reviews === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" strokeWidth={1.5} />}
          title="No reviews yet"
          description="Customer reviews will appear here as they come in."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{review.user.fullName}</span>
                  <span className="text-xs text-muted-foreground">on {review.menuItem.name}</span>
                  <Badge variant={review.isApproved ? "success" : "outline"}>
                    {review.isApproved ? "Visible" : "Hidden"}
                  </Badge>
                </div>
                <Rating value={review.rating} size="sm" className="mt-1" />
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleToggle(review.id, review.isApproved)}>
                {review.isApproved ? "Hide" : "Approve"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
