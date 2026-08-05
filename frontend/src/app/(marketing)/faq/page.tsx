import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { FAQ } from "@/components/home/FAQ";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to what MR_SK EATRIES guests ask us most — reservations, ordering, delivery, payments, opening hours, and dietary options.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Good to Know"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before you book, order, or visit."
        breadcrumbItems={[{ label: "FAQ" }]}
      />
      <FAQ />
    </>
  );
}
