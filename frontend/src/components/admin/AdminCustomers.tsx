"use client";

import * as React from "react";
import Link from "next/link";
import { UserX } from "lucide-react";
import { listCustomers, setCustomerActive } from "@/lib/api/adminUsers";
import type { AdminCustomer } from "@/types/admin";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils/auth";

export function AdminCustomers() {
  const [customers, setCustomers] = React.useState<AdminCustomer[] | null>(null);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const load = React.useCallback(() => {
    listCustomers({ role: "customer", search: debouncedSearch || undefined })
      .then((res) => setCustomers(res.customers))
      .catch(() => setCustomers([]));
  }, [debouncedSearch]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleToggleActive(customer: AdminCustomer) {
    await setCustomerActive(customer.id, !customer.isActive);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <AdminSearchBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name or email…" />

      {customers === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<UserX className="h-6 w-6" strokeWidth={1.5} />}
          title="No customers found"
          description="Try a different search."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between gap-3 p-4">
              <Link href={`/admin/users/${customer.id}`} className="flex min-w-0 items-center gap-3">
                <InitialsAvatar initials={getInitials(customer.fullName)} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium hover:text-brand-primary dark:hover:text-brand-accent">
                    {customer.fullName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                </div>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={customer.isActive ? "success" : "spicy"}>
                  {customer.isActive ? "Active" : "Suspended"}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => handleToggleActive(customer)}>
                  {customer.isActive ? "Suspend" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
