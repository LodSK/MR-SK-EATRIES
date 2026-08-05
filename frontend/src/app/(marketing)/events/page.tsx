import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { EventCard } from "@/components/events/EventCard";
import { RESTAURANT_EVENTS } from "@/lib/constants/events-data";

export const metadata: Metadata = {
  title: "Events",
  description: "Live music, tastings, and celebrations at MR_SK EATRIES.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="What's On"
        title="Events at MR_SK EATRIES"
        subtitle="Recurring evenings worth planning around, and celebrations we'll help you host."
        breadcrumbItems={[{ label: "Events" }]}
      />
      <div className="section-container py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESTAURANT_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
}
