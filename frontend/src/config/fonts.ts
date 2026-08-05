import { Fraunces, Manrope, Instrument_Serif } from "next/font/google";

/**
 * Display face — used for headlines, the wordmark, and section titles.
 * Fraunces is a high-contrast serif with real optical weight range,
 * deliberately chosen over the "warm cream + generic serif" default:
 * it has a wet, slightly wonky ink-trap character at heavier weights
 * that reads as crafted rather than corporate.
 *
 * Weight/style set trimmed to exactly what's used: a codebase-wide grep of
 * every `font-*` Tailwind weight utility found only bold/semibold/medium/
 * normal in use (never thin/extralight/light/extrabold/black), and
 * `font-display` is never paired with `italic` anywhere.
 *
 * `display: "optional"` (not the usual "swap") on a page this long: a
 * Lighthouse run surfaced two full-page layout shifts (CLS) traced to
 * "Web font loaded" on the homepage — every heading using these faces
 * reflows on swap, and that compounds significantly by the time it
 * reaches the footer ~12,000px down. "optional" skips the delayed swap
 * entirely (fallback stays if the font isn't ready almost immediately),
 * trading an occasional fallback-font first paint for zero layout shift.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "optional",
});

/**
 * Body face — used for paragraphs, UI labels, buttons, nav.
 * Manrope: a clean geometric-humanist sans with warmth in its
 * curves, pairs quietly against Fraunces without competing.
 */
export const fontBody = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "optional",
});

/**
 * Accent face — reserved for the tagline, pull-quotes, and menu
 * flourishes ("Taste Beyond Expectations"). Used sparingly by design.
 */
export const fontAccent = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["400"],
  style: ["italic"],
  display: "optional",
});

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable} ${fontAccent.variable}`;
