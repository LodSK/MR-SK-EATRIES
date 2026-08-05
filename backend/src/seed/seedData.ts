import { MENU_CATEGORIES } from "@/config/constants";

const FIRST_NAMES = [
  "Ama", "Kwame", "Efua", "Kofi", "Naa", "Kwabena", "Akosua", "Yaw", "Abena", "Kojo",
  "Adjoa", "Kwesi", "Afia", "Fiifi", "Esi", "Nana", "Adwoa", "Kobby", "Araba", "Yaa",
];
const LAST_NAMES = [
  "Owusu", "Mensah", "Boateng", "Asante", "Owusu-Ansah", "Adjei", "Appiah", "Danso",
  "Osei", "Frimpong", "Amoah", "Agyeman", "Darko", "Nyarko", "Sarpong",
];

export function randomFullName(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDateWithinDays(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date;
}

interface MenuItemSeed {
  name: string;
  description: string;
  category: (typeof MENU_CATEGORIES)[number];
  price: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  tag?: "New" | "Popular" | "Chef's Pick";
}

/**
 * 45 original menu items across all 9 categories (5 each) — matches the
 * frontend's Sprint 6 placeholder content in spirit, expanded for a
 * realistic seed volume. All copy is original, authored for this seed.
 */
export const MENU_ITEM_SEEDS: MenuItemSeed[] = [
  // Breakfast
  { name: "Golden Hour Pancakes", description: "Stacked buttermilk pancakes, whipped honey butter, seasonal berries.", category: "breakfast", price: 38, isVegetarian: true, isSpicy: false, tag: "New" },
  { name: "Smoked Salmon Benedict", description: "Poached eggs, house-smoked salmon, hollandaise, toasted brioche.", category: "breakfast", price: 52, isVegetarian: false, isSpicy: false, tag: "Chef's Pick" },
  { name: "Farmhouse Omelette", description: "Three-egg omelette, roasted peppers, spinach, aged cheddar.", category: "breakfast", price: 34, isVegetarian: true, isSpicy: false },
  { name: "Steak and Eggs", description: "Grilled sirloin strips, two eggs any style, herb potatoes.", category: "breakfast", price: 58, isVegetarian: false, isSpicy: false, tag: "Popular" },
  { name: "Shakshuka", description: "Eggs poached in spiced tomato sauce, feta, crusty bread.", category: "breakfast", price: 36, isVegetarian: true, isSpicy: true },

  // Lunch
  { name: "Ember Roasted Vegetable Plate", description: "Fire-charred seasonal vegetables, whipped tahini, toasted seeds.", category: "lunch", price: 46, isVegetarian: true, isSpicy: false },
  { name: "Grilled Chicken Caesar", description: "Char-grilled chicken breast, romaine, shaved parmesan, house dressing.", category: "lunch", price: 54, isVegetarian: false, isSpicy: false, tag: "Popular" },
  { name: "Steak Sandwich", description: "Sliced sirloin, caramelized onion, horseradish mayo, ciabatta.", category: "lunch", price: 56, isVegetarian: false, isSpicy: false },
  { name: "Quinoa Power Bowl", description: "Quinoa, roasted chickpeas, avocado, pickled vegetables, lemon dressing.", category: "lunch", price: 44, isVegetarian: true, isSpicy: false, tag: "New" },
  { name: "Spicy Peanut Noodles", description: "Rice noodles, grilled chicken, peanut chili sauce, crushed peanuts.", category: "lunch", price: 48, isVegetarian: false, isSpicy: true },

  // Dinner
  { name: "Smoked Brisket Bowl", description: "12-hour smoked brisket, charred corn, pickled onion, chili oil.", category: "dinner", price: 68, isVegetarian: false, isSpicy: true, tag: "Chef's Pick" },
  { name: "Saffron Seafood Risotto", description: "Prawns, calamari, and mussels folded into a saffron arborio risotto.", category: "dinner", price: 82, isVegetarian: false, isSpicy: false, tag: "Popular" },
  { name: "Herb Crusted Lamb Rack", description: "Rosemary and garlic crusted lamb, red wine jus, roasted vegetables.", category: "dinner", price: 92, isVegetarian: false, isSpicy: false },
  { name: "Wild Mushroom Tagliatelle", description: "Fresh tagliatelle, wild mushrooms, truffle butter, parmesan.", category: "dinner", price: 62, isVegetarian: true, isSpicy: false },
  { name: "Slow Braised Short Rib", description: "Red wine braised short rib, celeriac mash, glazed carrots.", category: "dinner", price: 88, isVegetarian: false, isSpicy: false, tag: "Chef's Pick" },

  // Burgers
  { name: "Smokehouse Double Stack", description: "Double smashed patty, smoked cheddar, crispy onion, house sauce.", category: "burgers", price: 58, isVegetarian: false, isSpicy: false, tag: "Popular" },
  { name: "Spiced Black Bean Burger", description: "House-made black bean patty, avocado, chipotle mayo, pickled slaw.", category: "burgers", price: 44, isVegetarian: true, isSpicy: true },
  { name: "Classic Cheeseburger", description: "Single beef patty, American cheese, lettuce, tomato, house pickles.", category: "burgers", price: 42, isVegetarian: false, isSpicy: false },
  { name: "BBQ Bacon Burger", description: "Beef patty, crispy bacon, cheddar, onion rings, smoky BBQ sauce.", category: "burgers", price: 54, isVegetarian: false, isSpicy: false, tag: "New" },
  { name: "Mushroom Swiss Burger", description: "Beef patty, sauteed mushrooms, melted swiss, garlic aioli.", category: "burgers", price: 50, isVegetarian: false, isSpicy: false },

  // Pizza
  { name: "Wood-Fired Margherita", description: "San Marzano tomato, fresh mozzarella, basil, olive oil.", category: "pizza", price: 62, isVegetarian: true, isSpicy: false },
  { name: "Spicy Honey Pepperoni", description: "Double pepperoni, chili-infused honey, fresh oregano.", category: "pizza", price: 68, isVegetarian: false, isSpicy: true, tag: "Popular" },
  { name: "Four Cheese", description: "Mozzarella, gorgonzola, parmesan, fontina, cracked black pepper.", category: "pizza", price: 64, isVegetarian: true, isSpicy: false },
  { name: "BBQ Chicken Pizza", description: "Smoked chicken, red onion, BBQ base, mozzarella, cilantro.", category: "pizza", price: 66, isVegetarian: false, isSpicy: false, tag: "New" },
  { name: "Prosciutto Arugula", description: "Prosciutto, wild arugula, shaved parmesan, balsamic glaze.", category: "pizza", price: 72, isVegetarian: false, isSpicy: false },

  // Chicken
  { name: "Cherrywood Smoked Half Chicken", description: "24-hour brined, cherrywood smoked, finished on the grill.", category: "chicken", price: 64, isVegetarian: false, isSpicy: false, tag: "Chef's Pick" },
  { name: "Korean-Style Fried Chicken", description: "Double-fried, gochujang glaze, sesame, scallion.", category: "chicken", price: 56, isVegetarian: false, isSpicy: true, tag: "New" },
  { name: "Peri-Peri Chicken", description: "Flame-grilled chicken, peri-peri marinade, lemon rice.", category: "chicken", price: 52, isVegetarian: false, isSpicy: true },
  { name: "Classic Roast Chicken", description: "Herb roasted chicken, garlic mash, seasonal vegetables.", category: "chicken", price: 58, isVegetarian: false, isSpicy: false },
  { name: "Chicken Katsu", description: "Panko-crusted chicken breast, katsu curry sauce, steamed rice.", category: "chicken", price: 54, isVegetarian: false, isSpicy: false, tag: "Popular" },

  // Seafood
  { name: "Pan-Seared Sea Bass", description: "Crispy skin sea bass, brown butter, capers, charred lemon.", category: "seafood", price: 78, isVegetarian: false, isSpicy: false },
  { name: "Chili Lime Grilled Prawns", description: "Skewered prawns, chili-lime marinade, charred over open flame.", category: "seafood", price: 66, isVegetarian: false, isSpicy: true, tag: "Popular" },
  { name: "Grilled Salmon Fillet", description: "Miso-glazed salmon, bok choy, sesame rice.", category: "seafood", price: 74, isVegetarian: false, isSpicy: false },
  { name: "Seafood Linguine", description: "Prawns, clams, mussels, white wine garlic sauce.", category: "seafood", price: 80, isVegetarian: false, isSpicy: false, tag: "Chef's Pick" },
  { name: "Fish and Chips", description: "Beer-battered cod, triple-cooked chips, tartare sauce.", category: "seafood", price: 58, isVegetarian: false, isSpicy: false },

  // Desserts
  { name: "Dark Chocolate Fondant", description: "Molten dark chocolate center, salted caramel, vanilla bean ice cream.", category: "desserts", price: 34, isVegetarian: true, isSpicy: false, tag: "Popular" },
  { name: "Passionfruit Cheesecake", description: "Baked vanilla cheesecake, passionfruit glaze, toasted coconut.", category: "desserts", price: 32, isVegetarian: true, isSpicy: false },
  { name: "Sticky Toffee Pudding", description: "Warm date sponge, toffee sauce, vanilla ice cream.", category: "desserts", price: 30, isVegetarian: true, isSpicy: false },
  { name: "Tiramisu", description: "Espresso-soaked sponge, mascarpone cream, cocoa dust.", category: "desserts", price: 32, isVegetarian: true, isSpicy: false, tag: "New" },
  { name: "Lemon Tart", description: "Buttery pastry, tangy lemon curd, torched meringue.", category: "desserts", price: 28, isVegetarian: true, isSpicy: false },

  // Drinks
  { name: "Smoked Old Fashioned", description: "Bourbon, house bitters, orange oil, finished with cherrywood smoke.", category: "drinks", price: 42, isVegetarian: true, isSpicy: false, tag: "Chef's Pick" },
  { name: "Spiced Hibiscus Mocktail", description: "Hibiscus, ginger, chili syrup, soda, lime.", category: "drinks", price: 28, isVegetarian: true, isSpicy: true, tag: "New" },
  { name: "Passionfruit Mojito", description: "White rum, passionfruit, mint, lime, soda.", category: "drinks", price: 38, isVegetarian: true, isSpicy: false },
  { name: "House Espresso Martini", description: "Vodka, espresso, coffee liqueur, vanilla.", category: "drinks", price: 40, isVegetarian: true, isSpicy: false, tag: "Popular" },
  { name: "Fresh Watermelon Cooler", description: "Watermelon, lime, mint, soda — non-alcoholic.", category: "drinks", price: 22, isVegetarian: true, isSpicy: false },
];

export const CATEGORY_SEEDS = MENU_CATEGORIES.map((slug, index) => ({
  slug,
  name: slug.charAt(0).toUpperCase() + slug.slice(1),
  description: `Original ${slug} dishes from the MR_SK EATRIES kitchen.`,
  displayOrder: index,
}));

export const COUPON_SEEDS = [
  { code: "WELCOME10", type: "percentage" as const, value: 10, minimumSpend: 0 },
  { code: "MRSK20", type: "percentage" as const, value: 20, minimumSpend: 100 },
  { code: "EATRIES15", type: "percentage" as const, value: 15, minimumSpend: 50 },
  { code: "FLAT20", type: "fixed" as const, value: 20, minimumSpend: 80, maxUses: 100 },
];

const REVIEW_COMMENTS = [
  "Absolutely worth it — will be back for this again.",
  "Great flavor balance, generous portion size.",
  "One of the better dishes I've had here.",
  "Cooked perfectly, arrived hot and fresh.",
  "Solid choice, would recommend to a friend.",
  "Exceeded expectations for the price.",
  "Good but a touch too salty for my taste.",
  "Beautifully plated and tasted just as good.",
];

export function randomReviewComment(): string {
  return randomFrom(REVIEW_COMMENTS);
}
