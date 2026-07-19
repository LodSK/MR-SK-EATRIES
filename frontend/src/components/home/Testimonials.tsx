"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants/testimonials-data";
import { TestimonialCard } from "@/components/home/TestimonialCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils/cn";

const AUTOPLAY_INTERVAL_MS = 6000;

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = React.useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Manual autoplay loop — pauses on hover/focus for accessibility, resumes on leave.
  React.useEffect(() => {
    if (!emblaApi || isPaused) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, isPaused]);

  return (
    <section
      className="section-container py-20 sm:py-28"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <SectionHeading
        eyebrow="Guest Stories"
        title="What Our Guests Say"
        subtitle="We could tell you MR_SK EATRIES is worth the visit — we'd rather let the people who've been here say it."
        className="mx-auto mb-14 max-w-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex sm:-ml-6">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_60%] sm:pl-6 lg:flex-[0_0_45%]"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Select testimonial">
            {TESTIMONIALS.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Show testimonial from ${testimonial.name}`}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === selectedIndex
                    ? "w-6 bg-brand-primary dark:bg-brand-accent"
                    : "w-2 bg-border hover:bg-muted-foreground/40"
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
