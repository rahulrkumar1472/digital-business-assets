import Link from "next/link";

import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { AuditTrustStrip } from "@/components/tools/audit-trust-strip";
import { AuditUrlLaunchForm } from "@/components/tools/audit-url-launch-form";
import { GlowGrid } from "@/components/visuals/glow-grid";
import { faqSchema, softwareApplicationSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";
import type { FaqItem } from "@/types/content";

type SeoAuditEntryTemplateProps = {
  eyebrow: string;
  title: string;
  description: string;
  whatYouGetIntro: string;
  includes: string[];
  howItWorksIntro: string;
  steps: string[];
  outputsIntro: string;
  sampleScores: Array<{ label: string; score: string; detail: string }>;
  nextStepIntro: string;
  faqs: FaqItem[];
  finalTitle: string;
  finalDescription: string;
  schemaPath?: string;
};

export function SeoAuditEntryTemplate({
  eyebrow,
  title,
  description,
  whatYouGetIntro,
  includes,
  howItWorksIntro,
  steps,
  outputsIntro,
  sampleScores,
  nextStepIntro,
  faqs,
  finalTitle,
  finalDescription,
  schemaPath,
}: SeoAuditEntryTemplateProps) {
  return (
    <>
      {schemaPath ? (
        <JsonLd
          data={softwareApplicationSchema({
            name: "Website Growth Audit",
            description:
              "Free instant website growth audit for UK businesses with scores, leak diagnostics, and conversion-focused action plans.",
            path: schemaPath,
            isFree: true,
          })}
        />
      ) : null}
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[linear-gradient(145deg,rgba(34,211,238,0.16),rgba(15,23,42,0.9))] p-6 md:p-8">
          <GlowGrid className="opacity-70" />
          <MotionReveal className="relative z-10 max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-lg">{description}</p>
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
          <h2 className="text-4xl font-semibold text-white md:text-5xl">What you get in your report</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">{whatYouGetIntro}</p>
        </MotionReveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {includes.map((item) => (
            <article key={item} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4 text-sm text-slate-200">
              {item}
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <h2 className="text-4xl font-semibold text-white md:text-5xl">How it works</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">{howItWorksIntro}</p>
        </MotionReveal>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
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
          <p className="mt-3 max-w-3xl text-sm text-slate-300">{outputsIntro}</p>
        </MotionReveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {sampleScores.map((score) => (
            <article key={score.label} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">{score.label}</p>
              <p className="mt-1 text-3xl font-semibold text-white">{score.score}</p>
              <p className="mt-2 text-xs text-slate-300">{score.detail}</p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Where to go next</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">{nextStepIntro}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/tools/website-audit/start" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Start free website scan
            </Link>
            <Link href="/services" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Service modules
            </Link>
            <Link href="/bespoke-plan" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Build bespoke plan
            </Link>
            <Link href="/playground" className="font-semibold text-cyan-300 hover:text-cyan-200">
              See sample report
            </Link>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Frequently asked questions</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title={finalTitle} description={finalDescription} />
      </SectionBlock>
    </>
  );
}
