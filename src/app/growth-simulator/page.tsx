import Link from "next/link";
import { LineChart, Sparkles, Target } from "lucide-react";

import { AIGrowthSimulator } from "@/components/marketing/ai-growth-simulator";
import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { VideoSection } from "@/components/marketing/video-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { growthSimulatorFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/growth-simulator" });

const faqs = growthSimulatorFaqs();

type GrowthSimulatorPageProps = {
  searchParams: Promise<{
    industry?: string;
    goal?: string;
    readinessScore?: string;
    topActions?: string;
    visitors?: string;
    conversionRate?: string;
    avgOrderValue?: string;
  }>;
};

function parseTopActions(value?: string) {
  if (!value) {
    return [];
  }
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export default async function GrowthSimulatorPage({ searchParams }: GrowthSimulatorPageProps) {
  const params = await searchParams;
  const readinessScore = Number(params.readinessScore);
  const monthlyVisitors = Number(params.visitors);
  const conversionRate = Number(params.conversionRate);
  const avgOrderValue = Number(params.avgOrderValue);
  const prefill = {
    industry: params.industry,
    goal: params.goal,
    readinessScore: Number.isFinite(readinessScore) ? readinessScore : undefined,
    topActions: parseTopActions(params.topActions),
    monthlyVisitors: Number.isFinite(monthlyVisitors) && monthlyVisitors > 0 ? monthlyVisitors : undefined,
    conversionRate: Number.isFinite(conversionRate) && conversionRate > 0 ? conversionRate : undefined,
    avgOrderValue: Number.isFinite(avgOrderValue) && avgOrderValue > 0 ? avgOrderValue : undefined,
  };

  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Growth Simulator</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Model your revenue upside before you build</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">Use this interactive tool to score your current funnel, identify leaks, and prioritise the fastest improvements.</p>
          <ul className="mt-5 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
            <li className="rounded-xl border border-slate-800 bg-slate-900/45 p-3"><Target className="size-4 text-cyan-300" /><p className="mt-2">Clear score from 0-100</p></li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/45 p-3"><LineChart className="size-4 text-cyan-300" /><p className="mt-2">Before/after booking projections</p></li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/45 p-3"><Sparkles className="size-4 text-cyan-300" /><p className="mt-2">Actionable improvement priorities</p></li>
          </ul>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <AIGrowthSimulator mode="full" prefill={prefill} />
      </SectionBlock>

      <SectionBlock>
        <VideoSection
          title="Simulator walkthrough and implementation handoff"
          description="Watch how to run scenario modelling, interpret uplift ranges, and turn output into a practical 30-day rollout plan."
          videoUrl="https://www.youtube.com/watch?v=jNQXAC9IVRw"
          points={["Input realistic baseline metrics", "Compare conservative and aggressive scenarios", "Send simulation output to booking workflow"]}
        />
      </SectionBlock>

      <SectionBlock className="pb-20">
        <MotionReveal>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
            <h2 className="text-2xl font-semibold text-white">Need help validating the numbers?</h2>
            <p className="mt-3 text-sm text-slate-300">We can review your assumptions, benchmark by industry, and map a realistic 30-day rollout.</p>
            <Button asChild variant="outline" className="mt-5 border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800"><Link href="/book">Book a Strategy Call</Link></Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="Growth simulation methodology" audience="UK SME leaders evaluating implementation ROI" image="/media/hero-dashboard.jpg" />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl"><p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p><h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Simulator questions</h2></MotionReveal>
        <div className="mt-8"><FAQ items={faqs} /></div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Want us to turn this model into a real implementation plan?" description="Share your data points and we will build your 30-day action plan with clear owners and timelines." />
      </SectionBlock>
    </>
  );
}
