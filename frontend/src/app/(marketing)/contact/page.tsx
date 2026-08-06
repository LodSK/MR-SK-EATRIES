import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { LocationMap } from "@/components/contact/LocationMap";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE_CONFIG.name} — questions, feedback, or group bookings.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="Questions, feedback, or planning something special? We'd love to hear from you."
        breadcrumbItems={[{ label: "Contact" }]}
      />

      <div className="section-container py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-bold">Visit Us</h2>
              <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" />
                  {SITE_CONFIG.contact.address}
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" />
                  <a href={`tel:${SITE_CONFIG.contact.phone}`} className="hover:text-foreground">
                    {SITE_CONFIG.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" />
                  <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-foreground">
                    {SITE_CONFIG.contact.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
                <Clock className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
                Opening Hours
              </h2>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {SITE_CONFIG.hours.map((slot) => (
                  <li key={slot.days} className="flex items-center justify-between gap-4">
                    <span>{slot.days}</span>
                    <span className="font-medium text-foreground">{slot.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <LocationMap address={SITE_CONFIG.contact.address} />
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
