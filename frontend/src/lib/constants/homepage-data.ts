import {
  Award,
  ChefHat,
  Clock,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Soup,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import type { FeaturedMeal, FoodCategory } from "@/types/menu";
import type { StatItem, WhyChooseUsItem } from "@/types/home";

/**
 * NOTE: All content below is placeholder editorial content authored for
 * MR_SK EATRIES (original copy, no external source). It ships from this
 * static file until Sprint 6 (Menu System) and Sprint 9 (Backend API)
 * replace it with live data fetched via TanStack Query from the Express
 * API. Shapes already match `types/menu.ts` and `types/home.ts` so the
 * swap will not require component changes — only the data source.
 */

export const FEATURED_MEALS: FeaturedMeal[] = [
  {
    id: "smoked-brisket-bowl",
    name: "Smoked Brisket Bowl",
    description: "12-hour smoked brisket, charred corn, pickled onion, chili oil.",
    price: 68,
    currency: "GHS",
    rating: 4.9,
    reviewCount: 214,
    category: "dinner",
    images: ["/images/menu/dinner.jpg"],
    tag: "Chef's Pick",
  },
  {
    id: "saffron-seafood-risotto",
    name: "Saffron Seafood Risotto",
    description: "Prawns, calamari, and mussels folded into a saffron arborio risotto.",
    price: 82,
    currency: "GHS",
    rating: 4.8,
    reviewCount: 156,
    category: "dinner",
    images: ["/images/menu/seafood.jpg"],
    tag: "Popular",
  },
  {
    id: "golden-hour-pancakes",
    name: "Golden Hour Pancakes",
    description: "Stacked buttermilk pancakes, whipped honey butter, seasonal berries.",
    price: 38,
    currency: "GHS",
    rating: 4.7,
    reviewCount: 189,
    category: "breakfast",
    images: ["/images/menu/breakfast.jpg"],
    tag: "New",
  },
  {
    id: "ember-roasted-vegetable-plate",
    name: "Ember Roasted Vegetable Plate",
    description: "Fire-charred seasonal vegetables, whipped tahini, toasted seeds.",
    price: 46,
    currency: "GHS",
    rating: 4.6,
    reviewCount: 97,
    category: "lunch",
    images: ["/images/menu/lunch.jpg"],
  },
  {
    id: "dark-chocolate-fondant",
    name: "Dark Chocolate Fondant",
    description: "Molten dark chocolate center, salted caramel, vanilla bean ice cream.",
    price: 34,
    currency: "GHS",
    rating: 5.0,
    reviewCount: 241,
    category: "desserts",
    images: ["/images/menu/desserts.jpg"],
    tag: "Popular",
  },
  {
    id: "smoked-old-fashioned",
    name: "Smoked Old Fashioned",
    description: "Bourbon, house bitters, orange oil, finished tableside with cherrywood smoke.",
    price: 42,
    currency: "GHS",
    rating: 4.9,
    reviewCount: 128,
    category: "drinks",
    images: ["/images/menu/drinks.jpg"],
    tag: "Chef's Pick",
  },
] as const;

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    slug: "breakfast",
    name: "Breakfast",
    description: "Morning classics, done right",
    itemCount: 18,
  },
  {
    slug: "lunch",
    name: "Lunch",
    description: "Quick, satisfying midday plates",
    itemCount: 24,
  },
  {
    slug: "dinner",
    name: "Dinner",
    description: "Our signature evening menu",
    itemCount: 32,
  },
  {
    slug: "desserts",
    name: "Desserts",
    description: "Sweet endings, made in-house",
    itemCount: 14,
  },
  {
    slug: "drinks",
    name: "Drinks",
    description: "Crafted cocktails & mocktails",
    itemCount: 21,
  },
] as const;

export const WHY_CHOOSE_US_ITEMS: WhyChooseUsItem[] = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "Produce sourced daily from local growers — nothing frozen, nothing sitting on a shelf.",
  },
  {
    icon: ChefHat,
    title: "Experienced Chefs",
    description:
      "Our kitchen is led by chefs with decades of combined fine-dining experience.",
  },
  {
    icon: Timer,
    title: "Fast Delivery",
    description: "Hot, fresh, and on your table in under 35 minutes across the city.",
  },
  {
    icon: Sparkles,
    title: "Premium Dining",
    description: "A dining room designed for real occasions — every visit feels like one.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Ordering",
    description: "Encrypted checkout and trusted payment processing on every order.",
  },
  {
    icon: HeartHandshake,
    title: "Excellent Service",
    description: "A front-of-house team trained to remember your name and your order.",
  },
];

export const HOME_STATS: StatItem[] = [
  { icon: Users, value: 25000, suffix: "+", label: "Happy Customers" },
  { icon: Soup, value: 120000, suffix: "+", label: "Meals Served" },
  { icon: Clock, value: 12, suffix: "+", label: "Years of Experience" },
  { icon: Award, value: 18, suffix: "+", label: "Awards Won" },
];

/**
 * Re-exported from the shared source of truth so existing imports
 * (`import { CATEGORY_ICON } from "@/lib/constants/homepage-data"`)
 * across Sprint 3/4 components keep working unchanged, now covering
 * all 9 menu categories introduced in Sprint 6.
 */
export { CATEGORY_ICON } from "@/lib/constants/category-icons";
