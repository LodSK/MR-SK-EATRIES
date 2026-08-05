"use client";

import * as React from "react";
import { Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { adminListMenuItems, updateMenuItem, deleteMenuItem } from "@/lib/api/adminMenu";
import type { MenuItem } from "@/types/menu";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { PriceTag } from "@/components/menu/PriceTag";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function AdminMenu() {
  const [items, setItems] = React.useState<MenuItem[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [formState, setFormState] = React.useState<"closed" | "create" | MenuItem>("closed");
  const debouncedSearch = useDebouncedValue(search, 300);

  const load = React.useCallback(() => {
    adminListMenuItems({ search: debouncedSearch || undefined, limit: 100 })
      .then((res) => setItems(res.items))
      .catch(() => setItems([]));
  }, [debouncedSearch]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleQuickToggle(item: MenuItem, field: "isAvailable" | "isFeatured") {
    await updateMenuItem(item.id, { [field]: !item[field] });
    load();
  }

  async function handleDelete(id: string) {
    await deleteMenuItem(id);
    load();
  }

  function handleFormDone() {
    setFormState("closed");
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      {formState !== "closed" ? (
        <MenuItemForm
          initialItem={formState === "create" ? undefined : formState}
          onDone={handleFormDone}
          onCancel={() => setFormState("closed")}
        />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearchBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search menu items…" />
          <Button onClick={() => setFormState("create")} className="shrink-0">
            <Plus className="h-4 w-4" />
            Add Meal
          </Button>
        </div>
      )}

      {items === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed className="h-6 w-6" strokeWidth={1.5} />}
          title="No menu items found"
          description="Try a different search, or add a new meal."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    {item.name}
                    {!item.isAvailable && <Badge variant="spicy">Unavailable</Badge>}
                    {item.isFeatured && <Badge variant="primary">Featured</Badge>}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">{item.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PriceTag price={item.price} currency={item.currency} size="sm" />
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Checkbox checked={item.isAvailable} onCheckedChange={() => handleQuickToggle(item, "isAvailable")} />
                  Available
                </label>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Checkbox checked={item.isFeatured} onCheckedChange={() => handleQuickToggle(item, "isFeatured")} />
                  Featured
                </label>
                <Button variant="outline" size="sm" onClick={() => setFormState(item)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
