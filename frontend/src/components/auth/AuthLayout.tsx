import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100svh-72px)] grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-secondary p-10 lg:flex">
        <div className="bg-noise absolute inset-0 opacity-[0.05]" aria-hidden="true" />
        <div
          className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-primary/25 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-brand-accent/15 blur-[110px]"
          aria-hidden="true"
        />

        <Link href="/" className="relative font-display text-xl font-bold text-white">
          MR_SK <span className="text-brand-accent">EATRIES</span>
        </Link>

        <div className="relative flex flex-col gap-3">
          <p className="font-accent text-2xl italic text-brand-accent/90">{SITE_CONFIG.tagline}</p>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Sign in to track orders, save reservations, and check out faster next time.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
