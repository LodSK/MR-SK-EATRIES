"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

interface EmptyCartProps {
  onContinueShopping?: () => void;
}

export function EmptyCart({ onContinueShopping }: EmptyCartProps) {
  const router = useRouter();

  return (
    <EmptyState
      icon={<ShoppingBag className="h-6 w-6" strokeWidth={1.5} />}
      title="Your cart is empty"
      description="Looks like you haven't added anything yet — browse the menu to find something good."
      actionLabel="Browse Menu"
      onAction={() => {
        onContinueShopping?.();
        router.push("/menu");
      }}
    />
  );
}
