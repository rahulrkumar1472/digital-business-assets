import Link from "next/link";
import { ArrowRight, SearchCheck, Wrench } from "lucide-react";

import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { StepperQuiz } from "@/components/marketing/stepper-quiz";
import { SystemDiagram } from "@/components/marketing/system-diagram";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/tools" });

const toolCards = [
  {
    title: "Free Website Scan",
    description:
      "You run a structured scan, get technical + conversion findings, and receive a branded report with clear next actions.",
    bullets: [
      "Lead capture with business context",
      "Priority scorecards and diagnostics",
      "Downloadable PDF report for your team",
    ],
    href: "/tools/website-audit/start",
    cta: "Start free scan",
    icon: SearchCheck,
  },
  {
    title: "Growth Simulator",
    description:
      "You model your current numbers and see where faster follow-up, better conversion, and clearer offers could move revenue.",
    bullets: [
      "Speed-to-lead and conversion inputs",
      "Projected uplift ranges",
      "Prefilled booking handoff",
    ],
    href: "/growth-simulator",
    cta: "Open simulator",
    icon: Wrench,
  },
];

const process = [
  "You pick your current bottleneck and submit your details.",
  "The tool runs checks and generates business-owner-friendly output.",
  "You review fix-now priorities with transparent from-pricing.",
  "You deploy only what your business actually needs next.",
];

export default function ToolsHubPage() {
  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Track 2 tools</p>
          <h1 className="mt-3 text-5xl font-semibold text-white md:text-7xl">
            You are online already. Now fix what is leaking revenue.
          </h1>
          <ul className="mt-4 max-w-3xl space-y-2 text-sm text-slate-300 md:text-base">
            <li className="list-disc pl-1 marker:text-cyan-300">You run diagnostics before buying more services.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You get practical priority fixes instead of generic advice.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You deploy only the modules that move your numbers next.</li>
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
              <Link href="/growth-simulator">Open growth simulator</Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-8">
        <div className="grid gap-4 md:grid-cols-2">
          {toolCards.map((tool, index) => (
            <MotionReveal key={tool.title} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
                <tool.icon className="size-5 text-cyan-300" />
                <h2 className="mt-3 text-2xl font-semibold text-white">{tool.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{tool.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {tool.bullets.map((item) => (
                    <li key={item} className="list-disc pl-1 marker:text-cyan-300">
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                  <Link href={tool.href}>
                    {tool.cta}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">What happens next</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Your tool outputs become your deployment roadmap</h2>
        </MotionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {process.map((step, index) => (
            <MotionReveal key={step} delay={index * 0.05}>
              <article className="h-full rounded-xl border border-slate-800 bg-slate-900/45 p-4">
                <p className="text-xs text-cyan-300">Step {index + 1}</p>
                <p className="mt-2 text-sm text-slate-300">{step}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <StepperQuiz />
      </SectionBlock>

      <SectionBlock>
        <SystemDiagram />
      </SectionBlock>

      <SectionBlock>
        <InContextPricing
          title="Run diagnosis first, then pay only for needed installs"
          description="Tools are your filter. You choose modules with clear from-pricing once you know where the biggest leak is."
        />
      </SectionBlock>
    </>
  );
}
