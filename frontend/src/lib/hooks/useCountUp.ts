"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: boolean;
}

/**
 * Animates a number from 0 to `end` once `start` becomes true (e.g. driven
 * by an IntersectionObserver in the calling component). Uses an eased
 * requestAnimationFrame loop rather than setInterval for smoothness.
 */
export function useCountUp({ end, duration = 1800, start = false }: UseCountUpOptions) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo — fast start, gentle settle, matches the site's motion language
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * end));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [start, end, duration]);

  return value;
}
