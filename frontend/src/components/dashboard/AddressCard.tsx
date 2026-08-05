"use client";

import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import type { Address } from "@/types/address";
import { Button } from "@/components/ui/button";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
          <span className="text-sm font-semibold">{address.label}</span>
        </div>
        {address.isDefault && (
          <span className="flex items-center gap-1 rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-brand-accent">
            <Star className="h-3 w-3 fill-current" />
            Default
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {address.street}, {address.city}
      </p>
      {address.notes && <p className="text-xs text-muted-foreground">{address.notes}</p>}

      <div className="mt-1 flex items-center gap-2 border-t border-border pt-3">
        {!address.isDefault && (
          <Button variant="outline" size="sm" onClick={() => onSetDefault(address.id)}>
            Set Default
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(address.id)} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
