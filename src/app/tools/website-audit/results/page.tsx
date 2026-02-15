import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { WebsiteGrowthReport } from "@/components/tools/website-growth-report";
import { GlowGrid } from "@/components/visuals/glow-grid";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { softwareApplicationSchema } from "@/lib/schema";
import { parseCompetitorList, runWebsiteGrowthAudit } from "@/lib/scans/audit-engine";

type WebsiteAuditResultsQueryPageProps = {
  searchParams: Promise<{
    url?: string;
    industry?: string;
    goal?: string;
    competitors?: string;
    businessName?: string;
  }>;
};

const metadataTitle = "Website Growth Audit Results — Digital Marketing Assets";
const metadataDescription =
  "Review your Website Growth Audit score, revenue leaks, and prioritized fixes, then choose guided DIY improvements or a done-for-you growth implementation path.";
const canonical = absoluteUrl("/tools/website-audit/results");

export const metadata: Metadata = {
  title: metadataTitle,
  description: metadataDescription,
  alternates: { canonical },
  openGraph: {
    title: metadataTitle,
    description: metadataDescription,
    url: canonical,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_GB",
    images: [{ url: absoluteUrl("/media/dashboard-2.jpg"), width: 1200, height: 630, alt: metadataTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: metadataTitle,
    description: metadataDescription,
    images: [absoluteUrl("/media/dashboard-2.jpg")],
  },
};

export default async function WebsiteAuditResultsQueryPage({ searchParams }: WebsiteAuditResultsQueryPageProps) {
  const params = await searchParams;
  const websiteUrl = params.url?.trim() || "https://example.co.uk";
  const industry = params.industry?.trim() || "service";
  const goal = params.goal?.trim() || "leads";
  const businessName = params.businessName?.trim() || undefined;
  const competitors = parseCompetitorList(params.competitors);
  const audit = await runWebsiteGrowthAudit({
    url: websiteUrl,
    industry,
    goal,
    competitors,
    businessName,
  });

  return (
    <>
      <JsonLd
        data={softwareApplicationSchema({
          name: "Website Growth Audit",
          description: "A free website growth audit for UK businesses with scores, revenue leak diagnostics, and prioritized implementation actions.",
          path: "/tools/website-audit/results",
          isFree: true,
        })}
      />

      <SectionBlock className="pt-18 md:pt-24">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
          <GlowGrid className="opacity-70" />
          <MotionReveal className="relative z-10 max-w-4xl">
            <Button asChild variant="ghost" className="mb-4 pl-0 text-slate-300 hover:bg-transparent hover:text-cyan-200">
              <Link href="/tools/website-audit/start">
                <ArrowLeft className="size-4" />
                Back to scan start
              </Link>
            </Button>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Track 2 · Website Growth Audit</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Your revenue growth audit is ready</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
              You now have a prioritized action plan showing where bookings leak, what to fix first, and which modules will lift revenue fastest.
            </p>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2">
        <MotionReveal>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4">
            <div className="grid gap-2 text-xs md:grid-cols-4">
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">
                <BadgeCheck className="size-4 text-cyan-300" />
                Built for UK business owners
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">
                <BarChart3 className="size-4 text-cyan-300" />
                Designed to increase bookings
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">
                <ShieldCheck className="size-4 text-cyan-300" />
                No spam - report optional email
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">
                <Sparkles className="size-4 text-cyan-300" />
                Implementation available (Track 1)
              </div>
            </div>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4 pb-20">
        <WebsiteGrowthReport audit={audit} />
      </SectionBlock>
    </>
  );
}
