import type { MenuFilterState, MenuItem } from "@/types/menu";

/**
 * Pure function: given the full item set and the current filter/sort
 * state, returns the filtered + sorted result. Deliberately framework-
 * free (no hooks, no React) so it can run identically on the client
 * today, or move into a backend query builder in Sprint 9 without any
 * rewrite — only the caller changes.
 */
export function filterAndSortMenuItems(items: MenuItem[], filters: MenuFilterState): MenuItem[] {
  const query = filters.search.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category) return false;
    if (item.price < filters.minPrice || item.price > filters.maxPrice) return false;
    if (filters.onlyPopular && item.tag !== "Popular") return false;
    if (filters.onlyChefsPick && item.tag !== "Chef's Pick") return false;
    if (filters.onlyNew && item.tag !== "New") return false;
    if (filters.onlyVegetarian && !item.isVegetarian) return false;
    if (filters.onlySpicy && !item.isSpicy) return false;

    if (query) {
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesDescription = item.description.toLowerCase().includes(query);
      if (!matchesName && !matchesDescription) return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popularity":
      default:
        return b.popularityScore - a.popularityScore;
    }
  });
}

export function createDefaultMenuFilters(
  priceBounds: [number, number],
  category: MenuFilterState["category"] = "all"
): MenuFilterState {
  return {
    search: "",
    category,
    minPrice: priceBounds[0],
    maxPrice: priceBounds[1],
    onlyPopular: false,
    onlyChefsPick: false,
    onlyNew: false,
    onlyVegetarian: false,
    onlySpicy: false,
    sort: "popularity",
  };
}
