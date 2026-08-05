import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { RESERVATION_GUIDELINES } from "@/lib/constants/reservation-data";

export function ReservationGuidelines() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-lg font-bold">Reservation Guidelines</h3>
        <ul className="flex flex-col gap-3">
          {RESERVATION_GUIDELINES.map((guideline) => (
            <li key={guideline} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" />
              {guideline}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-lg font-bold">Need Help?</h3>
        <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" />
            <a href={`tel:${SITE_CONFIG.contact.phone}`} className="hover:text-foreground">
              {SITE_CONFIG.contact.phone}
            </a>
          </li>
          <li className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" />
            <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-foreground">
              {SITE_CONFIG.contact.email}
            </a>
          </li>
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" />
            {SITE_CONFIG.contact.address}
          </li>
        </ul>
      </div>
    </div>
  );
}
