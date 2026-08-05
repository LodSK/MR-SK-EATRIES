"use client";

import * as React from "react";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createReview } from "@/lib/api/reviews";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ReviewFormProps {
  menuItemId: string;
  onSubmitted: () => void;
}

export function ReviewForm({ menuItemId, onSubmitted }: ReviewFormProps) {
  const { isAuthenticated, isLoadingSession } = useAuth();
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (isLoadingSession) return null;

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          <Link href="/auth/login" className="font-semibold text-brand-primary hover:underline dark:text-brand-accent">
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 3) {
      setError("Please write at least a few words.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await createReview({ menuItemId, rating, comment: comment.trim() });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    onSubmitted();
    setRating(0);
    setComment("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <span className="mb-2 block text-sm font-semibold">Your Rating</span>
        <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            const filled = starValue <= (hoverRating || rating);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                className="p-0.5"
                aria-label={`Rate ${starValue} out of 5 stars`}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    filled ? "fill-brand-accent text-brand-accent" : "fill-transparent text-muted-foreground/40"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="review-comment" className="mb-2 block text-sm font-semibold">
          Your Review
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="What did you think of this dish?"
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-brand-primary"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit Review
      </Button>
    </form>
  );
}
