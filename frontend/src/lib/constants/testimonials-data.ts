import type { Testimonial } from "@/types/testimonial";

/**
 * Original placeholder testimonials authored for MR_SK EATRIES. Replaced by
 * live, moderated reviews (fetched from the Reviews API) once the backend
 * ships in Sprint 9 — the `Testimonial` shape is designed to match that
 * future API response so only the data source changes.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ama Owusu",
    role: "Verified Guest",
    quote:
      "Every dish arrives like it was plated for a photograph, but it's the flavor that actually stops the conversation at the table.",
    rating: 5,
    avatarInitials: "AO",
  },
  {
    id: "t2",
    name: "Kwame Mensah",
    role: "Verified Guest",
    quote:
      "We've hosted two family celebrations here now. The staff remembered our order preferences from the first visit — that's rare.",
    rating: 5,
    avatarInitials: "KM",
  },
  {
    id: "t3",
    name: "Efua Boateng",
    role: "Verified Guest",
    quote:
      "The brisket bowl alone is worth the trip. Portion sizes are generous and nothing feels rushed, even on a busy Friday night.",
    rating: 4.5,
    avatarInitials: "EB",
  },
  {
    id: "t4",
    name: "Daniel Owusu-Ansah",
    role: "Online Delivery Customer",
    quote:
      "Ordered for a home dinner party and it arrived exactly on time, still hot, packaged like it mattered. Will order again.",
    rating: 5,
    avatarInitials: "DA",
  },
  {
    id: "t5",
    name: "Naa Adjeley",
    role: "Verified Guest",
    quote:
      "Cocktail list deserves its own review. The smoked old fashioned is now the first thing I recommend to friends visiting Accra.",
    rating: 4.5,
    avatarInitials: "NA",
  },
];
