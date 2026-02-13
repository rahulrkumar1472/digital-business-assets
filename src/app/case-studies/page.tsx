import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { caseStudies } from "@/data";
import { caseStudiesFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/case-studies" });

const outcomes = [
  "Faster response times to inbound enquiries",
  "Improved booking conversion from lead capture",
  "Recovered demand from missed calls and slow follow-up",
  "Higher confidence through clear KPI visibility",
];

const checklist = [
  "Challenge and baseline metric",
  "System stack implemented",
  "Timeline from launch to optimisation",
  "Measured business outcomes",
];

const proof = [
  { label: "Typical booking uplift", value: "+20-47%" },
  { label: "Average response time reduction", value: "35-68%" },
  { label: "Recovered pipeline value", value: "£8k-£24k/mo" },
];

const faqs = caseStudiesFaqs();

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Case studies</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Proof of systems, process, and measurable outcomes</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">Real builds for UK businesses. Problem to system to result, with concrete metrics.</p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <MotionReveal className="max-w-4xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Outcomes clients feel first</h2>
        </MotionReveal>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {outcomes.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200"><CheckCircle2 className="mb-2 size-4 text-cyan-300" />{item}</li>
            </MotionReveal>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl"><h2 className="text-3xl font-semibold text-white md:text-4xl">What every case study includes</h2></MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {checklist.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}>
              <div className="rounded-xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200">{item}</div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl"><h2 className="text-3xl font-semibold text-white md:text-4xl">How we run implementations</h2></MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {["Baseline audit and leak map", "Build and integration sprint", "Automation and follow-up deployment", "30-day optimisation cycle"].map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}>
              <div className="h-full rounded-xl border border-slate-800 bg-slate-900/45 p-4"><p className="text-xs text-cyan-300">Step {index + 1}</p><p className="mt-2 text-sm text-slate-300">{item}</p></div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-3">
          {proof.map((item, index) => (
            <MotionReveal key={item.label} delay={index * 0.05}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5"><p className="text-xs text-slate-400">{item.label}</p><p className="mt-2 text-2xl font-semibold text-cyan-200">{item.value}</p></div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <KPICharts />
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-5 md:grid-cols-2">
          {caseStudies.map((caseStudy, index) => (
            <MotionReveal key={caseStudy.slug} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
                <p className="text-xs font-semibold tracking-[0.08em] text-cyan-300 uppercase">{caseStudy.clientSector}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{caseStudy.title}</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p><span className="font-semibold text-slate-100">Problem:</span> {caseStudy.challenge}</p>
                  <p><span className="font-semibold text-slate-100">System built:</span> {caseStudy.approach[0]}</p>
                  <p><span className="font-semibold text-slate-100">Result:</span> {caseStudy.outcomes[0]?.label} {caseStudy.outcomes[0]?.value}</p>
                </div>
                <Link href={`/case-studies/${caseStudy.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">View full case study <ArrowUpRight className="size-4" /></Link>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="Case Study Execution Framework" audience="UK SME owners evaluating implementation partners" image="/media/case-1.jpg" />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Case study questions</h2>
        </MotionReveal>
        <div className="mt-8"><FAQ items={faqs} /></div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Want us to build the same system for your business?" description="We will map your bottlenecks, implementation timeline, and expected upside before you commit." />
      </SectionBlock>
    </>
  );
}
