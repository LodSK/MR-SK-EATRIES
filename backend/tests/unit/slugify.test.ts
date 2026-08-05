import { slugify, uniqueSlug } from "@/utils/slugify";

describe("slugify", () => {
  it("lowercases and dashes a normal title", () => {
    expect(slugify("BBQ Chicken Pizza")).toBe("bbq-chicken-pizza");
  });

  it("strips punctuation in strict mode", () => {
    expect(slugify("Chef's Pick: Today's Special!")).toBe("chefs-pick-todays-special");
  });

  it("collapses repeated whitespace", () => {
    expect(slugify("  Smoked   Old  Fashioned  ")).toBe("smoked-old-fashioned");
  });
});

describe("uniqueSlug", () => {
  it("returns the base slug when it isn't taken", async () => {
    const result = await uniqueSlug("Fresh Title", async () => false);
    expect(result).toBe("fresh-title");
  });

  it("appends -2 when the base slug is already taken once", async () => {
    const taken = new Set(["fresh-title"]);
    const result = await uniqueSlug("Fresh Title", async (slug) => taken.has(slug));
    expect(result).toBe("fresh-title-2");
  });

  it("keeps incrementing the suffix until a free slug is found", async () => {
    const taken = new Set(["fresh-title", "fresh-title-2", "fresh-title-3"]);
    const result = await uniqueSlug("Fresh Title", async (slug) => taken.has(slug));
    expect(result).toBe("fresh-title-4");
  });
});
