"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Mail, Send } from "lucide-react";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/validations/newsletter";
import { subscribeToNewsletter } from "@/lib/api/newsletter";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations/variants";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type SubmitState = "idle" | "submitting" | "success" | "error";

/** Sprint 17 — a real inline SVG (not the lucide icon) so its stroke can be
 * GSAP-drawn on success; a checkmark "arriving" reads as more of a payoff
 * moment than a static icon fading in. */
function AnimatedCheckmark() {
  const circleRef = React.useRef<SVGCircleElement>(null);
  const checkRef = React.useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion || !circleRef.current || !checkRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        circleRef.current,
        { strokeDashoffset: 63 },
        { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }
      ).fromTo(
        checkRef.current,
        { strokeDashoffset: 20 },
        { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" },
        "-=0.15"
      );
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle
        ref={circleRef}
        cx="10"
        cy="10"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="63"
        strokeDashoffset={prefersReducedMotion ? 0 : undefined}
      />
      <path
        ref={checkRef}
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="20"
        strokeDashoffset={prefersReducedMotion ? 0 : undefined}
      />
    </svg>
  );
}

export function Newsletter() {
  const [state, setState] = React.useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  async function onSubmit(values: NewsletterFormValues) {
    setState("submitting");
    setErrorMessage(null);
    try {
      await subscribeToNewsletter(values.email);
      setState("success");
      reset();
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="relative overflow-hidden bg-brand-secondary py-20 sm:py-28">
      <div className="bg-noise absolute inset-0 opacity-[0.04]" aria-hidden="true" />
      <div
        className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-accent/15 blur-[120px]"
        aria-hidden="true"
      />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="section-container relative flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          variants={fadeUp}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent"
        >
          <Mail className="h-6 w-6" strokeWidth={1.5} />
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="text-balance font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          Never Miss a Craving
        </motion.h2>

        <motion.p variants={fadeUp} className="max-w-xl text-balance text-white/65">
          Join our list for early access to new menu drops, seasonal specials, and
          reservation openings for our busiest nights — no spam, unsubscribe anytime.
        </motion.p>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-start"
        >
          <div className="flex-1 text-left">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@email.com"
              disabled={state === "submitting"}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "newsletter-email-error" : undefined}
              className="h-12 w-full rounded-md border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 transition-shadow duration-300 focus-visible:border-brand-accent focus-visible:ring-4 focus-visible:ring-brand-accent/20 disabled:opacity-60"
              {...register("email")}
            />
            {errors.email && (
              <p id="newsletter-email-error" className="mt-1.5 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={state === "submitting"}
            className="shrink-0"
          >
            {state === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subscribing
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </motion.form>

        <div aria-live="polite" className="min-h-[1.5rem]">
          {state === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-brand-accent"
            >
              <AnimatedCheckmark />
              You&apos;re on the list — welcome to MR_SK EATRIES!
            </motion.p>
          )}
          {state === "error" && errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
