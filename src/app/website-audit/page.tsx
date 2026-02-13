import { ChartNoAxesCombined, SearchCheck, Smartphone } from "lucide-react";

import { WebsiteAuditTool } from "@/components/marketing/website-audit-tool";
import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FinalCTA } from "@/components/marketing/final-cta";
import { ImageOrPlaceholder } from "@/components/marketing/image-or-placeholder";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/website-audit" });

const outcomes = [
  {
    icon: SearchCheck,
    title: "Technical SEO clarity",
    detail: "See exactly where title tags, descriptions, H1 structure, canonical, robots, and sitemap coverage need fixing.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first conversion insight",
    detail: "Get practical findings focused on mobile browsing behavior where most service traffic now happens.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Owner-level action plan",
    detail: "Receive a plain-English rollout sequence so you know what to fix first for measurable lead and booking impact.",
  },
];

export default function WebsiteAuditPage() {
  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <MotionReveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Website Audit</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">SEMrush-style audit report for your business website</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
              Enter your website and we generate a bespoke report with technical findings, screenshots, growth priorities,
              and a premium PDF you can act on immediately.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-200">
              <li className="list-disc pl-1 marker:text-cyan-300">Problem: traffic arrives but enquiries stay low</li>
              <li className="list-disc pl-1 marker:text-cyan-300">Why now: your competitors are installing faster response systems</li>
              <li className="list-disc pl-1 marker:text-cyan-300">What we install: conversion UX, automation, SEO baseline, and KPI tracking</li>
              <li className="list-disc pl-1 marker:text-cyan-300">Result: better lead quality, faster booking flow, and clearer growth decisions</li>
            </ul>
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45 p-3">
              <ImageOrPlaceholder
                src="/media/dashboard-call-recovery.svg"
                alt="Website audit dashboard preview"
                label="Website Audit Preview"
                className="aspect-[16/10] h-full w-full rounded-xl"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <WebsiteAuditTool />
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <item.icon className="size-5 text-cyan-300" />
                <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-2">
          <MotionReveal>
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45 p-3">
              <ImageOrPlaceholder src="/media/dashboard-followup-automation.svg" alt="Follow-up automation preview" label="Automation Preview" className="aspect-[16/10] h-full w-full rounded-xl" sizes="(min-width: 768px) 48vw, 100vw" />
            </div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45 p-3">
              <ImageOrPlaceholder src="/media/dashboard-booking-reminders.svg" alt="Booking reminder preview" label="Booking Reminders" className="aspect-[16/10] h-full w-full rounded-xl" sizes="(min-width: 768px) 48vw, 100vw" />
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="Website audit methodology for UK SMEs" audience="Business owners who need practical, measurable fixes" image="/media/dashboard-1.jpg" />
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Need a human walkthrough of your audit?" description="Book a strategy call and we will prioritise your top fixes in a 30-day deployment roadmap." />
      </SectionBlock>
    </>
  );
}
