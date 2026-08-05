"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { FormMessage } from "@/components/auth/FormMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const paymentMethodFormSchema = z.object({
  nickname: z.string().min(1, "Give this card a nickname."),
  last4: z.string().regex(/^\d{4}$/, "Enter the last 4 digits."),
  brand: z.string().min(1).default("Card"),
  expiryMonth: z.coerce.number().int().min(1).max(12),
  expiryYear: z.coerce.number().int().min(new Date().getFullYear()),
  isDefault: z.boolean().optional().default(false),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodFormSchema>;

interface PaymentMethodFormProps {
  onSubmit: (values: PaymentMethodFormValues) => Promise<{ success: boolean; message: string }>;
  onCancel: () => void;
}

export function PaymentMethodForm({ onSubmit, onCancel }: PaymentMethodFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: { brand: "Card", isDefault: false },
  });

  const isDefault = watch("isDefault");

  async function handleFormSubmit(values: PaymentMethodFormValues) {
    setServerError(null);
    const result = await onSubmit(values);
    if (!result.success) setServerError(result.message);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        Placeholder architecture only — no real card processing is connected yet. Never enter a real card number.
      </div>

      {serverError && <FormMessage type="error">{serverError}</FormMessage>}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Card Nickname</label>
        <input
          type="text"
          placeholder="Personal Visa"
          {...register("nickname")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.nickname && <p className="mt-1 text-xs text-destructive">{errors.nickname.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Last 4 Digits</label>
          <input
            type="text"
            maxLength={4}
            placeholder="1234"
            {...register("last4")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
          {errors.last4 && <p className="mt-1 text-xs text-destructive">{errors.last4.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Month</label>
          <input
            type="number"
            min={1}
            max={12}
            placeholder="MM"
            {...register("expiryMonth")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Year</label>
          <input
            type="number"
            min={new Date().getFullYear()}
            placeholder="YYYY"
            {...register("expiryYear")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
        <Checkbox checked={isDefault} onCheckedChange={(v) => setValue("isDefault", v === true)} />
        Set as default card
      </label>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Card"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
