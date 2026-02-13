import { CalendarClock, ClipboardCheck, Rocket } from "lucide-react";

import { BookingForm } from "@/components/booking/booking-form";
import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { bookFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/book" });

const steps = [
  { icon: ClipboardCheck, title: "We review your current funnel", detail: "Website, lead sources, response speed, and follow-up process." },
  { icon: CalendarClock, title: "You get a practical implementation plan", detail: "Scope, timeline, and expected upside based on your numbers." },
  { icon: Rocket, title: "We launch your first growth sprint", detail: "72-hour website or automation-first rollout based on highest ROI." },
];

const outcomes = [
  "Clear priority list for the next 30 days",
  "System recommendation tied to your bottleneck",
  "Implementation sequence with measurable checkpoints",
];

const proof = [
  { label: "Typical strategy call length", value: "30 minutes" },
  { label: "Initial rollout window", value: "3-7 days" },
  { label: "Website launch sprint", value: "72 hours" },
];

type BookPageProps = {
  searchParams: Promise<{
    industry?: string;
    score?: string;
    revenue?: string;
    leads?: string;
  }>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;
  const faqs = bookFaqs();

  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Book a call</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Book your strategy session with built-in availability</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">Choose a 30-minute slot, share your business context, and get a practical implementation roadmap.</p>
          {params.industry || params.revenue || params.leads || params.score ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {params.industry ? <span className="rounded-full border border-cyan-500/35 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Industry: {params.industry}</span> : null}
              {params.score ? <span className="rounded-full border border-cyan-500/35 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Score: {params.score}</span> : null}
              {params.revenue ? <span className="rounded-full border border-slate-700 bg-slate-900/55 px-3 py-1 text-xs text-slate-200">Revenue: £{params.revenue}</span> : null}
              {params.leads ? <span className="rounded-full border border-slate-700 bg-slate-900/55 px-3 py-1 text-xs text-slate-200">Leads: {params.leads}/mo</span> : null}
            </div>
          ) : null}
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <MotionReveal>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-white"><step.icon className="size-4 text-cyan-300" />Step {index + 1}: {step.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
                </div>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.05}>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">Select a slot and confirm details</h2>
              <p className="mt-2 text-sm text-slate-300">Availability is live: Mon-Sun, 09:00-19:00, 30-minute slots.</p>
              <div className="mt-6">
                <BookingForm prefill={{ industry: params.industry, revenue: params.revenue, leads: params.leads, score: params.score }} />
              </div>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-2">
          <MotionReveal>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <h2 className="text-2xl font-semibold text-white">Outcomes from the strategy call</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">{outcomes.map((item) => <li key={item} className="list-disc pl-1 marker:text-cyan-300">{item}</li>)}</ul>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.05}>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <h2 className="text-2xl font-semibold text-white">What&apos;s included</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="list-disc pl-1 marker:text-cyan-300">Funnel leak diagnosis</li>
                <li className="list-disc pl-1 marker:text-cyan-300">Recommended service stack</li>
                <li className="list-disc pl-1 marker:text-cyan-300">Timeline and sprint plan</li>
                <li className="list-disc pl-1 marker:text-cyan-300">Clear next-step decision</li>
              </ul>
            </div>
          </MotionReveal>
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
        <DeepSeoContent topic="Strategy call preparation and booking workflow" audience="UK SME owners preparing for system rollout" image="/media/hero-dashboard.jpg" />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl"><p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p><h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Booking questions</h2></MotionReveal>
        <div className="mt-8"><FAQ items={faqs} /></div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Need help before choosing a slot?" description="Share your scenario and we will help you prepare the right inputs before your strategy call." />
      </SectionBlock>
    </>
  );
}
