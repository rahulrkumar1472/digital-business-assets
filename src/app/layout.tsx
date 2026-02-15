import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Suspense } from "react";

import { MobileOverflowHelper } from "@/components/dev/mobile-overflow-helper";
import { MobileStickyFooter } from "@/components/layout/mobile-sticky-footer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ChatWidget } from "@/components/chat/chat-widget";
import { LeadPopup } from "@/components/leads/lead-popup";
import { FunnelProvider } from "@/components/funnel/funnel-provider";
import { PremiumBackground } from "@/components/marketing/premium-background";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { JsonLd } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...buildMetadata({ path: "/" }),
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className="dark" suppressHydrationWarning style={{ colorScheme: "dark" }}>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#05060a" />
      </head>
      <body className={`${bodyFont.variable} ${headingFont.variable} bg-[#05060a] text-[#e7e7ea] antialiased`}>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <FunnelProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <PremiumBackground />
            <SiteHeader />
            <BreadcrumbSchema />
            <Breadcrumbs />
            <main className="pb-[calc(5.4rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</main>
            <SiteFooter />
            <MobileStickyFooter />
            <Suspense fallback={null}>
              <LeadPopup />
            </Suspense>
            <ChatWidget />
            <MobileOverflowHelper />
          </div>
        </FunnelProvider>
      </body>
    </html>
  );
}
