import { filterAndSortMenuItems, createDefaultMenuFilters } from "./filterMenuItems";
import type { MenuItem, MenuFilterState } from "@/types/menu";

function makeItem(overrides: Partial<MenuItem>): MenuItem {
  return {
    id: overrides.id ?? "item-1",
    slug: overrides.slug ?? "item-1",
    name: overrides.name ?? "Item",
    description: overrides.description ?? "",
    longDescription: "",
    category: overrides.category ?? "burgers",
    price: overrides.price ?? 50,
    currency: "GHS",
    rating: overrides.rating ?? 4,
    reviewCount: 0,
    prepTimeMinutes: 15,
    tag: overrides.tag,
    isVegetarian: overrides.isVegetarian ?? false,
    isSpicy: overrides.isSpicy ?? false,
    isAvailable: true,
    isFeatured: false,
    stockQuantity: 10,
    popularityScore: overrides.popularityScore ?? 0,
    createdAt: overrides.createdAt ?? "2024-01-01T00:00:00.000Z",
    ingredients: [],
    nutrition: { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 },
    galleryCount: 0,
    ...overrides,
  };
}

const items: MenuItem[] = [
  makeItem({ id: "1", name: "BBQ Bacon Burger", category: "burgers", price: 60, rating: 4.5, tag: "Popular", popularityScore: 90 }),
  makeItem({ id: "2", name: "Veggie Delight", category: "burgers", price: 45, rating: 4.8, isVegetarian: true, popularityScore: 40 }),
  makeItem({ id: "3", name: "Spicy Jerk Chicken", category: "chicken", price: 70, rating: 4.2, isSpicy: true, tag: "Chef's Pick", popularityScore: 60 }),
  makeItem({
    id: "4",
    name: "Smoked Old Fashioned",
    category: "drinks",
    price: 35,
    rating: 4.9,
    tag: "New",
    createdAt: "2025-01-01T00:00:00.000Z",
    popularityScore: 20,
  }),
];

function baseFilters(overrides: Partial<MenuFilterState> = {}): MenuFilterState {
  return { ...createDefaultMenuFilters([0, 1000]), ...overrides };
}

describe("filterAndSortMenuItems", () => {
  it("returns every item when filters are all default", () => {
    expect(filterAndSortMenuItems(items, baseFilters())).toHaveLength(4);
  });

  it("filters by category", () => {
    const result = filterAndSortMenuItems(items, baseFilters({ category: "burgers" }));
    expect(result.map((i) => i.id).sort()).toEqual(["1", "2"]);
  });

  it("filters by price range", () => {
    const result = filterAndSortMenuItems(items, baseFilters({ minPrice: 50, maxPrice: 70 }));
    expect(result.map((i) => i.id).sort()).toEqual(["1", "3"]);
  });

  it("filters by search text across name and description", () => {
    const result = filterAndSortMenuItems(items, baseFilters({ search: "jerk" }));
    expect(result.map((i) => i.id)).toEqual(["3"]);
  });

  it("search is case-insensitive and trims whitespace", () => {
    const result = filterAndSortMenuItems(items, baseFilters({ search: "  BACON  " }));
    expect(result.map((i) => i.id)).toEqual(["1"]);
  });

  it("filters by onlyVegetarian", () => {
    const result = filterAndSortMenuItems(items, baseFilters({ onlyVegetarian: true }));
    expect(result.map((i) => i.id)).toEqual(["2"]);
  });

  it("filters by onlySpicy", () => {
    const result = filterAndSortMenuItems(items, baseFilters({ onlySpicy: true }));
    expect(result.map((i) => i.id)).toEqual(["3"]);
  });

  it("filters by tag flags (Popular / Chef's Pick / New)", () => {
    expect(filterAndSortMenuItems(items, baseFilters({ onlyPopular: true })).map((i) => i.id)).toEqual(["1"]);
    expect(filterAndSortMenuItems(items, baseFilters({ onlyChefsPick: true })).map((i) => i.id)).toEqual(["3"]);
    expect(filterAndSortMenuItems(items, baseFilters({ onlyNew: true })).map((i) => i.id)).toEqual(["4"]);
  });

  it("sorts by price ascending / descending", () => {
    expect(filterAndSortMenuItems(items, baseFilters({ sort: "price-asc" })).map((i) => i.id)).toEqual(["4", "2", "1", "3"]);
    expect(filterAndSortMenuItems(items, baseFilters({ sort: "price-desc" })).map((i) => i.id)).toEqual(["3", "1", "2", "4"]);
  });

  it("sorts by rating descending", () => {
    expect(filterAndSortMenuItems(items, baseFilters({ sort: "rating" })).map((i) => i.id)).toEqual(["4", "2", "1", "3"]);
  });

  it("sorts by newest first", () => {
    expect(filterAndSortMenuItems(items, baseFilters({ sort: "newest" })).map((i) => i.id)[0]).toBe("4");
  });

  it("sorts by popularity by default", () => {
    expect(filterAndSortMenuItems(items, baseFilters({ sort: "popularity" })).map((i) => i.id)).toEqual(["1", "3", "2", "4"]);
  });

  it("does not mutate the input array", () => {
    const copy = [...items];
    filterAndSortMenuItems(items, baseFilters({ sort: "price-asc" }));
    expect(items).toEqual(copy);
  });
});

describe("createDefaultMenuFilters", () => {
  it("uses the given price bounds and defaults everything else off", () => {
    const filters = createDefaultMenuFilters([10, 90], "pizza");
    expect(filters.minPrice).toBe(10);
    expect(filters.maxPrice).toBe(90);
    expect(filters.category).toBe("pizza");
    expect(filters.onlyPopular).toBe(false);
    expect(filters.sort).toBe("popularity");
  });
});
