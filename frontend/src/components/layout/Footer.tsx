"use client";

import * as React from "react";
import Link from "next/link";
import { Facebook, Instagram, MapPin, Mail, Phone, Send, Twitter } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG, SOCIAL_LINKS } from "@/config/site";
import { Button } from "@/components/ui/button";

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  // TikTok/YouTube icons wired in when brand assets/routes for those land
  tiktok: Instagram,
  youtube: Instagram,
} as const;

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    // Wired to POST /api/v1/newsletter in the backend sprint — placeholder for now.
    window.setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  }

  return (
    <footer className="border-t border-white/10 bg-brand-secondary text-brand-cream">
      <div className="section-container grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <span className="font-display text-2xl font-bold">
            MR_SK <span className="text-brand-accent">EATRIES</span>
          </span>
          <p className="mt-1 font-accent text-sm italic text-brand-accent/80">
            {SITE_CONFIG.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            {SITE_CONFIG.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              {column.title}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {column.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/75 transition-colors hover:text-brand-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact + Newsletter */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Visit Us
          </h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              {SITE_CONFIG.contact.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-accent" />
              <a href={`tel:${SITE_CONFIG.contact.phone}`} className="hover:text-brand-accent">
                {SITE_CONFIG.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-accent" />
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="hover:text-brand-accent"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </li>
          </ul>

          <form onSubmit={handleSubscribe} className="mt-6">
            <label htmlFor="footer-newsletter" className="text-sm font-semibold text-white/50">
              Get news &amp; offers
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="footer-newsletter"
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-white/40 focus-visible:border-brand-accent"
              />
              <Button
                type="submit"
                size="icon"
                variant="accent"
                disabled={status === "submitting"}
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {status === "success" && (
              <p className="mt-2 text-xs text-brand-accent">
                You&apos;re on the list — welcome!
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-container flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} MR_SK EATRIES. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-brand-accent">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-accent">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
