import { Mail, MapPin, Phone } from "lucide-react";

import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { LeadCaptureForm } from "@/components/shared/lead-capture-form";
import { contactFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({ path: "/contact" });

const outcomes = [
  "Practical system recommendation based on your current bottleneck",
  "Clear scope with timeline and implementation phases",
  "Priority actions for the next 30 days",
];

const checklist = [
  "Current traffic and lead sources",
  "Average response and follow-up process",
  "Booking workflow and no-show handling",
  "Team capacity and growth target",
];

const proof = [
  { label: "Typical first response from our team", value: "< 1 business day" },
  { label: "Delivery coverage", value: "UK-wide" },
  { label: "Entry plan", value: "From £79/mo" },
];

const faqs = contactFaqs();

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Tell us where revenue is leaking</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
            Share your current funnel setup and we will send a practical growth plan with next steps.
          </p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <MotionReveal>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">Get your growth plan</h2>
              <p className="mt-2 text-sm text-slate-300">We usually respond with a scoped recommendation inside one business day.</p>
              <LeadCaptureForm className="mt-6" />
            </div>
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <Mail className="size-4 text-cyan-300" /> Email
                </p>
                <a href={`mailto:${siteConfig.email}`} className="mt-2 block text-sm text-slate-300 hover:text-cyan-200">
                  {siteConfig.email}
                </a>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <Phone className="size-4 text-cyan-300" /> Phone
                </p>
                <p className="mt-2 text-sm text-slate-300">{siteConfig.phone}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <MapPin className="size-4 text-cyan-300" /> Coverage
                </p>
                <p className="mt-2 text-sm text-slate-300">UK-wide delivery with remote-first implementation.</p>
              </div>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-2">
          <MotionReveal>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <h2 className="text-2xl font-semibold text-white">Outcomes from this call</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {outcomes.map((item) => (
                  <li key={item} className="list-disc pl-1 marker:text-cyan-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.05}>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <h2 className="text-2xl font-semibold text-white">What to share for a better plan</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {checklist.map((item) => (
                  <li key={item} className="list-disc pl-1 marker:text-cyan-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              "Submit your details",
              "We audit your current funnel",
              "You get implementation priorities",
              "Book strategy call if aligned",
            ].map((step, index) => (
              <div key={step} className="rounded-xl border border-slate-800 bg-slate-900/45 p-4">
                <p className="text-xs text-cyan-300">Step {index + 1}</p>
                <p className="mt-2 text-sm text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </MotionReveal>
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
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Contact and onboarding questions</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA
          title="Prefer to skip email and book directly?"
          description="Use our booking page to lock in a strategy call with your growth priorities pre-scoped."
        />
      </SectionBlock>
    </>
  );
}
