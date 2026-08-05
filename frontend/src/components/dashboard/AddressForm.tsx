"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { addressSchema, type AddressSchemaValues } from "@/lib/validations/address";
import type { Address } from "@/types/address";
import { FormMessage } from "@/components/auth/FormMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface AddressFormProps {
  initialAddress?: Address;
  onSubmit: (values: AddressSchemaValues) => Promise<{ success: boolean; message: string }>;
  onCancel: () => void;
}

export function AddressForm({ initialAddress, onSubmit, onCancel }: AddressFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressSchemaValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: initialAddress?.label ?? "Home",
      street: initialAddress?.street ?? "",
      city: initialAddress?.city ?? "",
      notes: initialAddress?.notes ?? "",
      isDefault: initialAddress?.isDefault ?? false,
    },
  });

  const isDefault = watch("isDefault");

  async function handleFormSubmit(values: AddressSchemaValues) {
    setServerError(null);
    const result = await onSubmit(values);
    if (!result.success) setServerError(result.message);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
      {serverError && <FormMessage type="error">{serverError}</FormMessage>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Label</label>
          <input
            type="text"
            {...register("label")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">City</label>
          <input
            type="text"
            {...register("city")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
          {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Street Address</label>
        <input
          type="text"
          {...register("street")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
        {errors.street && <p className="mt-1 text-xs text-destructive">{errors.street.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Notes (optional)</label>
        <input
          type="text"
          placeholder="Gate code, landmark, etc."
          {...register("notes")}
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
        <Checkbox checked={isDefault} onCheckedChange={(v) => setValue("isDefault", v === true)} />
        Set as default address
      </label>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Address"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
