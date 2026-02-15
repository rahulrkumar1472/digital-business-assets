import { KeyRound, LineChart, ShieldCheck } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { PortalLinkRequestForm } from "@/components/portal/portal-link-request-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/portal" });

const bullets = [
  "See your latest website audit scorecards and top findings.",
  "Re-open simulator scenarios and action priorities anytime.",
  "Track score trend, then move straight into implementation.",
];

export default function PortalRequestPage() {
  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Client Portal</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Open your saved growth dashboard</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
            Enter your email and continue where you left off. Your dashboard includes audit snapshots, simulator outputs,
            score trend, and next best actions.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-slate-200">
            {bullets.map((item) => (
              <li key={item} className="list-disc pl-1 marker:text-cyan-300">
                {item}
              </li>
            ))}
          </ul>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4 pb-20">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <MotionReveal>
            <PortalLinkRequestForm />
          </MotionReveal>
          <MotionReveal delay={0.05}>
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <article className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <LineChart className="size-4 text-cyan-300" />
                  Saved reports and trend view
                </p>
                <p className="mt-1 text-xs text-slate-300">Track score movement and reopen implementation priorities.</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <KeyRound className="size-4 text-cyan-300" />
                  Secure access window
                </p>
                <p className="mt-1 text-xs text-slate-300">Each session link expires in 24 hours for account safety.</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <ShieldCheck className="size-4 text-cyan-300" />
                  Lead-safe workflow
                </p>
                <p className="mt-1 text-xs text-slate-300">No extra logins. Just your lead email and a secure token.</p>
              </article>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>
    </>
  );
}
