import { Fraunces, Manrope, Instrument_Serif } from "next/font/google";

/**
 * Display face — used for headlines, the wordmark, and section titles.
 * Fraunces is a high-contrast serif with real optical weight range,
 * deliberately chosen over the "warm cream + generic serif" default:
 * it has a wet, slightly wonky ink-trap character at heavier weights
 * that reads as crafted rather than corporate.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Body face — used for paragraphs, UI labels, buttons, nav.
 * Manrope: a clean geometric-humanist sans with warmth in its
 * curves, pairs quietly against Fraunces without competing.
 */
export const fontBody = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Accent face — reserved for the tagline, pull-quotes, and menu
 * flourishes ("Taste Beyond Expectations"). Used sparingly by design.
 */
export const fontAccent = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["400"],
  style: ["italic", "normal"],
  display: "swap",
});

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable} ${fontAccent.variable}`;
