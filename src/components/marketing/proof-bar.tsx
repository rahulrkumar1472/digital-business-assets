import { Sparkles } from "lucide-react";

import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { MotionReveal } from "@/components/marketing/motion-reveal";

const proofStats = [
  {
    label: "Avg. response time",
    value: 68,
    suffix: "%",
    prefix: "↓",
  },
  {
    label: "Bookings",
    value: 41,
    suffix: "%",
    prefix: "↑",
  },
  {
    label: "Missed calls recovered",
    value: 87,
    suffix: "%",
    prefix: "↑",
  },
];

export function ProofBar() {
  return (
    <MotionReveal>
      <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/55 p-6 shadow-[0_0_0_1px_rgba(56,189,248,0.08),0_28px_80px_rgba(2,6,23,0.5)] backdrop-blur">
        <div className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">
          <Sparkles className="size-3.5" />
          15+ years building digital systems
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {proofStats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/55 p-4"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-xs tracking-[0.1em] text-slate-400 uppercase">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </MotionReveal>
  );
}
