import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look at the dishes, drinks, and atmosphere at MR_SK EATRIES.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="A Closer Look"
        title="Gallery"
        subtitle="Dishes, drinks, and the atmosphere that makes MR_SK EATRIES what it is."
        breadcrumbItems={[{ label: "Gallery" }]}
      />
      <div className="section-container py-16 sm:py-20">
        <GalleryGrid />
      </div>
    </>
  );
}
