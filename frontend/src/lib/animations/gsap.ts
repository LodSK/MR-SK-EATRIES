"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

// Registered once, guarded for SSR — GSAP/ScrollTrigger/Flip touch
// `window`/`document`, which don't exist during Next.js server rendering.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

export { gsap, ScrollTrigger, Flip };
