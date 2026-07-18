import type { NavItem, SocialLink } from "@/types/nav";

export const SITE_CONFIG = {
  name: "MR_SK EATRIES",
  shortName: "MR_SK",
  tagline: "Taste Beyond Expectations",
  description:
    "MR_SK EATRIES is a premium modern restaurant serving elevated comfort food, crafted cocktails, and an atmosphere built for every occasion — from quiet breakfasts to celebration dinners.",
  url: "https://mrsk-eatries.com",
  ogImage: "/images/og-cover.jpg",
  keywords: [
    "MR_SK EATRIES",
    "restaurant",
    "fine dining",
    "order food online",
    "restaurant reservations",
    "best restaurant",
  ],
  contact: {
    phone: "+233 20 000 0000",
    email: "hello@mrsk-eatries.com",
    address: "12 Independence Avenue, Accra, Ghana",
  },
  hours: [
    { days: "Monday — Thursday", time: "8:00 AM — 10:00 PM" },
    { days: "Friday — Saturday", time: "8:00 AM — 12:00 AM" },
    { days: "Sunday", time: "9:00 AM — 9:00 PM" },
  ],
} as const;

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/mrsk.eatries", icon: "instagram" },
  { label: "Facebook", href: "https://facebook.com/mrsk.eatries", icon: "facebook" },
  { label: "TikTok", href: "https://tiktok.com/@mrsk.eatries", icon: "tiktok" },
  { label: "X", href: "https://x.com/mrsk_eatries", icon: "twitter" },
];

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Menu",
    href: "/menu",
    children: [
      { label: "Breakfast", href: "/menu/breakfast", description: "Morning classics, done right" },
      { label: "Lunch", href: "/menu/lunch", description: "Quick, satisfying midday plates" },
      { label: "Dinner", href: "/menu/dinner", description: "Our signature evening menu" },
      { label: "Desserts", href: "/menu/desserts", description: "Sweet endings, made in-house" },
      { label: "Drinks", href: "/menu/drinks", description: "Crafted cocktails & mocktails" },
    ],
  },
  { label: "Reservations", href: "/reservations" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Full Menu", href: "/menu" },
      { label: "Gallery", href: "/gallery" },
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Order & Visit",
    items: [
      { label: "Order Online", href: "/order" },
      { label: "Reservations", href: "/reservations" },
      { label: "Track Order", href: "/track-order" },
      { label: "Our Branches", href: "/about#branches" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Careers", href: "/careers" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
