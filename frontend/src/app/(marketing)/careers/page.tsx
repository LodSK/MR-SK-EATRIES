import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CareersPageContent } from "@/components/careers/CareersPageContent";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the team at MR_SK EATRIES — open kitchen, front of house, and bar positions.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Join Our Team"
        title="Careers at MR_SK EATRIES"
        subtitle="We're always looking for people who care about hospitality as much as we do."
        breadcrumbItems={[{ label: "Careers" }]}
      />
      <div className="section-container py-16 sm:py-20">
        <CareersPageContent />
      </div>
    </>
  );
}
