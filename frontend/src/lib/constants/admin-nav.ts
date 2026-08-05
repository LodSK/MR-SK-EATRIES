import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  Users,
  UtensilsCrossed,
  Ticket,
  BarChart3,
  Sparkles,
  Bell,
  Settings,
  Newspaper,
  MessageSquare,
  Mail,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarDays },
  { label: "Customers", href: "/admin/users", icon: Users },
  { label: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "AI Insights", href: "/admin/ai", icon: Sparkles },
  { label: "Blog", href: "/admin/blogs", icon: Newspaper },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Contact Messages", href: "/admin/contact-messages", icon: Mail },
  { label: "Job Applications", href: "/admin/job-applications", icon: Briefcase },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
