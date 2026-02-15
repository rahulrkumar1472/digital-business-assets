import Link from "next/link";

import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { AuditTrustStrip } from "@/components/tools/audit-trust-strip";
import { AuditUrlLaunchForm } from "@/components/tools/audit-url-launch-form";
import { GlowGrid } from "@/components/visuals/glow-grid";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, softwareApplicationSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/website-growth-audit-free" });

const whatYouGet = [
  "A Growth Score across speed, SEO, conversion, and trust.",
  "Top 3 revenue leaks written in business language.",
  "Quick wins you can ship in 30-60 minutes.",
  "Bigger wins for your next 1-2 weeks of work.",
  "A module recommendation stack mapped to our paid services.",
  "A clear path into DIY fixes or done-for-you delivery.",
];

const howItWorks = [
  "Enter your website URL and generate your report instantly.",
  "We score core growth signals and highlight booking leaks.",
  "You get the implementation path and can action it immediately.",
];

const faqs = [
  {
    question: "Is this actually free?",
    answer: "Yes. The audit report is free to run. You only pay if you choose implementation modules afterward.",
  },
  {
    question: "Do I need to submit email first?",
    answer: "No. Email is optional and never blocks the report view.",
  },
  {
    question: "How fast do I get results?",
    answer: "Most reports load within seconds depending on your website response time.",
  },
  {
    question: "Can this help if I already have traffic but low sales?",
    answer: "Yes. The conversion and trust sections focus specifically on turning visits into enquiries or purchases.",
  },
  {
    question: "Does this replace a full technical audit?",
    answer: "No. This is a growth-focused launch audit designed to prioritise actions that move bookings and revenue quickly.",
  },
  {
    question: "Can I send the report to my team?",
    answer: "Yes. Use the share actions in the results view, then align your team around the top priorities.",
  },
  {
    question: "What if I do not know which service I need next?",
    answer: "Use the recommended modules in your report, or move to [bespoke plan](/bespoke-plan) for a done-for-you roadmap.",
  },
  {
    question: "What happens after the report?",
    answer: "You can continue in DIY mode via [playground](/playground) or start implementation through [services](/services).",
  },
];

export default function WebsiteGrowthAuditFreePage() {
  return (
    <>
      <JsonLd
        data={softwareApplicationSchema({
          name: "Website Growth Audit",
          description: "Free instant website growth audit for UK businesses with scores, leak diagnostics, and conversion-focused action plans.",
          path: "/website-growth-audit-free",
          isFree: true,
        })}
      />
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[linear-gradient(145deg,rgba(34,211,238,0.18),rgba(15,23,42,0.92))] p-6 md:p-8">
          <GlowGrid className="opacity-70" />
          <MotionReveal className="relative z-10 max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Free Website Growth Audit</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">See what is blocking your bookings in under a minute</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-lg">
              Enter your URL and get an instant growth report with priority fixes, impact estimates, and the shortest route to better lead and sales performance.
            </p>
            <div className="mt-6">
              <AuditUrlLaunchForm submitLabel="Start free website scan" destination="start" />
            </div>
            <p className="mt-3 text-xs text-slate-300">Instant report. No spam. Email optional.</p>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <AuditTrustStrip />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <h2 className="text-4xl font-semibold text-white md:text-5xl">What you get</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {whatYouGet.map((item) => (
            <article key={item} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4 text-sm text-slate-200">
              {item}
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <h2 className="text-4xl font-semibold text-white md:text-5xl">How it works</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <article key={step} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">Step {index + 1}</p>
              <p className="mt-2 text-sm text-slate-200">{step}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Example outputs</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Speed score", score: "58", detail: "Load bottlenecks detected on first screen." },
            { label: "SEO score", score: "62", detail: "Intent alignment opportunities on core pages." },
            { label: "Conversion score", score: "47", detail: "Offer and CTA structure needs simplification." },
            { label: "Trust score", score: "55", detail: "Proof and confidence cues need reinforcement." },
          ].map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">{item.label}</p>
              <p className="mt-1 text-3xl font-semibold text-white">{item.score}</p>
              <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <h2 className="text-4xl font-semibold text-white md:text-5xl">FAQs</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA
          title="Turn your audit findings into booked revenue"
          description="Use the free report first, then choose whether you want guided DIY fixes or a done-for-you growth rollout."
        />
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <Link href="/playground" className="font-semibold text-cyan-300 hover:text-cyan-200">
            See sample report
          </Link>
          <Link href="/services" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Explore services
          </Link>
          <Link href="/bespoke-plan" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Build bespoke plan
          </Link>
        </div>
      </SectionBlock>
    </>
  );
}
