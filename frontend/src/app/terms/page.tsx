import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${SITE_CONFIG.name}'s website and ordering platform.`,
};

const LAST_UPDATED = "August 4, 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle={`Last updated ${LAST_UPDATED}`}
        breadcrumbItems={[{ label: "Terms of Service" }]}
      />

      <div className="section-container max-w-3xl py-16 sm:py-20">
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:leading-relaxed">
          <p>
            By accessing or using the {SITE_CONFIG.name} website and ordering platform at{" "}
            {SITE_CONFIG.url} (the &quot;Service&quot;), you agree to be bound by these Terms of
            Service. If you do not agree, please do not use the Service.
          </p>

          <section>
            <h2>Accounts</h2>
            <p>
              You must provide accurate information when creating an account and are responsible
              for keeping your password confidential. You are responsible for all activity under
              your account. Notify us immediately at{" "}
              <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-brand-primary hover:underline dark:text-brand-accent">
                {SITE_CONFIG.contact.email}
              </a>{" "}
              if you suspect unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2>Orders</h2>
            <ul>
              <li>All prices are shown in Ghanaian Cedi (GHS) and include applicable taxes unless stated otherwise.</li>
              <li>Order totals are calculated and verified server-side at the time of purchase — displayed prices at checkout are the prices charged.</li>
              <li>We reserve the right to refuse or cancel an order (e.g. an item goes out of stock after ordering), in which case any payment taken will be refunded in full.</li>
              <li>Delivery time estimates are approximate and may vary with demand, weather, or traffic conditions.</li>
            </ul>
          </section>

          <section>
            <h2>Reservations</h2>
            <ul>
              <li>Reservations are subject to table availability and our stated cancellation-notice window.</li>
              <li>Repeated no-shows may result in restrictions on future online bookings.</li>
              <li>We hold reserved tables for a reasonable grace period past the booked time before releasing them.</li>
            </ul>
          </section>

          <section>
            <h2>Payments</h2>
            <p>
              Online payments are processed by our third-party payment provider under their own
              terms and security standards. We do not store your full card details. Cash on
              delivery/pickup is available where noted at checkout.
            </p>
          </section>

          <section>
            <h2>AI Assistant</h2>
            <p>
              Our AI concierge answers questions, offers recommendations, and can assist with
              placing orders or reservations based on your instructions. It only acts on real,
              current information from our menu, orders, and reservations systems — it will never
              invent a dish, price, or booking. You should still confirm order and reservation
              details before finalizing them.
            </p>
          </section>

          <section>
            <h2>Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to access another user&apos;s account or data without authorization</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Submit false, abusive, or defamatory reviews or content</li>
            </ul>
          </section>

          <section>
            <h2>Reviews</h2>
            <p>
              Reviews must reflect a genuine experience with the reviewed dish. We reserve the
              right to moderate or remove reviews that violate this or our general acceptable-use
              terms.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              The Service is provided &quot;as is&quot;. To the fullest extent permitted by law,
              {" "}{SITE_CONFIG.name} is not liable for indirect, incidental, or consequential
              damages arising from your use of the Service, beyond the value of the order or
              reservation in question.
            </p>
          </section>

          <section>
            <h2>Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the Service after a
              change constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              Questions about these terms? Reach us at{" "}
              <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-brand-primary hover:underline dark:text-brand-accent">
                {SITE_CONFIG.contact.email}
              </a>{" "}
              or {SITE_CONFIG.contact.address}.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
