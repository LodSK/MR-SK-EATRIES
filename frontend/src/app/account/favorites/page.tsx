import type { Metadata } from "next";
import { DashboardFavorites } from "@/components/dashboard/DashboardFavorites";

export const metadata: Metadata = {
  title: "Favorites",
};

export default function FavoritesPage() {
  return <DashboardFavorites />;
}
