import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { WebsiteAuditResultsPanel } from "@/components/tools/website-audit-results-panel";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

type WebsiteAuditResultsPageProps = {
  params: Promise<{ scanId: string }>;
};

export async function generateMetadata({ params }: WebsiteAuditResultsPageProps) {
  const { scanId } = await params;
  return buildMetadata({
    path: `/tools/website-audit/results/${scanId}`,
    title: "Website Scan Results",
    description:
      "Review your free website scan results with scores, insights, and fix-now upgrade recommendations tailored for your business. Download your branded PDF report today.",
  });
}

export default async function WebsiteAuditResultsPage({ params }: WebsiteAuditResultsPageProps) {
  const { scanId } = await params;

  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <Button asChild variant="ghost" className="mb-4 pl-0 text-slate-300 hover:bg-transparent hover:text-cyan-200">
            <Link href="/tools/website-audit/start">
              <ArrowLeft className="size-4" />
              Start a new scan
            </Link>
          </Button>
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Scan results</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Website scan dashboard</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
            Live status while we process checks. When complete, you will see scores, top risks, and immediate upgrade
            options with transparent pricing.
          </p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4 pb-20">
        <WebsiteAuditResultsPanel scanId={scanId} />
      </SectionBlock>
    </>
  );
}
