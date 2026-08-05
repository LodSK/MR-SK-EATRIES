import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMenuCategories,
  getMenuCategoryBySlug,
  getMenuItemsByCategory,
} from "@/lib/api/menu";
import type { MenuCategorySlug } from "@/types/menu";
import { PageHero } from "@/components/shared/PageHero";
import { MenuBrowser } from "@/components/menu/MenuBrowser";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await getMenuCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getMenuCategoryBySlug(slug as MenuCategorySlug);

  if (!category) return { title: "Menu" };

  return {
    title: category.name,
    description: `${category.description} — browse the ${category.name} menu at MR_SK EATRIES.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = await getMenuCategoryBySlug(slug as MenuCategorySlug);

  if (!category) {
    notFound();
  }

  const items = await getMenuItemsByCategory(category.slug);
  const prices = items.map((item) => item.price);
  const priceBounds: [number, number] =
    prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [0, 0];

  return (
    <>
      <PageHero
        eyebrow="Menu"
        title={category.name}
        subtitle={category.description}
        breadcrumbItems={[{ label: "Menu", href: "/menu" }, { label: category.name }]}
      />

      <section className="section-container py-16 sm:py-20">
        <MenuBrowser
          items={items}
          priceBounds={priceBounds}
          currency="GHS"
          lockedCategory={category.slug}
        />
      </section>
    </>
  );
}
