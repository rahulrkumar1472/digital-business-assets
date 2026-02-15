import { Clock3, FileDown, Gauge } from "lucide-react";

import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { WebsiteAuditOnboarding } from "@/components/tools/website-audit-onboarding";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/tools/website-audit/start" });

const expectations = [
  {
    title: "Step 1: URL-first capture",
    detail: "Enter your website URL and generate your report instantly.",
    icon: Clock3,
  },
  {
    title: "Step 2: Optional advanced tuning",
    detail: "Set industry and goal only if you want tailored output before generation.",
    icon: Gauge,
  },
  {
    title: "Step 3: Generate branded report",
    detail: "You get score diagnostics, revenue leaks, and actionable next steps.",
    icon: FileDown,
  },
];

export default function WebsiteAuditStartPage() {
  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Track 2 · Start Scan</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Start your free website scan in under 60 seconds</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
            No friction. No jargon. URL first, then optional advanced settings. You get a practical report with the
            next actions your business should take now.
          </p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <div className="mx-auto grid max-w-3xl gap-6">
          <MotionReveal delay={0.03}>
            <WebsiteAuditOnboarding />
          </MotionReveal>
          <MotionReveal>
            <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
              <h2 className="text-xl font-semibold text-white">What happens after submit</h2>
              <ul className="space-y-2.5">
                {expectations.map((item) => (
                  <li key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      <item.icon className="size-4 text-cyan-300" />
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <InContextPricing
          title="If we find problems, here is how fixes are priced"
          description="Module installs are transparent one-time projects, with optional monthly support tiers if you want us operating the system with you."
          compact
        />
      </SectionBlock>
    </>
  );
}
