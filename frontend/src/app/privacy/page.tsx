import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_CONFIG.name} collects, uses, and protects your information.`,
};

const LAST_UPDATED = "August 4, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle={`Last updated ${LAST_UPDATED}`}
        breadcrumbItems={[{ label: "Privacy Policy" }]}
      />

      <div className="section-container max-w-3xl py-16 sm:py-20">
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:leading-relaxed">
          <p>
            {SITE_CONFIG.name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website
            and ordering platform at {SITE_CONFIG.url}. This policy explains what information we
            collect, why we collect it, and the choices you have.
          </p>

          <section>
            <h2>Information We Collect</h2>
            <ul>
              <li>
                <strong>Account information:</strong> full name, email address, phone number, and
                delivery addresses you provide when registering, ordering, or booking a reservation.
              </li>
              <li>
                <strong>Order and reservation details:</strong> items ordered, delivery/pickup
                preferences, special requests, and booking history.
              </li>
              <li>
                <strong>Payment information:</strong> processed by our third-party payment
                provider — we never store full card numbers on our own servers.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, device/browser type, and general
                interaction data, used to improve the site.
              </li>
              <li>
                <strong>AI assistant conversations:</strong> messages you send our chat concierge
                are processed by our AI provider to generate a response and are retained only for
                the duration of your session unless you are signed in, in which case a short
                recent-history window is kept to maintain context.
              </li>
            </ul>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p>We use the information above to:</p>
            <ul>
              <li>Process and fulfill orders and reservations</li>
              <li>Send order confirmations, reservation confirmations, and account-related emails</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Personalize recommendations and search results</li>
              <li>Improve our menu, service, and platform based on aggregate usage patterns</li>
              <li>Detect and prevent fraud or abuse of the platform</li>
            </ul>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <p>
              We share the minimum information necessary with trusted service providers to operate
              the platform: our payment processor (to complete transactions), our email provider (to
              send transactional email), our image hosting provider (for uploaded photos), and our AI
              provider (to power the chat concierge, recommendations, and search). None of these
              providers are permitted to use your data for their own marketing purposes.
            </p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <p>You can at any time:</p>
            <ul>
              <li>Access or update your account information from your profile settings</li>
              <li>Request a copy of the personal data we hold about you</li>
              <li>Request deletion of your account and associated personal data</li>
              <li>Opt out of marketing emails via the unsubscribe link in any newsletter</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-brand-primary hover:underline dark:text-brand-accent">
                {SITE_CONFIG.contact.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              We use essential cookies to keep you signed in and remember your cart, and
              non-essential analytics cookies to understand how the site is used. You can control
              cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p>
              We retain order and reservation records for as long as needed for accounting, legal,
              and customer-support purposes. Account data is retained until you request deletion.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be reflected by an
              updated &quot;Last updated&quot; date at the top of this page.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              Questions about this policy? Reach us at{" "}
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
