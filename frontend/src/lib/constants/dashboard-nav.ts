import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  User,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/account/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "My Reservations", href: "/account/reservations", icon: CalendarDays },
  { label: "Favorites", href: "/account/favorites", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Payment Methods", href: "/account/payment-methods", icon: CreditCard },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Security", href: "/account/security", icon: ShieldCheck },
  { label: "Settings", href: "/account/settings", icon: Settings },
];
