import Link from "next/link";
import { notFound } from "next/navigation";

import { AiFollowUpGenerator } from "@/components/admin/ai-follow-up-generator";
import { AutomationActivityPanel } from "@/components/admin/automation-activity-panel";
import { FollowUpEmailButton } from "@/components/admin/follow-up-email-button";
import { LeadProfileEditor } from "@/components/admin/lead-profile-editor";
import { LeadScoreButton } from "@/components/admin/lead-score-button";
import { PortalLinkButton } from "@/components/admin/portal-link-button";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";
import { getLeadVaultDetail } from "@/lib/admin/lead-vault";

export const metadata = buildMetadata({ path: "/admin/leads" });

type LeadDetailRouteContext = {
  params: Promise<{ id: string }>;
};

function scoreBadge(score: number | null) {
  if (typeof score !== "number") {
    return "border-slate-700 bg-slate-900/70 text-slate-300";
  }
  if (score >= 90) return "border-emerald-400/35 bg-emerald-500/15 text-emerald-200";
  if (score >= 50) return "border-amber-400/35 bg-amber-500/15 text-amber-200";
  return "border-rose-400/35 bg-rose-500/15 text-rose-200";
}

function statusBadge(status: string) {
  const value = status.toLowerCase();
  if (value === "hot_followup_sent") return "border-fuchsia-400/35 bg-fuchsia-500/15 text-fuchsia-200";
  if (value === "won") return "border-emerald-400/35 bg-emerald-500/15 text-emerald-200";
  if (value === "booked" || value === "contacted") return "border-cyan-400/35 bg-cyan-500/15 text-cyan-200";
  if (value === "lost") return "border-rose-400/35 bg-rose-500/15 text-rose-200";
  return "border-amber-400/35 bg-amber-500/15 text-amber-200";
}

function leadScoreBadge(temperature: "hot" | "warm" | "cold") {
  if (temperature === "hot") return "border-rose-400/35 bg-rose-500/15 text-rose-200";
  if (temperature === "warm") return "border-amber-400/35 bg-amber-500/15 text-amber-200";
  return "border-slate-700 bg-slate-900/70 text-slate-300";
}

function prettyLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(value);
}

export default async function AdminLeadDetailPage({ params }: LeadDetailRouteContext) {
  const { id } = await params;
  const detail = await getLeadVaultDetail(id);

  if (!detail) {
    notFound();
  }

  const auditScore = detail.latestAudit?.overallScore ?? null;
  const simulatorScore = detail.latestSimulator?.summaryScore ?? null;

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Lead profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{detail.name}</h2>
            <p className="mt-1 text-sm text-slate-300">{detail.businessName || "Business name not provided"}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`border px-2.5 py-1 text-xs font-medium ${statusBadge(detail.status)}`}>{detail.status}</Badge>
            <Badge className="border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-xs text-slate-200">{detail.intentTier} intent</Badge>
            <Badge className={`border px-2.5 py-1 text-xs ${leadScoreBadge(detail.leadTemperature)}`}>
              {detail.leadTemperature === "hot"
                ? `🔥 HOT (${detail.leadScore})`
                : detail.leadTemperature === "warm"
                  ? `🟡 WARM (${detail.leadScore})`
                  : `⚪ COLD (${detail.leadScore})`}
            </Badge>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2 lg:grid-cols-3">
          <p>Email: <span className="text-slate-100">{detail.email || "—"}</span></p>
          <p>Phone: <span className="text-slate-100">{detail.phone || "—"}</span></p>
          <p>Source: <span className="text-slate-100">{detail.source}</span></p>
          <p className="truncate">Website: <span className="text-slate-100">{detail.url || "—"}</span></p>
          <p>Created: <span className="text-slate-100">{detail.createdAt.toLocaleString("en-GB")}</span></p>
          <p>Last seen: <span className="text-slate-100">{detail.lastSeen.toLocaleString("en-GB")}</span></p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={detail.reportHref} className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-100 hover:bg-cyan-400/20">
            View Report
          </Link>
          <FollowUpEmailButton leadId={detail.id} />
          <Link href="#timeline" className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800">
            View Timeline
          </Link>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="space-y-5">
          <AiFollowUpGenerator leadId={detail.id} />
          <AutomationActivityPanel
            lastActions={detail.automationActivity.lastActions}
            pendingTasks={detail.automationActivity.pendingTasks}
            completedTasks={detail.automationActivity.completedTasks}
          />

          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Latest Audit Summary</h3>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreBadge(auditScore)}`}>
                {typeof auditScore === "number" ? `${auditScore}/100` : "n/a"}
              </span>
            </div>

            {detail.latestAudit ? (
              <>
                <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(detail.latestAudit.scores || {}).map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-2">
                      <p className="text-slate-400">{prettyLabel(key)}</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-100">{typeof value === "number" ? formatNumber(value) : "—"}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Top findings</p>
                  {detail.latestAudit.topFindings.length ? (
                    <ul className="space-y-2">
                      {detail.latestAudit.topFindings.slice(0, 10).map((finding, index) => (
                        <li key={`${finding.label}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/55 p-3">
                          <p className="text-sm font-medium text-slate-100">{finding.label}</p>
                          <p className="mt-1 text-xs text-slate-400">{finding.category} • {finding.status}</p>
                          {finding.fix ? <p className="mt-2 text-xs text-slate-300">Fix: {finding.fix}</p> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-lg border border-slate-800 bg-slate-950/55 p-3 text-sm text-slate-300">No findings captured yet for this lead.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-300">No audit run linked yet.</p>
            )}
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Latest Simulator Summary</h3>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreBadge(simulatorScore)}`}>
                {typeof simulatorScore === "number" ? `${Math.round(simulatorScore)}/100` : "n/a"}
              </span>
            </div>

            {detail.latestSimulator ? (
              <>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  {detail.latestSimulator.scenarios.length ? (
                    detail.latestSimulator.scenarios.map((scenario) => (
                      <div key={scenario.label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-xs font-semibold text-slate-200">{scenario.label}</p>
                        <p className="mt-1 text-xs text-slate-400">Conversion uplift: +{formatNumber(scenario.conversionUpliftPct)}%</p>
                        <p className="mt-1 text-xs text-slate-300">Revenue delta: £{formatNumber(scenario.projectedRevenueDelta)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-300 md:col-span-3">No scenario data available.</p>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Top actions</p>
                  {detail.latestSimulator.topMoves.length ? (
                    <ul className="space-y-2">
                      {detail.latestSimulator.topMoves.map((move, index) => (
                        <li key={`${move.title}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/55 p-3">
                          <p className="text-sm font-medium text-slate-100">{move.title}</p>
                          <p className="mt-1 text-xs text-slate-400">Uplift range: +{move.upliftLowPct}% to +{move.upliftHighPct}%</p>
                          <p className="mt-1 text-xs text-slate-300">Time to impact: {move.timeToImpact}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-300">No action stack captured yet.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-300">No simulator run linked yet.</p>
            )}
          </article>
        </div>

        <div className="space-y-5">
          <PortalLinkButton
            leadId={detail.id}
            initialToken={detail.latestPortalSession?.token || null}
            initialExpiresAt={detail.latestPortalSession ? detail.latestPortalSession.expiresAt.toISOString() : null}
          />
          <LeadScoreButton
            leadId={detail.id}
            initialScore={detail.leadScore}
            initialCategory={detail.leadTemperature}
          />
          <LeadProfileEditor
            leadId={detail.id}
            initialValues={{
              notes: detail.notes,
              intentTier: detail.intentTier,
              nextAction: detail.nextAction,
              status: detail.status,
            }}
          />
        </div>
      </div>

      <article id="timeline" className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
        <h3 className="text-lg font-semibold text-white">Event Timeline</h3>
        <p className="mt-1 text-sm text-slate-300">Chronological event stream for this lead, including audit, simulator, and conversion actions.</p>

        <div className="mt-4 space-y-2">
          {detail.timeline.length ? (
            detail.timeline.map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-800 bg-slate-950/55 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-100">{prettyLabel(event.type)}</p>
                  <p className="text-xs text-slate-400">{event.createdAt.toLocaleString("en-GB")}</p>
                </div>
                {event.payload ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-cyan-200">View payload</summary>
                    <pre className="mt-2 overflow-x-auto rounded-md border border-slate-800 bg-slate-900/70 p-2 text-[11px] text-slate-300">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </details>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">No payload captured.</p>
                )}
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-slate-800 bg-slate-950/55 p-3 text-sm text-slate-300">No events recorded for this lead yet.</p>
          )}
        </div>
      </article>
    </section>
  );
}
