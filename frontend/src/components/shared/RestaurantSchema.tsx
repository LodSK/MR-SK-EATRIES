import { SITE_CONFIG, SOCIAL_LINKS, STRUCTURED_HOURS } from "@/config/site";

/** Site-wide Restaurant JSON-LD (schema.org), rendered once from the root layout. */
export function RestaurantSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    servesCuisine: "Modern Comfort Food",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Independence Avenue",
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    sameAs: SOCIAL_LINKS.map((link) => link.href),
    openingHoursSpecification: STRUCTURED_HOURS.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.dayOfWeek,
      opens: slot.opens,
      closes: slot.closes,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
