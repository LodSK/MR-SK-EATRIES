import { MapPin } from "lucide-react";

interface LocationMapProps {
  address: string;
}

/**
 * Uses the Maps Embed API (a plain signed iframe URL) rather than the JS
 * Maps SDK — no client bundle, no loader script, renders server-side like
 * the rest of this page. Falls back to a static "address on file" card
 * instead of an iframe when no key is configured, so local/dev
 * environments without NEXT_PUBLIC_GOOGLE_MAPS_API_KEY never render a
 * broken embed.
 */
export function LocationMap({ address }: LocationMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-muted text-center text-sm text-muted-foreground">
        <MapPin className="h-6 w-6 text-brand-primary dark:text-brand-accent" />
        <span>{address}</span>
      </div>
    );
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}`;

  return (
    <div className="h-72 w-full overflow-hidden rounded-2xl border border-border">
      <iframe
        title="MR_SK EATRIES location"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
