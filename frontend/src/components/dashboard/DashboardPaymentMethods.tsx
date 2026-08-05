"use client";

import * as React from "react";
import { CreditCard, Plus } from "lucide-react";
import {
  getPaymentMethods,
  createPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
} from "@/lib/api/paymentMethods";
import type { PaymentMethod } from "@/types/paymentMethod";
import type { PaymentMethodFormValues } from "@/components/dashboard/PaymentMethodForm";
import { PaymentMethodCard } from "@/components/dashboard/PaymentMethodCard";
import { PaymentMethodForm } from "@/components/dashboard/PaymentMethodForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";

export function DashboardPaymentMethods() {
  const [methods, setMethods] = React.useState<PaymentMethod[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

  const load = React.useCallback(() => {
    getPaymentMethods()
      .then(setMethods)
      .catch(() => setMethods([]));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(values: PaymentMethodFormValues) {
    const result = await createPaymentMethod({
      nickname: values.nickname,
      maskedNumber: values.last4,
      brand: values.brand,
      expiryMonth: values.expiryMonth,
      expiryYear: values.expiryYear,
      isDefault: values.isDefault,
    });
    if (result.success) {
      load();
      setFormOpen(false);
    }
    return result;
  }

  async function handleDelete(id: string) {
    await deletePaymentMethod(id);
    load();
  }

  async function handleSetDefault(id: string) {
    await setDefaultPaymentMethod(id);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      {formOpen ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-base font-bold">Add Payment Method</h3>
          <PaymentMethodForm onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
        </div>
      ) : (
        <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Card
        </Button>
      )}

      {methods === null ? (
        <Skeleton className="h-20 w-full" />
      ) : methods.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" strokeWidth={1.5} />}
          title="No saved cards"
          description="Save a card for faster checkout — this is a placeholder architecture, no real payment processing yet."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {methods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
