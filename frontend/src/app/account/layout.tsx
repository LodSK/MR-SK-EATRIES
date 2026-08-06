"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { backdropFade, menuPanel, fadeUp } from "@/lib/animations/variants";

function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="section-container flex gap-8 py-8 lg:py-12">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-4">
          <DashboardSidebar />
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              variants={backdropFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              variants={menuPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard navigation"
              className="fixed inset-y-0 right-0 z-[100] flex w-[85%] max-w-xs flex-col bg-background p-4 shadow-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="mb-4 ml-auto flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <div className="mb-6 -mt-4 rounded-2xl border border-border bg-card">
          <DashboardHeader onOpenSidebar={() => setMobileOpen(true)} />
        </div>
        {/* Tier 3 per the Sprint 17 plan: light, consistent entrance only —
            keyed on pathname so it re-fires switching between dashboard
            pages, not just on first entry to /account/*. Deliberately just
            `fadeUp`, not a second animation system layered on top of it. */}
        <motion.div key={pathname} variants={fadeUp} initial="hidden" animate="visible">
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute staffRedirectTo="/admin/dashboard">
      <AccountShell>{children}</AccountShell>
    </ProtectedRoute>
  );
}
