"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { checkoutSchema, type CheckoutSchemaValues } from "@/lib/validations/checkout";
import { submitOrder } from "@/lib/api/cart";
import type { SubmitOrderResult } from "@/types/cart";
import { useCart } from "@/lib/hooks/useCart";
import { DeliverySelector } from "@/components/cart/DeliverySelector";
import { PaymentSelector } from "@/components/cart/PaymentSelector";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface CheckoutFormProps {
  onSuccess: (result: SubmitOrderResult) => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { items, deliveryMethod, setDeliveryMethod, clearCart } = useCart();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutSchemaValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod,
      paymentMethod: "card",
    },
  });

  const watchedDeliveryMethod = watch("deliveryMethod");
  const watchedPaymentMethod = watch("paymentMethod");
  const isPickup = watchedDeliveryMethod === "pickup";

  async function onSubmit(values: CheckoutSchemaValues) {
    setServerError(null);
    const result = await submitOrder(values, items);
    if (!result.success) {
      setServerError(result.message);
      return;
    }

    if (result.requiresRedirect) {
      // Cart stays intact until CheckoutVerifyContent confirms payment —
      // if the customer abandons Paystack's checkout, their cart is still
      // there rather than silently emptied for an order that never paid.
      window.location.href = result.requiresRedirect;
      return;
    }

    clearCart();
    onSuccess(result);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      {serverError && <FormMessage type="error">{serverError}</FormMessage>}

      {/* Customer Information */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold">Customer Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name" error={errors.fullName?.message}>
            <input
              type="text"
              {...register("fullName")}
              className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Phone Number" error={errors.phone?.message}>
            <input
              type="tel"
              {...register("phone")}
              className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Email Address" error={errors.email?.message} className="sm:col-span-2">
            <input
              type="email"
              {...register("email")}
              className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
        </div>
      </section>

      {/* Delivery Method */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold">Pickup or Delivery</h2>
        <DeliverySelector
          value={watchedDeliveryMethod}
          onChange={(method) => {
            setValue("deliveryMethod", method);
            setDeliveryMethod(method);
          }}
        />
      </section>

      {/* Delivery Address */}
      <CollapsibleSection show={!isPickup}>
        <section>
          <h2 className="mb-4 font-display text-lg font-bold">Delivery Address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Street Address" error={errors.street?.message} className="sm:col-span-2">
              <input
                type="text"
                {...register("street")}
                className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
              />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <input
                type="text"
                {...register("city")}
                className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
              />
            </Field>
          </div>
        </section>
      </CollapsibleSection>

      {/* Delivery Instructions */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold">Delivery Instructions</h2>
        <Field label="Notes for the kitchen or rider (optional)" error={errors.instructions?.message}>
          <textarea
            rows={3}
            {...register("instructions")}
            placeholder="e.g. Ring the bell, leave at the gate, extra napkins…"
            className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus-visible:border-brand-primary"
          />
        </Field>
      </section>

      {/* Payment Method */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold">Payment Method</h2>
        <PaymentSelector
          value={watchedPaymentMethod}
          onChange={(method) => setValue("paymentMethod", method)}
        />
      </section>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Placing Order…
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  );
}

interface CollapsibleSectionProps {
  show: boolean;
  children: React.ReactNode;
}

/**
 * Keeps `children` mounted (so `react-hook-form`'s `register`/validation
 * for fields inside it — e.g. street/city — behaves identically to before)
 * and animates height+opacity via GSAP instead of the previous
 * instant-mount/unmount snap. Skips animating the very first render (the
 * section simply starts in the right state — pickup vs delivery — rather
 * than visibly collapsing on load).
 */
function CollapsibleSection({ show, children }: CollapsibleSectionProps) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const isFirstRender = React.useRef(true);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(el, { height: show ? "auto" : 0, opacity: show ? 1 : 0 });
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(el, { height: show ? "auto" : 0, opacity: show ? 1 : 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (show) {
        gsap.set(el, { height: "auto" });
        const targetHeight = el.offsetHeight;
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          {
            height: targetHeight,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(el, { height: "auto" });
            },
          }
        );
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
      }
    }, el);

    return () => ctx.revert();
  }, [show, prefersReducedMotion]);

  return (
    <div ref={wrapperRef} style={{ overflow: "hidden" }}>
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

function Field({ label, error, className, children }: FieldProps) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
