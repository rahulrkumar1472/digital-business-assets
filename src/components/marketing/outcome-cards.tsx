import { CheckCircle2 } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";

const outcomes = [
  "A website that converts, not just a brochure.",
  "Automations that chase leads instantly.",
  "Bookings and reminders that reduce no-shows.",
  "Reporting dashboard that shows ROI clearly.",
];

export function OutcomeCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {outcomes.map((item, index) => (
        <MotionReveal key={item} delay={index * 0.06}>
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-[0_18px_46px_rgba(15,23,42,0.6)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 p-1.5">
                <CheckCircle2 className="size-4 text-cyan-300" />
              </span>
              <p className="text-sm leading-relaxed text-slate-200">{item}</p>
            </div>
          </div>
        </MotionReveal>
      ))}
    </div>
  );
}
