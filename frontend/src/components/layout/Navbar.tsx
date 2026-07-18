"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, Heart, Menu as MenuIcon, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MAIN_NAV } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Close mobile menu automatically on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Homepage hero is dark/full-bleed, so the navbar starts transparent there.
  const isHome = pathname === "/";
  const transparentAtTop = isHome && !scrolled;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "glass shadow-glass" : "bg-transparent",
          transparentAtTop ? "py-5" : "py-3"
        )}
      >
        <nav
          aria-label="Main navigation"
          className="section-container flex items-center justify-between"
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex flex-col leading-none"
            aria-label="MR_SK EATRIES — Home"
          >
            <span
              className={cn(
                "font-display text-xl font-bold tracking-tight transition-colors sm:text-2xl",
                transparentAtTop ? "text-white" : "text-foreground"
              )}
            >
              MR_SK <span className="text-brand-accent">EATRIES</span>
            </span>
            <span
              className={cn(
                "font-accent text-[11px] italic tracking-wide transition-colors sm:text-xs",
                transparentAtTop ? "text-white/70" : "text-muted-foreground"
              )}
            >
              Taste Beyond Expectations
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {MAIN_NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => item.children && setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      transparentAtTop
                        ? "text-white/90 hover:text-white"
                        : "text-foreground/80 hover:text-foreground",
                      isActive && (transparentAtTop ? "text-white" : "text-brand-primary")
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                    )}
                  </Link>

                  {item.children && (
                    <div
                      className={cn(
                        "absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition-all duration-200",
                        openDropdown === item.label
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-2 opacity-0"
                      )}
                    >
                      <div className="glass-light overflow-hidden rounded-xl border border-black/5 bg-card p-2 shadow-glass dark:border-white/10">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-4 py-2.5 transition-colors hover:bg-brand-primary/8"
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block text-xs text-muted-foreground">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right-side actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle
              className={transparentAtTop ? "text-white hover:bg-white/10" : undefined}
            />

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={cn(
                "hidden h-9 w-9 items-center justify-center rounded-full transition-colors sm:flex",
                transparentAtTop
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <Heart className="h-[18px] w-[18px]" />
            </Link>

            <Link
              href="/cart"
              aria-label="Cart, 0 items"
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                transparentAtTop
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {/* Cart item count — wired to the Zustand cart store in Sprint 7 */}
            </Link>

            <Link
              href="/auth/login"
              aria-label="Account"
              className={cn(
                "hidden h-9 w-9 items-center justify-center rounded-full transition-colors sm:flex",
                transparentAtTop
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <User className="h-[18px] w-[18px]" />
            </Link>

            <Button asChild size="sm" variant="accent" className="ml-1 hidden md:inline-flex">
              <Link href="/order">Order Online</Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:hidden",
                transparentAtTop
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Spacer so fixed navbar doesn't overlap content on non-hero pages */}
      {!isHome && <div className="h-[72px] sm:h-[76px]" aria-hidden="true" />}

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
