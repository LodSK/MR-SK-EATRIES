"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { verifyPayment } from "@/lib/api/orders";
import { useCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations/variants";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";
import { AnimatedCheckmark } from "@/components/cart/AnimatedCheckmark";
import { AnimatedCross } from "@/components/cart/AnimatedCross";

type VerifyStatus = "checking" | "success" | "failed";

/**
 * A single persistent icon container that crossfades the spinner into a
 * checkmark/cross rather than the previous three-early-return structure
 * unmounting the whole page and remounting a different one — the visual
 * "resolve" this replaces a jump-cut with. Both result icons stay mounted
 * (opacity 0) so a single mount transition, not a state machine, handles
 * the one-shot "checking" -> "success"|"failed" move.
 */
function VerifyStatusIcon({ status }: { status: VerifyStatus }) {
  const spinnerRef = React.useRef<HTMLDivElement | null>(null);
  const resultRef = React.useRef<HTMLDivElement | null>(null);
  const prevStatusRef = React.useRef<VerifyStatus>(status);
  const prefersReducedMotion = useReducedMotion();
  const isResolved = status !== "checking";

  React.useEffect(() => {
    const shouldAnimate = status !== "checking" && prevStatusRef.current !== status;
    prevStatusRef.current = status;
    if (!shouldAnimate) return;

    const spinnerEl = spinnerRef.current;
    const resultEl = resultRef.current;
    if (!spinnerEl || !resultEl) return;

    if (prefersReducedMotion) {
      gsap.set(spinnerEl, { opacity: 0 });
      gsap.set(resultEl, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(spinnerEl, { opacity: 0, scale: 0.6, duration: 0.25, ease: "power2.in" })
        .fromTo(
          resultEl,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.05"
        );
    });

    return () => ctx.revert();
  }, [status, prefersReducedMotion]);

  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <div ref={spinnerRef} className="absolute inset-0 flex items-center justify-center" style={{ opacity: isResolved ? 0 : 1 }}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <div
        ref={resultRef}
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-full",
          status === "success" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
          status === "failed" && "bg-destructive/15 text-destructive"
        )}
        style={{ opacity: isResolved ? 1 : 0 }}
      >
        {status === "success" && <AnimatedCheckmark className="h-8 w-8" />}
        {status === "failed" && <AnimatedCross className="h-8 w-8" />}
      </div>
    </div>
  );
}

/**
 * Lands here after Paystack's hosted checkout redirects back
 * (callback_url set on initialize). Paystack sends the reference as
 * `reference` (also duplicated as `trxref`, its older param name) — this
 * re-verifies against Paystack directly rather than trusting either query
 * param's mere presence as proof of payment.
 */
export function CheckoutVerifyContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref") ?? "";
  const { clearCart } = useCart();

  const [status, setStatus] = React.useState<VerifyStatus>("checking");
  const [message, setMessage] = React.useState<string | null>(null);
  const [orderNumber, setOrderNumber] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference was provided.");
      return;
    }

    verifyPayment(reference).then((result) => {
      if (cancelled) return;
      if (result.paid) {
        clearCart();
        setStatus("success");
        setOrderNumber(result.order?.orderNumber ?? null);
      } else {
        setStatus("failed");
      }
      setMessage(result.message);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return (
    <div className="section-container flex flex-col items-center gap-4 py-24 text-center">
      <VerifyStatusIcon status={status} />

      {status === "checking" && <p className="text-muted-foreground">Confirming your payment…</p>}

      {status === "failed" && (
        <motion.div key="failed" variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center gap-4">
          <h1 className="font-display text-2xl font-bold">Payment Not Completed</h1>
          <p className="max-w-sm text-muted-foreground">{message}</p>
          <Button asChild size="lg" variant="outline" className="mt-2">
            <Link href="/checkout">Back to Checkout</Link>
          </Button>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div key="success" variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center gap-5">
          <h1 className="font-display text-3xl font-bold">Payment Confirmed!</h1>
          <p className="max-w-md text-muted-foreground">{message}</p>
          {orderNumber && (
            <p className="font-mono text-sm text-muted-foreground">
              Order Reference: <span className="font-bold text-foreground">{orderNumber}</span>
            </p>
          )}
          <Button asChild size="lg" variant="accent" className="mt-4">
            <Link href="/menu">Back to Menu</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
