import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { pricingFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/pricing" });

const outcomes = [
  "Fast launch with done-for-you implementation",
  "Clear monthly operating cost from day one",
  "Scalable stack as lead volume grows",
  "Measured ROI through dashboard reporting",
];

const comparisonRows = [
  ["Website conversion layer", "Included", "Included", "Included"],
  ["CRM + booking setup", "Optional add-on", "Included", "Included"],
  ["AI assistant / chatbot", "Optional add-on", "Optional add-on", "Included"],
  ["Missed-call recovery", "Optional add-on", "Optional add-on", "Included"],
  ["Weekly optimisation", "Basic", "Standard", "Advanced"],
  ["Reporting dashboard", "Basic", "Pipeline dashboard", "Revenue intelligence"],
];

const proof = [
  { label: "Plan starts", value: "£99/mo" },
  { label: "Average launch window", value: "72 hours" },
  { label: "Typical KPI review cadence", value: "Weekly" },
];

const faqs = pricingFaqs();

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Pricing</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">SaaS-style plans. Done-for-you execution.</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">Start lean, prove results, then scale automation and AI features as your pipeline grows.</p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <MotionReveal className="max-w-4xl"><h2 className="text-3xl font-semibold text-white md:text-4xl">Outcomes you pay for</h2></MotionReveal>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {outcomes.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200"><CheckCircle2 className="mb-2 size-4 text-cyan-300" />{item}</li>
            </MotionReveal>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock>
        <PricingCards />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45">
            <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/55 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-300 md:px-6">
              <span className="col-span-1">Feature</span><span>Starter</span><span>Growth</span><span>Scale</span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row[0]} className="grid grid-cols-4 border-b border-slate-800 px-4 py-3 text-sm text-slate-300 last:border-b-0 md:px-6">
                <span className="col-span-1 text-slate-200">{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span>
              </div>
            ))}
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl"><h2 className="text-3xl font-semibold text-white md:text-4xl">How plan onboarding works</h2></MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {["Choose the tier based on current bottleneck", "Share access and operating details", "We deploy first sprint within agreed window", "Track KPI changes and optimise weekly"].map((step, index) => (
            <MotionReveal key={step} delay={index * 0.05}><div className="h-full rounded-xl border border-slate-800 bg-slate-900/45 p-4"><p className="text-xs text-cyan-300">Step {index + 1}</p><p className="mt-2 text-sm text-slate-300">{step}</p></div></MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-3">
          {proof.map((item, index) => (
            <MotionReveal key={item.label} delay={index * 0.05}><div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5"><p className="text-xs text-slate-400">{item.label}</p><p className="mt-2 text-2xl font-semibold text-cyan-200">{item.value}</p></div></MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal>
          <div className="rounded-2xl border border-cyan-500/30 bg-[linear-gradient(155deg,rgba(56,189,248,0.14),rgba(15,23,42,0.92))] p-7">
            <h2 className="text-3xl font-semibold text-white">Need a fast recommendation?</h2>
            <p className="mt-3 text-sm text-slate-200">Share lead volume, team size, and current follow-up process. We will recommend the right tier with no guesswork.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <PrimaryCTA label="Get a Growth Plan" />
              <Button asChild variant="outline" size="lg" className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800"><Link href="/book">Book a Call</Link></Button>
            </div>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="Pricing and value-stack planning" audience="UK SME founders balancing speed and ROI" image="/media/services-automation.jpg" />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl"><p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQs</p><h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Pricing questions</h2></MotionReveal>
        <div className="mt-8"><FAQ items={faqs} /></div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Want the right tier mapped to your growth targets?" description="We will recommend the best plan based on your lead flow, process maturity, and commercial goals." />
      </SectionBlock>
    </>
  );
}
