import { Clock3 } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";

type Step = {
  title: string;
  detail: string;
  timeline: string;
};

const defaultSteps: Step[] = [
  {
    title: "Tell us your business",
    detail:
      "We audit your funnel, response speed, and current lead handling to isolate revenue leaks fast.",
    timeline: "Day 0",
  },
  {
    title: "We build your revenue system",
    detail: "Website, offer pages, forms, and CRM handoff built and wired to conversion goals.",
    timeline: "72 hours website",
  },
  {
    title: "We automate follow-up",
    detail: "Missed-call recovery, reminders, chatbot responses, and pipeline automations go live.",
    timeline: "7 days automation",
  },
  {
    title: "You track growth",
    detail: "We optimise from real performance data and keep improving close rates month by month.",
    timeline: "30 days optimisation",
  },
];

type HowItWorksStepperProps = {
  steps?: Step[];
};

export function HowItWorksStepper({ steps = defaultSteps }: HowItWorksStepperProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {steps.map((step, index) => (
        <MotionReveal key={step.title} delay={index * 0.07}>
          <div className="relative h-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-400/45 hover:shadow-[0_22px_60px_rgba(15,23,42,0.55)]">
            <div className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full border border-cyan-500/35 bg-slate-950 px-3 py-1 text-[11px] text-cyan-300">
              <Clock3 className="size-3" />
              {step.timeline}
            </div>
            <div className="absolute top-0 left-0 h-full w-full rounded-2xl bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.13),transparent_45%)]" />
            <div className="mt-5 flex items-start gap-3">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-cyan-500/35 bg-cyan-500/10 text-xs font-semibold text-cyan-200">
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.detail}</p>
              </div>
            </div>
          </div>
        </MotionReveal>
      ))}
    </div>
  );
}
