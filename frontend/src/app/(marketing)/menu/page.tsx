import type { Metadata } from "next";
import { getMenuCategories, getMenuItems, getFeaturedMenuItems } from "@/lib/api/menu";
import { MENU_PRICE_BOUNDS } from "@/lib/constants/menu-data";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CategoryCard } from "@/components/home/CategoryCard";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { AIMenuAssistant } from "@/components/ai/AIMenuAssistant";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore the full MR_SK EATRIES menu — breakfast, lunch, dinner, burgers, pizza, chicken, seafood, desserts, and drinks. Search, filter, and order online.",
};

export default async function MenuLandingPage() {
  const [categories, items, featured] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
    getFeaturedMenuItems(6),
  ]);

  return (
    <>
      <PageHero
        eyebrow="The Full Menu"
        title="Every Dish, One Kitchen"
        subtitle="Nine categories, one standard. Search, filter, or browse by craving — everything here is made to order."
        breadcrumbItems={[{ label: "Menu" }]}
      />

      <section className="section-container py-16 sm:py-20" aria-labelledby="category-overview-heading">
        <SectionHeading
          eyebrow="Browse by Category"
          title="Category Overview"
          className="mx-auto mb-12 max-w-3xl"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20" aria-labelledby="featured-heading">
        <div className="section-container">
          <SectionHeading
            eyebrow="Right Now"
            title="Most Popular This Week"
            className="mx-auto mb-12 max-w-3xl"
          />
          <MenuGrid items={featured} />
        </div>
      </section>

      <section className="section-container py-16 sm:py-20" aria-labelledby="ai-assistant-heading">
        <AIMenuAssistant items={items} />
      </section>

      <section className="section-container py-16 sm:py-20" aria-labelledby="full-menu-heading">
        <SectionHeading
          eyebrow="Search & Filter"
          title="Find Your Next Favorite"
          className="mx-auto mb-10 max-w-3xl"
        />
        <MenuBrowser
          items={items}
          categories={categories}
          priceBounds={MENU_PRICE_BOUNDS}
          currency="GHS"
        />
      </section>
    </>
  );
}
