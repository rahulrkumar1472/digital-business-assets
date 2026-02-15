import type { Metadata } from "next";
import Link from "next/link";

import { PdfPrintActions } from "@/components/tools/pdf-print-actions";
import { buildGrowthAuditReport, fetchLiveAuditSignal } from "@/lib/scans/growth-audit-report";
import { buildBusinessSnapshot, buildReportModulePacks, buildReportTopActions } from "@/lib/scans/report-plan";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type WebsiteAuditPdfPageProps = {
  searchParams: Promise<{
    url?: string;
    industry?: string;
    goal?: string;
    rid?: string;
    businessName?: string;
  }>;
};

export const metadata: Metadata = buildMetadata({
  path: "/tools/website-audit/pdf",
  title: "Website Growth Audit PDF",
  description:
    "Printable Website Growth Audit with executive summary, funnel plan, implementation timeline, and clickable next-step links for growth deployment.",
});

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function pageShellClasses(isLast = false) {
  return [
    "relative flex min-h-[860px] flex-col overflow-hidden border border-slate-800 bg-slate-950/96 p-8 text-slate-100",
    "print:h-[297mm] print:min-h-[297mm] print:max-h-[297mm] print:w-[210mm] print:overflow-hidden",
    isLast ? "" : "print:break-after-page",
  ]
    .join(" ")
    .trim();
}

export default async function WebsiteAuditPdfPage({ searchParams }: WebsiteAuditPdfPageProps) {
  const params = await searchParams;
  const url = params.url?.trim() || "https://example.co.uk";
  const industry = params.industry?.trim() || "service";
  const goal = params.goal?.trim() || "leads";
  const rid = params.rid?.trim() || "";
  const generatedAt = new Date();

  const liveSignal = await fetchLiveAuditSignal(url);
  const report = buildGrowthAuditReport({ url, industry, goal }, { liveSignal });
  const topActions = buildReportTopActions(report);
  const modulePacks = buildReportModulePacks(report, topActions);
  const snapshot = buildBusinessSnapshot(report.normalizedUrl, report.liveSignal);

  const websiteName = params.businessName?.trim() || snapshot.hostname;
  const backHref = `/tools/website-audit/results?url=${encodeURIComponent(report.normalizedUrl)}&industry=${encodeURIComponent(industry)}&goal=${encodeURIComponent(goal)}`;
  const bespokeHref = `/bespoke-plan?track=track1&website=${encodeURIComponent(report.normalizedUrl)}&industry=${encodeURIComponent(industry)}&goal=${encodeURIComponent(goal)}&topAction=${encodeURIComponent(topActions[0]?.title || "Growth plan")}`;
  const scanStartHref = "/tools/website-audit/start";

  const topChecks = (report.liveSignal?.checks || []).slice(0, 6);
  const readiness = report.liveSignal?.summaryScore ?? Math.round((report.seoScore + report.trustScore) / 2);
  const actionUpliftLow = topActions.length ? Math.min(...topActions.map((action) => action.upliftLow)) : 8;
  const actionUpliftHigh = topActions.length ? Math.max(...topActions.map((action) => action.upliftHigh)) : 16;

  return (
    <div className="bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-[960px] px-4 pt-6 pb-14 print:max-w-none print:px-0 print:py-0">
        <PdfPrintActions backHref={backHref} />

        <div className="space-y-6 print:space-y-0">
          <section className={pageShellClasses()}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.2),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.18),transparent_50%)]" />
            <div className="relative z-10 flex h-full flex-col">
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">Digital Business Assets</p>
              <h1 className="mt-5 text-4xl leading-tight font-semibold text-white">Website Growth Audit</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Bespoke growth report focused on discoverability, conversion, trust, and response speed.
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                <article className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                  <p className="text-xs text-slate-400">Website URL</p>
                  <p className="mt-1 text-sm font-semibold text-white break-all">{report.normalizedUrl}</p>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                  <p className="text-xs text-slate-400">Prepared for</p>
                  <p className="mt-1 text-sm font-semibold text-white">{websiteName}</p>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="mt-1 text-sm font-semibold text-white">{formatDate(generatedAt)}</p>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                  <p className="text-xs text-slate-400">Report ID</p>
                  <p className="mt-1 text-sm font-semibold text-white break-all">{rid || "auto-generated"}</p>
                </article>
              </div>

              <div className="mt-auto pt-8">
                <p className="text-xs text-slate-400">Confidential — For internal use</p>
              </div>
            </div>
          </section>

          <section className={pageShellClasses()}>
            <div className="h-full">
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">Executive summary</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Revenue + search readiness overview</h2>

              <div className="mt-4 grid gap-3 grid-cols-2">
                {[
                  { label: "Growth score", value: report.score },
                  { label: "Search readiness", value: readiness },
                  { label: "Conversion", value: report.conversionScore },
                  { label: "Trust", value: report.trustScore },
                ].map((item) => (
                  <article key={item.label} className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold text-white">{item.value}/100</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" style={{ width: `${readiness}%` }} />
              </div>

              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Business snapshot</p>
                <div className="mt-2 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                  <p>Hostname: <span className="font-semibold text-white">{snapshot.hostname}</span></p>
                  <p>HTTPS: <span className={snapshot.isHttps ? "font-semibold text-emerald-300" : "font-semibold text-rose-300"}>{snapshot.isHttps ? "Yes" : "No"}</span></p>
                  <p>Title: <span className="text-slate-200">{snapshot.titleText || "Not detected"}</span></p>
                  <p>H1: <span className="text-slate-200">{snapshot.h1Text || "Not detected"}</span></p>
                  <p>
                    Contact signals:{" "}
                    <span className="text-slate-200">
                      {snapshot.hasEmailContact ? "Email " : ""}{snapshot.hasPhoneContact ? "Phone " : ""}{snapshot.hasAddressSignal ? "Address" : ""}{" "}
                      {!snapshot.hasEmailContact && !snapshot.hasPhoneContact && !snapshot.hasAddressSignal ? "Not detected" : "detected"}
                    </span>
                  </p>
                  <p>Likely site type: <span className="text-slate-200">{snapshot.likelySiteType}</span></p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {topChecks.map((check) => (
                  <article key={check.label} className="rounded-lg border border-slate-700 bg-slate-900/75 p-2.5">
                    <p className="text-sm font-semibold text-white">{check.label}</p>
                    <p className={`text-xs ${check.pass ? "text-slate-300" : "text-rose-200"}`}>{check.note}</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 grid gap-3">
                {topActions.map((action, index) => (
                  <article key={action.id} className="rounded-lg border border-slate-700 bg-slate-900/75 p-3">
                    <p className="text-xs text-cyan-200">Action {index + 1}</p>
                    <h3 className="text-sm font-semibold text-white">{action.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-300">{action.upliftRange} potential uplift</p>
                    <p className="mt-1 text-xs text-slate-400">Because we detected: {action.becauseDetected}</p>
                    <p className="mt-1 text-xs text-slate-300">Why this matters for revenue: {action.revenueWhy}</p>
                    <a href={absoluteUrl(action.href)} className="mt-1 inline-block text-xs font-semibold text-cyan-300 underline">
                      Fix path
                    </a>
                  </article>
                ))}
              </div>
              <p className="mt-3 text-xs text-cyan-200">
                Estimated upside: +{actionUpliftLow}% to +{actionUpliftHigh}% from top-priority fixes. If you deploy only the top 1-2 actions first, you typically see the fastest lift.
              </p>

              <div className="mt-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-3 text-xs">
                <p className="font-semibold text-cyan-200">Next best step</p>
                <p className="mt-1 text-slate-200">
                  DIY:{" "}
                  <a href={absoluteUrl("/tools")} className="text-cyan-300 underline">
                    Continue with guided tasks
                  </a>{" "}
                  · Done-for-you:{" "}
                  <a href={absoluteUrl(bespokeHref)} className="text-cyan-300 underline">
                    Request bespoke implementation
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className={pageShellClasses()}>
            <div className="h-full">
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">Funnel + 14-day plan</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">What we fix and in what order</h2>

              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/75 p-4">
                <svg viewBox="0 0 920 180" className="w-full">
                  <defs>
                    <linearGradient id="funnel-line" x1="0" x2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                  {["Traffic", "Landing", "Offer", "Lead Capture", "Follow-up", "Booking/Sale"].map((label, index) => {
                    const x = 70 + index * 155;
                    return (
                      <g key={label}>
                        <rect x={x - 54} y={64} width={108} height={46} rx={10} fill="#0f172a" stroke="#334155" />
                        <text x={x} y={92} textAnchor="middle" fill="#e2e8f0" fontSize="13">
                          {label}
                        </text>
                        {index < 5 ? <line x1={x + 54} y1={87} x2={x + 101} y2={87} stroke="url(#funnel-line)" strokeWidth="2.5" /> : null}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <article className="rounded-xl border border-slate-700 bg-slate-900/75 p-3">
                  <p className="text-xs text-cyan-200">Day 1-3</p>
                  <p className="mt-1 text-xs text-slate-300">{report.recommendedModules[0]?.action || "Fix top conversion and tracking blockers."}</p>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-900/75 p-3">
                  <p className="text-xs text-cyan-200">Day 4-7</p>
                  <p className="mt-1 text-xs text-slate-300">{report.recommendedModules[2]?.action || "Deploy search and trust-layer improvements."}</p>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-900/75 p-3">
                  <p className="text-xs text-cyan-200">Day 8-14</p>
                  <p className="mt-1 text-xs text-slate-300">{report.recommendedModules[4]?.action || "Automate follow-up and performance checks."}</p>
                </article>
              </div>

              <div className="mt-4 grid gap-2">
                {modulePacks.map((pack) => (
                  <article key={pack.id} className="rounded-lg border border-slate-700 bg-slate-900/75 p-2.5">
                    <p className="text-sm font-semibold text-white">{pack.title}</p>
                    <p className="text-xs text-slate-300">{pack.why}</p>
                    <a href={absoluteUrl(pack.href)} className="text-xs font-semibold text-cyan-300 underline">
                      View module
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={pageShellClasses(true)}>
            <div className="h-full">
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">About DBA</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">How we operate: tools first, implementation optional</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <article className="rounded-xl border border-slate-700 bg-slate-900/75 p-4">
                  <p className="text-sm font-semibold text-cyan-200">Done-for-you (Track 1)</p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    <li>Website + conversion layer deployment</li>
                    <li>Automation + follow-up operating system</li>
                    <li>Module rollout with measurable milestones</li>
                  </ul>
                </article>
                <article className="rounded-xl border border-slate-700 bg-slate-900/75 p-4">
                  <p className="text-sm font-semibold text-cyan-200">DIY with support (Track 2)</p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    <li>Use free scan + simulator for priorities</li>
                    <li>Implement in-house using guided tasks</li>
                    <li>Upgrade module-by-module only as needed</li>
                  </ul>
                </article>
              </div>

              <div className="mt-5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4 text-sm">
                <p className="font-semibold text-cyan-200">Next actions</p>
                <div className="mt-2 flex flex-col gap-1 text-xs">
                  <a href={absoluteUrl("/services")} className="text-cyan-300 underline">
                    Explore services
                  </a>
                  <a href={absoluteUrl(bespokeHref)} className="text-cyan-300 underline">
                    Build bespoke implementation plan
                  </a>
                  <a href={absoluteUrl(scanStartHref)} className="text-cyan-300 underline">
                    Run another scan
                  </a>
                </div>
              </div>

              <div className="mt-auto pt-8 text-xs text-slate-400">
                <p>{siteConfig.legalName}</p>
                <p>{siteConfig.email}</p>
                <p>{siteConfig.url}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-4 print:hidden">
          <Link href={backHref} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            Back to website audit results
          </Link>
        </div>
      </div>
    </div>
  );
}
