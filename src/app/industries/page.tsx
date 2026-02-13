import { CheckCircle2 } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { HowItWorksStepper } from "@/components/marketing/how-it-works-stepper";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { industries } from "@/data";
import { industriesFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/industries" });

const outcomes = [
  "Reduced response times across inbound channels.",
  "Higher booking conversion with structured follow-up.",
  "Lower no-shows through reminders and automation.",
  "Funnel-level reporting that shows where revenue leaks.",
];

const checklist = [
  "Industry messaging and offer framing",
  "Conversion page templates and lead capture",
  "CRM stage architecture for your sales cycle",
  "Automation logic for reminders and follow-up",
  "Proof dashboard setup",
];

const proof = [
  { label: "Average booking uplift", value: "+18-45%" },
  { label: "Typical response speed gain", value: "35-70%" },
  { label: "Recovered missed leads", value: "40-88%" },
];

const faqs = industriesFaqs();

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Industry solutions</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Built around how your sector buys and books</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
            We deploy the same proven framework, then adapt automations, scripts, and conversion flows to your sector&apos;s sales cycle.
          </p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <MotionReveal className="max-w-4xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Expected outcomes</h2>
        </MotionReveal>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {outcomes.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200">
                <CheckCircle2 className="mb-2 size-4 text-cyan-300" />
                {item}
              </li>
            </MotionReveal>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">What&apos;s included checklist</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {checklist.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.04}>
              <div className="rounded-xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200">{item}</div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">How it works</h2>
        </MotionReveal>
        <div className="mt-6">
          <HowItWorksStepper />
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-3">
          {proof.map((item, index) => (
            <MotionReveal key={item.label} delay={index * 0.05}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">{item.value}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <KPICharts />
      </SectionBlock>

      <SectionBlock>
        <IndustryGrid industries={industries} />
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="Industry-Specific Revenue System" audience="UK business owners in service-led sectors" image="/media/industries.jpg" />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Industry rollout questions</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Need an industry-specific growth blueprint?" description="Tell us your current bottlenecks and we will map the system stack that gets results fastest in your market." />
      </SectionBlock>
    </>
  );
}
