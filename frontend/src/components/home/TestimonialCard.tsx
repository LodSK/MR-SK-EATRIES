import { Quote } from "lucide-react";
import type { Testimonial } from "@/types/testimonial";
import { Rating } from "@/components/shared/Rating";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-8">
      <Quote className="h-8 w-8 text-brand-accent/70" strokeWidth={1.5} aria-hidden="true" />

      <p className="flex-1 text-balance font-accent text-lg italic leading-relaxed text-foreground/90 sm:text-xl">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <InitialsAvatar initials={testimonial.avatarInitials} size="sm" />
        <div>
          <p className="text-sm font-semibold">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
        <Rating value={testimonial.rating} size="sm" className="ml-auto" />
      </div>
    </article>
  );
}
