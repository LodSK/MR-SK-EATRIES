import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMenuItemBySlug, getMenuItems, getRelatedMenuItems } from "@/lib/api/menu";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { MealDetails } from "@/components/menu/MealDetails";

export const dynamic = "force-dynamic";

interface MealPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const items = await getMenuItems();
    return items.map((item) => ({ category: item.category, slug: item.slug }));
  } catch {
    // The API is a separate service and is not available during every build.
    return [];
  }
}

export async function generateMetadata({ params }: MealPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMenuItemBySlug(slug);

  if (!item) return { title: "Menu" };

  return {
    title: item.name,
    description: item.description,
  };
}

export default async function MealPage({ params }: MealPageProps) {
  const { category, slug } = await params;
  const item = await getMenuItemBySlug(slug);

  if (!item || item.category !== category) {
    notFound();
  }

  const relatedItems = await getRelatedMenuItems(item, 3);
  const categoryLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1);

  return (
    <>
      <div className="section-container pt-8">
        <Breadcrumb
          items={[
            { label: "Menu", href: "/menu" },
            { label: categoryLabel, href: `/menu/${item.category}` },
            { label: item.name },
          ]}
        />
      </div>
      <MealDetails item={item} relatedItems={relatedItems} />
    </>
  );
}
