"use client";

import * as React from "react";
import { HeartOff } from "lucide-react";
import { getFavorites, removeFavorite } from "@/lib/api/favorites";
import type { MenuItem } from "@/types/menu";
import { FavoriteCard } from "@/components/dashboard/FavoriteCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";

export function DashboardFavorites() {
  const [favorites, setFavorites] = React.useState<MenuItem[] | null>(null);

  React.useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(() => setFavorites([]));
  }, []);

  async function handleRemove(id: string) {
    setFavorites((prev) => prev?.filter((f) => f.id !== id) ?? null);
    await removeFavorite(id);
  }

  if (favorites === null) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={<HeartOff className="h-6 w-6" strokeWidth={1.5} />}
        title="No favorites yet"
        description="Tap the heart on any dish to save it here."
        actionLabel="Browse Menu"
        onAction={() => (window.location.href = "/menu")}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {favorites.map((item) => (
        <FavoriteCard key={item.id} item={item} onRemove={handleRemove} />
      ))}
    </div>
  );
}
