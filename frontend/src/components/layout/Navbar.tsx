"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, Heart, Menu as MenuIcon, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MAIN_NAV } from "@/config/site";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { gsap } from "@/lib/animations/gsap";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MiniCartBadge } from "@/components/cart/MiniCartBadge";
import { UserDropdown } from "@/components/auth/UserDropdown";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const { itemCount, openDrawer } = useCart();
  const { isAuthenticated, isLoadingSession } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const headerRef = React.useRef<HTMLElement | null>(null);
  const lastScrollY = React.useRef(0);
  const hiddenRef = React.useRef(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);

    // Direction-aware hide/reveal: hide once scrolled well past the
    // header's own height (so it never disappears while still over the
    // hero) and only once the user has scrolled a meaningful amount in one
    // direction, not on every 1px jitter. Framer's `useScroll` already
    // gives a de-duped, rAF-throttled scroll value — reused here rather
    // than standing up a second (GSAP ScrollTrigger) scroll listener next
    // to it; GSAP still does the actual tween/easing below.
    const delta = latest - lastScrollY.current;
    const header = headerRef.current;
    if (header && !prefersReducedMotion) {
      const shouldHide = latest > 160 && delta > 4;
      const shouldReveal = delta < -4 || latest <= 160;

      if (shouldHide && !hiddenRef.current) {
        hiddenRef.current = true;
        gsap.to(header, { yPercent: -100, duration: 0.35, ease: "power2.inOut" });
      } else if (shouldReveal && hiddenRef.current) {
        hiddenRef.current = false;
        gsap.to(header, { yPercent: 0, duration: 0.35, ease: "power2.inOut" });
      }
    }
    lastScrollY.current = latest;
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
        ref={headerRef}
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
          <Link href="/" className="group flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-xl font-bold tracking-tight transition-colors sm:text-2xl",
                transparentAtTop ? "text-white" : "text-foreground"
              )}
            >
              MR_SK{" "}
              <span
                className={
                  transparentAtTop ? "text-brand-accent" : "text-brand-primary dark:text-brand-accent"
                }
              >
                EATRIES
              </span>
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
              href="/account/favorites"
              aria-label="Favorites"
              className={cn(
                "hidden h-9 w-9 items-center justify-center rounded-full transition-colors sm:flex",
                transparentAtTop
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <Heart className="h-[18px] w-[18px]" />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                transparentAtTop
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <MiniCartBadge />
            </button>

            {isLoadingSession ? (
              <div className="hidden h-9 w-9 sm:block" aria-hidden="true" />
            ) : isAuthenticated ? (
              <UserDropdown />
            ) : (
              <div className="hidden items-center gap-1 sm:flex">
                <Link
                  href="/auth/login"
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    transparentAtTop
                      ? "text-white/90 hover:text-white"
                      : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    transparentAtTop
                      ? "text-white/90 hover:text-white"
                      : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  Register
                </Link>
              </div>
            )}

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
