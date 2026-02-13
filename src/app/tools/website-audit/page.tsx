import Link from "next/link";
import { BarChart3, CheckCircle2, FileText, Radar, ScanSearch } from "lucide-react";

import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { VideoSection } from "@/components/marketing/video-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { buildMetadata } from "@/lib/seo";
import { RecommendedNextStep } from "@/components/funnel/next-step";

export const metadata = buildMetadata({ path: "/tools/website-audit" });

const outcomes = [
  {
    title: "You see what is broken",
    detail: "You get technical, speed, and conversion findings in plain language.",
    icon: Radar,
  },
  {
    title: "You get a branded PDF report",
    detail: "You can download a report your team can actually act on this week.",
    icon: FileText,
  },
  {
    title: "You get fix-now upgrade cards",
    detail: "You see which modules to install first with visible from-pricing.",
    icon: BarChart3,
  },
];

const scanSteps = [
  "You submit your website, mobile number, business name, and primary concern.",
  "We run automated checks across speed, structure, metadata, and conversion paths.",
  "You get a score dashboard with practical insights by priority.",
  "You download your branded PDF and deploy fixes in sequence.",
];

const reportIncludes = [
  "Headline performance + SEO + accessibility scores",
  "Homepage desktop and mobile screenshots",
  "Technical checks: title, meta, H1, canonical, robots, sitemap",
  "Business-owner summary and urgency callouts",
  "Fix-this-now upgrade cards mapped to services",
  "Clear CTA path into booking and implementation",
];

export default function ToolsWebsiteAuditPage() {
  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Website audit tool</p>
          <h1 className="mt-3 text-5xl font-semibold text-white md:text-7xl">
            You can run a free scan before you spend another pound.
          </h1>
          <ul className="mt-4 max-w-3xl space-y-2 text-sm text-slate-300 md:text-base">
            <li className="list-disc pl-1 marker:text-cyan-300">You see where your site is leaking leads and trust.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You get a branded report with clear fix-first priorities.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You choose upgrades with transparent from-pricing.</li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/tools/website-audit/start">Start free website scan</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800"
            >
              <Link href="/services">See upgrade modules</Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.05}>
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
        <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <MotionReveal>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-7">
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Scan flow</p>
              <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
                You go from form submit to action plan in minutes
              </h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {scanSteps.map((step, index) => (
                  <li key={step} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs text-cyan-300">Step {index + 1}</p>
                    <p className="mt-1">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.05}>
            <div className="rounded-3xl border border-cyan-500/30 bg-[linear-gradient(150deg,rgba(34,211,238,0.12),rgba(15,23,42,0.9))] p-6 md:p-7">
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">PDF report includes</p>
              <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">What you can download and share</h2>
              <ul className="mt-5 space-y-2 text-sm text-slate-200">
                {reportIncludes.map((item) => (
                  <li key={item} className="inline-flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-5 bg-slate-800/80" />
              <Button asChild size="lg" className="w-full">
                <Link href="/tools/website-audit/start">
                  Run your free scan
                  <ScanSearch className="size-4" />
                </Link>
              </Button>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <VideoSection
          title="See the scan experience in under 30 seconds"
          description="Watch the exact flow from lead capture to report output and module recommendations."
          videoUrl="https://www.youtube.com/watch?v=jNQXAC9IVRw"
          points={[
            "Fast form capture with business context",
            "Automated checks and scorecards",
            "Upgrade cards linked to service modules",
          ]}
        />
      </SectionBlock>

      <SectionBlock>
        <InContextPricing
          title="You can act on findings with transparent module pricing"
          description="After your free report, you choose installs from £399-£599 and optional monthly support when you want ongoing optimisation."
          compact
        />
      </SectionBlock>

      <SectionBlock className="py-6">
        <RecommendedNextStep />
      </SectionBlock>
    </>
  );
}
