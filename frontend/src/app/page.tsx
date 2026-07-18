import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

/**
 * Placeholder only. The full homepage (hero, featured meals, story,
 * categories, "why choose us") is built in Sprint 3 — this file exists
 * so the Sprint 2 layout/navbar/footer/theme system can be verified
 * end to end.
 */
export default function HomePage() {
  return (
    <section className="section-container flex min-h-[70vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="eyebrow">Sprint 2 checkpoint</span>
      <h1 className="max-w-2xl text-balance font-display text-4xl font-bold sm:text-6xl">
        MR_SK <span className="text-brand-primary">EATRIES</span>
      </h1>
      <p className="font-accent text-xl italic text-brand-primary dark:text-brand-accent">
        Taste Beyond Expectations
      </p>
      <p className="max-w-md text-sm text-muted-foreground">
        Layout, theme, navigation, and footer are wired up. The full homepage
        hero and content sections arrive in Sprint 3.
      </p>
    </section>
  );
}
