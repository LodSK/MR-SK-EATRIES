"use client";

import * as React from "react";
import { MapPinOff, Plus } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { addAddress, updateAddress, removeAddress } from "@/lib/api/addresses";
import type { Address } from "@/types/address";
import type { AddressSchemaValues } from "@/lib/validations/address";
import { AddressCard } from "@/components/dashboard/AddressCard";
import { AddressForm } from "@/components/dashboard/AddressForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export function DashboardAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = React.useState<Address[]>(user?.addresses ?? []);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Address | undefined>(undefined);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setFormOpen(true);
  }

  async function handleSubmit(values: AddressSchemaValues) {
    const result = editing ? await updateAddress(editing.id, values) : await addAddress(values);
    if (result.success && result.addresses) {
      setAddresses(result.addresses);
      setFormOpen(false);
    }
    return { success: result.success, message: result.message };
  }

  async function handleDelete(id: string) {
    const result = await removeAddress(id);
    if (result.success && result.addresses) setAddresses(result.addresses);
  }

  async function handleSetDefault(id: string) {
    const result = await updateAddress(id, { isDefault: true });
    if (result.success && result.addresses) setAddresses(result.addresses);
  }

  return (
    <div className="flex flex-col gap-5">
      {formOpen ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-base font-bold">
            {editing ? "Edit Address" : "Add Address"}
          </h3>
          <AddressForm initialAddress={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
        </div>
      ) : (
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      )}

      {addresses.length === 0 ? (
        <EmptyState
          icon={<MapPinOff className="h-6 w-6" strokeWidth={1.5} />}
          title="No saved addresses"
          description="Add a delivery address to check out faster next time."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={openEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}
