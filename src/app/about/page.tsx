import { CheckCircle2 } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { aboutFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/about" });

const outcomes = [
  "Revenue systems shipped quickly with measurable ownership.",
  "Operational automation that reduces manual bottlenecks.",
  "Clear KPI visibility for founders and team leads.",
  "Repeatable delivery process across different industries.",
];

const checklist = [
  "Business model and offer audit",
  "System architecture and implementation plan",
  "Build and integration execution",
  "QA, go-live, and optimisation handover",
];

const proof = [
  { label: "Experience building digital systems", value: "15+ years" },
  { label: "Website sprint launch window", value: "72 hours" },
  { label: "Automation deployment cadence", value: "7-30 days" },
];

const faqs = aboutFaqs();

export default function AboutPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">About</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">We build revenue systems, not marketing fluff</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">Digital Business Assets helps UK SMEs launch premium websites and AI automation stacks that improve lead conversion and operational efficiency.</p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <MotionReveal className="max-w-4xl"><h2 className="text-3xl font-semibold text-white md:text-4xl">What clients hire us for</h2></MotionReveal>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {outcomes.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}><li className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200"><CheckCircle2 className="mb-2 size-4 text-cyan-300" />{item}</li></MotionReveal>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl"><h2 className="text-3xl font-semibold text-white md:text-4xl">What&apos;s included in our engagements</h2></MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {checklist.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}><div className="rounded-xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200">{item}</div></MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-8">
            <h2 className="text-3xl font-semibold text-white">How we operate</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {["Business audit and offer clarity", "72-hour website + conversion layer", "Automation, CRM, and follow-up deployment", "Monthly optimisation and reporting"].map((step, index) => (
                <div key={step} className="rounded-xl border border-slate-800 bg-slate-950/65 p-4"><p className="text-xs text-cyan-300">Step {index + 1}</p><p className="mt-2 text-sm text-slate-300">{step}</p></div>
              ))}
            </div>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-3">
          {proof.map((item, index) => (
            <MotionReveal key={item.label} delay={index * 0.05}><div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5"><p className="text-xs text-slate-400">{item.label}</p><p className="mt-2 text-2xl font-semibold text-cyan-200">{item.value}</p></div></MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="Execution-first agency operating model" audience="UK SMEs that need deployed systems, not generic advice" image="/media/hero-ai.jpg" />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl"><p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p><h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">About our delivery model</h2></MotionReveal>
        <div className="mt-8"><FAQ items={faqs} /></div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Need an operator-focused partner for your growth stack?" description="We will map your current bottlenecks and deploy the first high-impact system quickly." />
      </SectionBlock>
    </>
  );
}
