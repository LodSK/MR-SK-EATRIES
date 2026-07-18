"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, guarded for SSR — GSAP/ScrollTrigger touch `window`/`document`,
// which don't exist during Next.js server rendering.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
