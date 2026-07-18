"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { MAIN_NAV, SITE_CONFIG } from "@/config/site";
import { Button } from "@/components/ui/button";
import { backdropFade, menuPanel } from "@/lib/animations/variants";
import { cn } from "@/lib/utils/cn";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  // Lock body scroll while the panel is open
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
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
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-[100] flex w-[85%] max-w-sm flex-col bg-background shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="font-display text-lg font-bold">
                MR_SK <span className="text-brand-primary">EATRIES</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {MAIN_NAV.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(expanded === item.label ? null : item.label)
                          }
                          className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-semibold"
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expanded === item.label && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden pl-3"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
                                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block rounded-lg px-3 py-3 text-base font-semibold"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border px-6 py-5">
              <Button asChild variant="accent" className="w-full">
                <Link href="/order" onClick={onClose}>
                  Order Online
                </Link>
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {SITE_CONFIG.contact.phone}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
