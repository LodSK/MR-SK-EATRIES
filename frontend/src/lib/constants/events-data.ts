import type { RestaurantEvent } from "@/types/event";

export const RESTAURANT_EVENTS: RestaurantEvent[] = [
  {
    id: "ev-jazz",
    title: "Live Jazz Night",
    description:
      "A three-piece jazz trio plays the dining room from dusk — pair it with a Smoked Old Fashioned from the bar.",
    schedule: "Every Friday, 7:00 PM – 10:00 PM",
    frequency: "weekly",
    icon: "music",
    imageSrc: "/images/gallery/ambiance-bar.jpg",
  },
  {
    id: "ev-wine",
    title: "Wine Tasting Evening",
    description:
      "A guided tasting through six wines paired with small plates from the kitchen, hosted by our head sommelier.",
    schedule: "Last Thursday of every month, 6:30 PM",
    frequency: "monthly",
    icon: "wine",
    imageSrc: "/images/gallery/ambiance-private-dining.jpg",
  },
  {
    id: "ev-chefs-table",
    title: "Chef's Table Experience",
    description:
      "A six-course tasting menu at the pass, watching the kitchen work — limited to eight guests per seating.",
    schedule: "First Saturday of every month, 7:30 PM",
    frequency: "monthly",
    icon: "utensils",
    imageSrc: "/images/menu/dinner.jpg",
  },
  {
    id: "ev-brunch",
    title: "Sunday Bottomless Brunch",
    description:
      "Full brunch menu plus bottomless mimosas and coffee, 11 AM to 2 PM — reservations recommended.",
    schedule: "Every Sunday, 11:00 AM – 2:00 PM",
    frequency: "weekly",
    icon: "sun",
    imageSrc: "/images/menu/breakfast.jpg",
  },
  {
    id: "ev-birthday",
    title: "Celebration Packages",
    description:
      "Book ahead for a birthday, anniversary, or milestone dinner and we'll set the table, plate a dessert on the house, and handle the rest.",
    schedule: "Any day, with 48 hours' notice",
    frequency: "one-time",
    icon: "cake",
    imageSrc: "/images/gallery/ambiance-patio.jpg",
  },
  {
    id: "ev-holiday",
    title: "Seasonal Menu Launch",
    description:
      "A one-night preview of our new seasonal menu before it goes live — first access for newsletter subscribers.",
    schedule: "Quarterly — announced via newsletter",
    frequency: "one-time",
    icon: "gift",
    imageSrc: "/images/menu/desserts.jpg",
  },
];
