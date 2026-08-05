import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { TrackOrderForm } from "@/components/cart/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Look up the status of your order using your order number and email address.",
};

export default function TrackOrderPage() {
  return (
    <>
      <PageHero
        eyebrow="Order Status"
        title="Track Your Order"
        subtitle="Enter your order number and the email address you used at checkout."
        breadcrumbItems={[{ label: "Track Order" }]}
      />
      <div className="section-container max-w-2xl py-16 sm:py-20">
        <TrackOrderForm />
      </div>
    </>
  );
}
