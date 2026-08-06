import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { fontVariables } from "@/config/fonts";
import { SITE_CONFIG } from "@/config/site";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidgetLoader } from "@/components/ai/ChatWidgetLoader";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { PageTransition } from "@/components/shared/PageTransition";
import { RestaurantSchema } from "@/components/shared/RestaurantSchema";
import { AnalyticsScripts } from "@/components/shared/AnalyticsScripts";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8ED" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} font-body`}>
        <AnalyticsScripts />
        <RestaurantSchema />
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <SmoothScrollProvider>
                <Navbar />
                <main id="main-content">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
                <Toaster richColors position="top-center" theme="system" />
                <ChatWidgetLoader />
              </SmoothScrollProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
