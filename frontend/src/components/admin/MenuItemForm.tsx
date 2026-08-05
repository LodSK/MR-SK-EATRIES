"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { MenuItem, FoodCategory } from "@/types/menu";
import type { MenuItemPayload } from "@/lib/api/adminMenu";
import { createMenuItem, updateMenuItem } from "@/lib/api/adminMenu";
import { getMenuCategories } from "@/lib/api/menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";

interface MenuItemFormProps {
  initialItem?: MenuItem;
  onDone: () => void;
  onCancel: () => void;
}

export function MenuItemForm({ initialItem, onDone, onCancel }: MenuItemFormProps) {
  const [categories, setCategories] = React.useState<FoodCategory[]>([]);
  const [values, setValues] = React.useState<MenuItemPayload>({
    name: initialItem?.name ?? "",
    description: initialItem?.description ?? "",
    category: initialItem?.category ?? "dinner",
    price: initialItem?.price ?? 0,
    isVegetarian: initialItem?.isVegetarian ?? false,
    isSpicy: initialItem?.isSpicy ?? false,
    isAvailable: initialItem?.isAvailable ?? true,
    isFeatured: initialItem?.isFeatured ?? false,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getMenuCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function set<K extends keyof MenuItemPayload>(key: K, value: MenuItemPayload[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = initialItem ? await updateMenuItem(initialItem.id, values) : await createMenuItem(values);
    setIsSubmitting(false);
    if (result.success) {
      onDone();
    } else {
      setError(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      {error && <FormMessage type="error">{error}</FormMessage>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Name</label>
          <input
            type="text"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Price (GHS)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            required
            value={values.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Description</label>
        <textarea
          rows={2}
          required
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-brand-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Category</label>
          <Select value={values.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Stock Quantity</label>
          <input
            type="number"
            min={0}
            value={values.stockQuantity ?? ""}
            onChange={(e) => set("stockQuantity", e.target.value ? Number(e.target.value) : undefined)}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={values.isVegetarian} onCheckedChange={(v) => set("isVegetarian", v === true)} />
          Vegetarian
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={values.isSpicy} onCheckedChange={(v) => set("isSpicy", v === true)} />
          Spicy
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={values.isAvailable} onCheckedChange={(v) => set("isAvailable", v === true)} />
          Available
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={values.isFeatured} onCheckedChange={(v) => set("isFeatured", v === true)} />
          Featured
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : initialItem ? "Save Changes" : "Create Item"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
