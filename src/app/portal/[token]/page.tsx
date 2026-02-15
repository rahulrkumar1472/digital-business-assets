import Link from "next/link";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPortalSessionPayload } from "@/lib/portal/portal-session";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = {
  ...buildMetadata({ path: "/portal" }),
  robots: {
    index: false,
    follow: false,
  },
};

type PortalDashboardPageProps = {
  params: Promise<{ token: string }>;
};

function formatNumber(value: number | null | undefined, fallback = "—") {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return value.toLocaleString("en-GB", { maximumFractionDigits: 0 });
}

function scoreBadge(score: number | null | undefined) {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return "border-slate-700 bg-slate-900/70 text-slate-300";
  }
  if (score >= 90) return "border-emerald-400/35 bg-emerald-500/15 text-emerald-200";
  if (score >= 50) return "border-amber-400/35 bg-amber-500/15 text-amber-200";
  return "border-rose-400/35 bg-rose-500/15 text-rose-200";
}

function buildTrendPoints(history: Array<{ overallScore: number | null }>) {
  const values = history
    .slice(0, 10)
    .map((item) => (typeof item.overallScore === "number" ? item.overallScore : null))
    .reverse();

  if (!values.length) {
    return "";
  }

  const maxX = Math.max(values.length - 1, 1);
  const points = values.map((score, index) => {
    const x = (index / maxX) * 100;
    const y = score === null ? 70 : 90 - (score / 100) * 80;
    return `${x},${y}`;
  });

  return points.join(" ");
}

export default async function PortalDashboardPage({ params }: PortalDashboardPageProps) {
  const { token } = await params;
  const session = await getPortalSessionPayload(token);

  if (!session) {
    return (
      <SectionBlock className="pt-24 pb-20">
        <MotionReveal>
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/55 p-6 text-center">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Portal session</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">This dashboard link has expired</h1>
            <p className="mt-3 text-sm text-slate-300">
              Request a new secure link using your lead email to continue.
            </p>
            <Button asChild className="mt-5 bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <Link href="/portal">Request a new portal link</Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>
    );
  }

  const latestAudit = session.latestAudit;
  const latestSimulator = session.latestSimulator;
  const trendPoints = buildTrendPoints(session.auditHistory);
  const website = session.lead.website || "";
  const websiteParam = website ? encodeURIComponent(website) : "";

  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 md:p-7">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Client Portal</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">{session.lead.businessName || session.lead.name}</h1>
            <p className="mt-2 text-sm text-slate-300">{session.lead.website || "Website not supplied"}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-100">Saved audit dashboard</Badge>
              <span>Session expires: {new Date(session.session.expiresAt).toLocaleString("en-GB")}</span>
            </div>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <MotionReveal>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">Score trend</h2>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreBadge(latestAudit?.overallScore)}`}>
                  Latest {typeof latestAudit?.overallScore === "number" ? `${latestAudit.overallScore}/100` : "n/a"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">Track how your audit score moves as you deploy modules and fix priority leaks.</p>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <svg viewBox="0 0 100 90" className="h-36 w-full">
                  <defs>
                    <linearGradient id="portalTrend" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#67e8f9" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  <g opacity="0.2" stroke="#334155" strokeWidth="0.8">
                    <line x1="0" y1="20" x2="100" y2="20" />
                    <line x1="0" y1="40" x2="100" y2="40" />
                    <line x1="0" y1="60" x2="100" y2="60" />
                    <line x1="0" y1="80" x2="100" y2="80" />
                  </g>
                  {trendPoints ? (
                    <polyline fill="none" stroke="url(#portalTrend)" strokeWidth="2.5" points={trendPoints} />
                  ) : (
                    <text x="50" y="48" textAnchor="middle" fill="#94a3b8" fontSize="5">
                      No snapshot history yet
                    </text>
                  )}
                </svg>
                <p className="mt-1 text-xs text-slate-400">Based on your last {Math.min(session.auditHistory.length, 10)} saved audit snapshots.</p>
              </div>
            </article>
          </MotionReveal>

          <MotionReveal delay={0.05}>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h2 className="text-xl font-semibold text-white">Next best actions</h2>
              <p className="mt-2 text-sm text-slate-300">Use these to move scores quickly, then decide DIY or done-for-you implementation.</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {(latestAudit?.recommendedModules.slice(0, 3) || []).map((module) => (
                  <li key={module.title} className="rounded-lg border border-slate-800 bg-slate-950/65 p-3">
                    <p className="font-semibold text-white">{module.title}</p>
                    {module.why ? <p className="mt-1 text-xs text-slate-300">{module.why}</p> : null}
                    <Link href={module.href} className="mt-2 inline-flex text-xs font-semibold text-cyan-200 hover:text-cyan-100">
                      Open module
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                  <Link href={websiteParam ? `/book?source=portal&website=${websiteParam}` : "/book"}>Book a strategy call</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800">
                  <Link href={websiteParam ? `/bespoke-plan?track=track1&website=${websiteParam}` : "/bespoke-plan"}>
                    Request done-for-you quote
                  </Link>
                </Button>
              </div>
            </article>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 xl:grid-cols-2">
          <MotionReveal>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">Latest audit report</h2>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreBadge(latestAudit?.overallScore)}`}>
                  {typeof latestAudit?.overallScore === "number" ? `${latestAudit.overallScore}/100` : "n/a"}
                </span>
              </div>

              {latestAudit ? (
                <>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-800 bg-slate-950/65 p-2.5"><p className="text-slate-400">Performance</p><p className="mt-1 font-semibold text-slate-100">{formatNumber(latestAudit.scores.performance)}</p></div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/65 p-2.5"><p className="text-slate-400">SEO</p><p className="mt-1 font-semibold text-slate-100">{formatNumber(latestAudit.scores.seo)}</p></div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/65 p-2.5"><p className="text-slate-400">Customer Experience</p><p className="mt-1 font-semibold text-slate-100">{formatNumber(latestAudit.scores.customerExperience)}</p></div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Top findings</p>
                    {latestAudit.topFindings.slice(0, 10).map((finding, index) => (
                      <div key={`${finding.label}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/65 p-3">
                        <p className="text-sm font-semibold text-white">{finding.label}</p>
                        <p className="mt-1 text-xs text-slate-400">{finding.category} · {finding.status}</p>
                        {finding.fix ? <p className="mt-1 text-xs text-slate-300">Fix: {finding.fix}</p> : null}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-slate-300">No saved audit snapshot yet.</p>
              )}
            </article>
          </MotionReveal>

          <MotionReveal delay={0.05}>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">Latest simulator output</h2>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreBadge(latestSimulator?.summaryScore)}`}>
                  {typeof latestSimulator?.summaryScore === "number" ? `${Math.round(latestSimulator.summaryScore)}/100` : "n/a"}
                </span>
              </div>

              {latestSimulator ? (
                <>
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    {latestSimulator.scenarios.length ? (
                      latestSimulator.scenarios.map((scenario) => (
                        <div key={scenario.label} className="rounded-lg border border-slate-800 bg-slate-950/65 p-3">
                          <p className="text-xs font-semibold text-white">{scenario.label}</p>
                          <p className="mt-1 text-[11px] text-slate-400">Conv uplift +{scenario.conversionUpliftPct.toFixed(1)}%</p>
                          <p className="mt-1 text-xs text-slate-200">Revenue delta +£{scenario.projectedRevenueDelta.toLocaleString("en-GB")}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-300 md:col-span-3">No scenario data available yet.</p>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Top moves</p>
                    {latestSimulator.topMoves.slice(0, 5).map((move) => (
                      <div key={move.title} className="rounded-lg border border-slate-800 bg-slate-950/65 p-3">
                        <p className="text-sm font-semibold text-white">{move.title}</p>
                        <p className="mt-1 text-xs text-slate-400">Uplift +{move.upliftLowPct}% to +{move.upliftHighPct}% · {move.timeToImpact}</p>
                        {move.href ? (
                          <Link href={move.href} className="mt-1 inline-flex text-xs font-semibold text-cyan-200 hover:text-cyan-100">
                            Open related module
                          </Link>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-slate-300">No saved simulator snapshot yet.</p>
              )}
            </article>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock className="pb-20">
        <MotionReveal>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
            <h2 className="text-xl font-semibold text-white">History</h2>
            <p className="mt-1 text-sm text-slate-300">
              Audit snapshots: {session.auditHistory.length} · Simulator snapshots: {session.simulatorHistory.length}
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Audit history</p>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                  {session.auditHistory.slice(0, 8).map((item) => (
                    <li key={item.id}>
                      {new Date(item.createdAt).toLocaleString("en-GB")} · Score {typeof item.overallScore === "number" ? item.overallScore : "n/a"}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Simulator history</p>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                  {session.simulatorHistory.slice(0, 8).map((item) => (
                    <li key={item.id}>
                      {new Date(item.createdAt).toLocaleString("en-GB")} · Score {typeof item.summaryScore === "number" ? Math.round(item.summaryScore) : "n/a"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </MotionReveal>
      </SectionBlock>
    </>
  );
}
