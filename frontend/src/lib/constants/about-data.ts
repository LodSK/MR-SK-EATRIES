import { Award, Leaf, ShieldCheck, Sparkles, Trophy, Users, UtensilsCrossed } from "lucide-react";
import type { AwardItem, ChefProfile, TimelineMilestone, TrustIndicator } from "@/types/about";

/**
 * All content on this page is original placeholder copy authored for
 * MR_SK EATRIES. Shapes match a future `/api/v1/about` response contract
 * so a CMS or backend data source can replace this file directly without
 * touching any component in `components/about/`.
 */

export const OUR_STORY = {
  eyebrow: "Our Story",
  heading: "A Kitchen Built on Patience",
  paragraphs: [
    "MR_SK EATRIES began as a single charcoal grill and a conviction that comfort food deserved the same care as fine dining. What started as weekend pop-ups for friends grew, one plate at a time, into the restaurant you're reading about now.",
    "We still cook the way we did in year one — nothing frozen, nothing rushed. The difference today is a full kitchen brigade, a dining room designed for real occasions, and a menu shaped by more than a decade of guest conversations.",
  ],
  mission:
    "To serve food that earns its place on the table — sourced honestly, cooked with patience, and priced fairly.",
  vision:
    "To become the restaurant a city points to when it wants to explain what modern comfort food should feel like.",
  philosophy:
    "Great hospitality is consistency, not spectacle. We'd rather get the fundamentals right on a quiet Tuesday than only perform on a Saturday night.",
} as const;

export const CHEFS: ChefProfile[] = [
  {
    id: "chef-sarah",
    name: "Chef Sarah K. Boateng",
    role: "Executive Chef",
    specialty: "Modern Grill & Smoke",
    experienceYears: 14,
    bio: "Leads the kitchen brigade and sets the seasonal menu direction, with a background in fire-driven cooking across three countries.",
    avatarInitials: "SB",
    socials: [
      { icon: "instagram", href: "https://instagram.com/mrsk.eatries" },
      { icon: "twitter", href: "https://x.com/mrsk_eatries" },
    ],
  },
  {
    id: "chef-daniel",
    name: "Chef Daniel Owusu",
    role: "Head Pastry Chef",
    specialty: "Desserts & Viennoiserie",
    experienceYears: 9,
    bio: "Runs the pastry section and built our in-house bread and dessert program from scratch, plate by plate.",
    avatarInitials: "DO",
    socials: [{ icon: "instagram", href: "https://instagram.com/mrsk.eatries" }],
  },
  {
    id: "chef-linda",
    name: "Chef Linda Asante",
    role: "Sous Chef",
    specialty: "Sauces & Seafood",
    experienceYears: 7,
    bio: "Oversees the pass on service nights and leads our seafood and sauce program with a classically-trained hand.",
    avatarInitials: "LA",
    socials: [
      { icon: "instagram", href: "https://instagram.com/mrsk.eatries" },
      { icon: "facebook", href: "https://facebook.com/mrsk.eatries" },
    ],
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: "m1",
    year: "2014",
    title: "The First Grill",
    description:
      "MR_SK EATRIES starts as weekend pop-ups — a single charcoal grill, a folding table, and a loyal handful of regulars.",
  },
  {
    id: "m2",
    year: "2017",
    title: "Our First Dining Room",
    description:
      "We open our first permanent location on Independence Avenue, seating 40 guests a night.",
  },
  {
    id: "m3",
    year: "2019",
    title: "Full Kitchen Brigade",
    description:
      "Chef Sarah joins as Executive Chef and builds out the full kitchen team behind today's menu.",
  },
  {
    id: "m4",
    year: "2022",
    title: "Online Ordering Launches",
    description:
      "We bring the full MR_SK EATRIES menu to delivery and pickup, reaching guests beyond the dining room.",
  },
  {
    id: "m5",
    year: "2025",
    title: "12 Awards and Counting",
    description:
      "A decade of consistency earns recognition from regional dining guides and hospitality associations.",
  },
];

export const AWARDS: AwardItem[] = [
  {
    id: "a1",
    title: "Best New Restaurant",
    issuer: "Accra Dining Guide",
    year: "2019",
    icon: Trophy,
  },
  {
    id: "a2",
    title: "Excellence in Hospitality",
    issuer: "West Africa Hospitality Awards",
    year: "2021",
    icon: Award,
  },
  {
    id: "a3",
    title: "Certified Sustainable Kitchen",
    issuer: "Ghana Culinary Council",
    year: "2023",
    icon: ShieldCheck,
  },
  {
    id: "a4",
    title: "Top 10 Restaurants in Accra",
    issuer: "City Table Magazine",
    year: "2024",
    icon: Sparkles,
  },
];

export const TRUST_INDICATORS: TrustIndicator[] = [
  {
    icon: Leaf,
    title: "Fresh, Local Sourcing",
    description: "Produce and proteins sourced from growers within a day's drive of our kitchen.",
    stat: "100%",
  },
  {
    icon: UtensilsCrossed,
    title: "Consistent Quality",
    description: "The same standards on a quiet Tuesday as a packed Saturday night.",
    stat: "4.9★",
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Meals donated to local shelters through our monthly community program.",
    stat: "5,000+",
  },
];
