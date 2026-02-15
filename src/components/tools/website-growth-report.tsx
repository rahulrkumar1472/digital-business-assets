"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy, FileDown, Mail } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Button } from "@/components/ui/button";
import { getStoredLead, requireLead, storeLead, type StoredLead } from "@/lib/leads/client";
import type { AuditCheck, AuditResult, AuditScores, RAG } from "@/lib/scans/audit-types";
import { MetricRing } from "@/components/visuals/metric-ring";

type WebsiteGrowthReportProps = {
  audit: AuditResult;
};

type LeadAction = "email" | "pdf" | null;

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  consentWeekly: boolean;
};

type TopAction = {
  id: string;
  title: string;
  why: string;
  because: string;
  effort: AuditCheck["effort"];
  impact: AuditCheck["impact"];
  upliftLow: number;
  upliftHigh: number;
  diyHref: string;
};

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatCurrency(value: number) {
  return `£${Math.max(0, value).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

function ragBadgeClasses(rag: RAG) {
  if (rag === "green") {
    return "border-emerald-400/35 bg-emerald-500/15 text-emerald-200";
  }
  if (rag === "amber") {
    return "border-amber-400/35 bg-amber-500/15 text-amber-200";
  }
  return "border-rose-400/35 bg-rose-500/15 text-rose-200";
}

function ragFromScore(score: number): RAG {
  if (score >= 80) {
    return "green";
  }
  if (score >= 50) {
    return "amber";
  }
  return "red";
}

function toLeadFormState(lead: StoredLead | null, fallbackWebsite: string): LeadFormState {
  return {
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    businessName: lead?.businessName || "",
    website: lead?.website || fallbackWebsite,
    consentWeekly: Boolean(lead?.consentWeekly ?? false),
  };
}

function inferDefaultAssumptions(industry?: string) {
  const lower = (industry || "").toLowerCase();
  if (/(ecom|shop|store|retail|d2c)/.test(lower)) {
    return { visitors: 12000, conversionRate: 1.8, avgOrder: 82, label: "ecommerce baseline" };
  }
  if (/(local|service|trade|clinic|medical|dent|estate|beauty|legal)/.test(lower)) {
    return { visitors: 3600, conversionRate: 3.1, avgOrder: 420, label: "local/service baseline" };
  }
  return { visitors: 5200, conversionRate: 2.4, avgOrder: 260, label: "general baseline" };
}

function findDiyHref(category: AuditCheck["category"], audit: AuditResult) {
  const byCategory: Record<AuditCheck["category"], string[]> = {
    Speed: ["websitePro", "websiteStarter"],
    SEO: ["seoSprint", "websitePro"],
    Conversion: ["booking", "followUp", "websitePro"],
    Trust: ["websitePro", "crm", "chatbot"],
    Visibility: ["seoSprint", "websitePro", "analytics"],
  };

  for (const moduleId of byCategory[category]) {
    const found = audit.recommendedModules.find((item) => item.id === moduleId);
    if (found) {
      return found.href;
    }
  }

  return "/tools";
}

function buildTopActions(audit: AuditResult): TopAction[] {
  return audit.topFindings.slice(0, 3).map((finding, index) => {
    const impactBase = finding.impact === "High" ? 13 : finding.impact === "Med" ? 9 : 6;
    const effortModifier = finding.effort === "S" ? 2 : finding.effort === "M" ? 0 : -2;
    const upliftLow = clamp(Math.round(impactBase + finding.scoreDelta * 0.35 + effortModifier - index), 5, 28);
    const upliftHigh = clamp(upliftLow + (finding.impact === "High" ? 12 : 8), upliftLow + 4, 44);

    return {
      id: finding.id,
      title: finding.label,
      why: finding.fix || "Apply the fix to close this leak.",
      because: finding.evidence || "Signal-based issue detected in scan.",
      effort: finding.effort,
      impact: finding.impact,
      upliftLow,
      upliftHigh,
      diyHref: findDiyHref(finding.category, audit),
    };
  });
}

function businessImpactLine(check: AuditCheck) {
  if (check.impact === "High") {
    return "Likely affecting lead volume or close-rate in the current month.";
  }
  if (check.impact === "Med") {
    return "Likely reducing enquiry quality or slowing conversion speed.";
  }
  return "Lower direct impact, but contributes to cumulative funnel drag.";
}

export function WebsiteGrowthReport({ audit }: WebsiteGrowthReportProps) {
  const pathname = usePathname();
  const [toast, setToast] = useState<string | null>(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<LeadAction>(null);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [monthlyVisitorsInput, setMonthlyVisitorsInput] = useState("");
  const [conversionRateInput, setConversionRateInput] = useState("");
  const [avgOrderValueInput, setAvgOrderValueInput] = useState("");
  const [leadForm, setLeadForm] = useState<LeadFormState>(() => toLeadFormState(getStoredLead(), audit.url));

  const reportId = useMemo(
    () => `${audit.url}|${audit.generatedAt}|${audit.scores.overall}`,
    [audit.generatedAt, audit.scores.overall, audit.url],
  );

  const competitorString = useMemo(
    () => (audit.competitors?.length ? audit.competitors.map((item) => item.domain).join(",") : ""),
    [audit.competitors],
  );

  const reportSnapshot = useMemo(
    () => ({
      reportId,
      rid: reportId,
      url: audit.url,
      industry: audit.industry || "service",
      goal: audit.goal || "leads",
      scores: audit.scores,
      topFindings: audit.topFindings.map((finding) => ({
        label: finding.label,
        category: finding.category,
        status: finding.status,
        effort: finding.effort,
        impact: finding.impact,
        evidence: finding.evidence,
        fix: finding.fix,
      })),
      generatedAt: audit.generatedAt,
    }),
    [audit, reportId],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    window.localStorage.setItem("dba_last_audit_url", audit.url);
    setLeadForm((previous) => ({
      ...previous,
      website: previous.website || audit.url,
    }));
  }, [audit.url]);

  const queryBase = useMemo(() => {
    const params = new URLSearchParams({
      url: audit.url,
      industry: audit.industry || "service",
      goal: audit.goal || "leads",
    });
    if (competitorString) {
      params.set("competitors", competitorString);
    }
    return params;
  }, [audit.goal, audit.industry, audit.url, competitorString]);

  const reportQuery = queryBase.toString();

  const pdfQuery = useMemo(() => {
    const params = new URLSearchParams(queryBase);
    params.set("rid", reportId);
    return params.toString();
  }, [queryBase, reportId]);

  const buildPdfHref = useCallback(
    (businessName?: string) => {
      const params = new URLSearchParams(pdfQuery);
      if (businessName?.trim()) {
        params.set("businessName", businessName.trim());
      }
      return `/tools/website-audit/pdf?${params.toString()}`;
    },
    [pdfQuery],
  );

  const topActions = useMemo(() => buildTopActions(audit), [audit]);
  const customerChecks = useMemo(
    () => audit.checks.filter((check) => check.category === "Conversion" || check.category === "Trust"),
    [audit.checks],
  );
  const googleChecks = useMemo(
    () => audit.checks.filter((check) => check.category === "SEO" || check.category === "Visibility"),
    [audit.checks],
  );

  const defaults = useMemo(() => inferDefaultAssumptions(audit.industry), [audit.industry]);
  const visitorsRaw = Number(monthlyVisitorsInput);
  const conversionRaw = Number(conversionRateInput);
  const orderRaw = Number(avgOrderValueInput);

  const usingDefaultVisitors = !Number.isFinite(visitorsRaw) || visitorsRaw <= 0;
  const usingDefaultConversion = !Number.isFinite(conversionRaw) || conversionRaw <= 0;
  const usingDefaultAov = !Number.isFinite(orderRaw) || orderRaw <= 0;

  const visitors = usingDefaultVisitors ? defaults.visitors : visitorsRaw;
  const conversionRate = usingDefaultConversion ? defaults.conversionRate : conversionRaw;
  const avgOrderValue = usingDefaultAov ? defaults.avgOrder : orderRaw;

  const readinessScore = Math.round((audit.scores.seo + audit.scores.visibility) / 2);
  const uplift = useMemo(() => {
    const pressure = (100 - audit.scores.overall) / 100;
    const readiness = (100 - readinessScore) / 100;

    const lowPct = clamp(Math.round(7 + pressure * 15 + readiness * 10), 8, 32);
    const highPct = clamp(lowPct + Math.round(7 + pressure * 8), lowPct + 4, 46);

    const baselineLeads = visitors * (conversionRate / 100);
    const leadIncreaseLow = Math.round((baselineLeads * lowPct) / 100);
    const leadIncreaseHigh = Math.round((baselineLeads * highPct) / 100);

    return {
      lowPct,
      highPct,
      leadIncreaseLow,
      leadIncreaseHigh,
      revenueLow: Math.round(leadIncreaseLow * avgOrderValue),
      revenueHigh: Math.round(leadIncreaseHigh * avgOrderValue),
    };
  }, [audit.scores.overall, avgOrderValue, conversionRate, readinessScore, visitors]);

  const simulatorQuery = useMemo(() => {
    const params = new URLSearchParams({
      industry: audit.industry || "service",
      goal: audit.goal || "leads",
      readinessScore: String(readinessScore),
      topActions: topActions.map((item) => item.title).join("|"),
      rid: reportId,
    });

    if (!usingDefaultVisitors) {
      params.set("visitors", String(Math.round(visitors)));
    }
    if (!usingDefaultConversion) {
      params.set("conversionRate", String(Number(conversionRate.toFixed(2))));
    }
    if (!usingDefaultAov) {
      params.set("avgOrderValue", String(Math.round(avgOrderValue)));
    }

    return params.toString();
  }, [
    audit.goal,
    audit.industry,
    conversionRate,
    readinessScore,
    reportId,
    topActions,
    usingDefaultAov,
    usingDefaultConversion,
    usingDefaultVisitors,
    visitors,
    avgOrderValue,
  ]);

  const persistLeadAndReport = useCallback(
    async (lead: LeadFormState, source: string) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          businessName: lead.businessName,
          website: lead.website || audit.url,
          source,
          pagePath: pathname || "/",
          consentWeekly: lead.consentWeekly,
          auditReport: {
            ...reportSnapshot,
            assumptionsUsed: {
              visitors,
              conversionRate,
              avgOrderValue,
              baselineLabel: defaults.label,
              usedDefaults: {
                visitors: usingDefaultVisitors,
                conversionRate: usingDefaultConversion,
                avgOrderValue: usingDefaultAov,
              },
            },
          },
        }),
      });

      const data = (await response.json()) as { ok?: boolean; leadId?: string; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "lead-save-failed");
      }

      const storedLead: StoredLead = {
        leadId: data.leadId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        businessName: lead.businessName,
        website: lead.website || audit.url,
        consentWeekly: lead.consentWeekly,
      };
      storeLead(storedLead);
      return storedLead;
    },
    [
      audit.url,
      avgOrderValue,
      conversionRate,
      defaults.label,
      pathname,
      reportSnapshot,
      usingDefaultAov,
      usingDefaultConversion,
      usingDefaultVisitors,
      visitors,
    ],
  );

  useEffect(() => {
    const existingLead = requireLead();
    if (!existingLead || !existingLead.email || !emailIsValid(existingLead.email)) {
      return;
    }

    const savedKey = `dba_saved_report_${reportId}`;
    if (window.localStorage.getItem(savedKey) === "1") {
      return;
    }

    const payload = toLeadFormState(existingLead, audit.url);
    persistLeadAndReport(payload, "audit_results")
      .then(() => {
        window.localStorage.setItem(savedKey, "1");
      })
      .catch(() => {
        // best effort
      });
  }, [audit.url, persistLeadAndReport, reportId]);

  const copyShareLink = async () => {
    try {
      const shareLink = `${window.location.origin}/tools/website-audit/results?${reportQuery}`;
      await navigator.clipboard.writeText(shareLink);
      setToast("Share link copied.");
    } catch {
      setToast("Could not copy. Please copy from your address bar.");
    }
  };

  const runDirectAction = async (action: Exclude<LeadAction, null>, lead: StoredLead) => {
    const payload = toLeadFormState(lead, audit.url);
    const needsStrictLead = action === "pdf";
    const missingIdentity =
      !payload.email ||
      !emailIsValid(payload.email) ||
      (needsStrictLead && (!payload.name.trim() || !payload.businessName.trim()));

    if (missingIdentity) {
      setPendingAction(action);
      setLeadForm(payload);
      setLeadModalOpen(true);
      return;
    }

    try {
      await persistLeadAndReport(payload, action === "email" ? "email_report" : "pdf_export");
      if (action === "email") {
        setToast("Report linked to your email. Delivery workflow is now ready.");
        return;
      }
      window.location.href = buildPdfHref(payload.businessName);
    } catch {
      setToast("Could not save lead details right now. Please try again.");
    }
  };

  const requireLeadForAction = async (action: Exclude<LeadAction, null>) => {
    const lead = requireLead();
    if (!lead) {
      setPendingAction(action);
      setLeadForm(toLeadFormState(null, audit.url));
      setLeadModalOpen(true);
      return;
    }
    await runDirectAction(action, lead);
  };

  const submitLeadGate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingAction) {
      return;
    }

    if (!leadForm.email.trim() || !emailIsValid(leadForm.email.trim())) {
      setToast("Please enter a valid email.");
      return;
    }

    if (pendingAction === "pdf" && (!leadForm.name.trim() || !leadForm.businessName.trim())) {
      setToast("For PDF export, add your name and business name.");
      return;
    }

    setLeadSubmitting(true);
    try {
      await persistLeadAndReport(leadForm, pendingAction === "email" ? "email_report" : "pdf_export");
      setLeadModalOpen(false);
      if (pendingAction === "email") {
        setToast("Thanks. The report is linked to your contact details.");
      } else {
        window.location.href = buildPdfHref(leadForm.businessName);
      }
      setPendingAction(null);
    } catch {
      setToast("Could not save your details. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const categoryTiles: Array<{ label: string; score: number; key: keyof AuditScores }> = [
    { label: "Speed", score: audit.scores.speed, key: "speed" },
    { label: "SEO", score: audit.scores.seo, key: "seo" },
    { label: "Conversion", score: audit.scores.conversion, key: "conversion" },
    { label: "Trust", score: audit.scores.trust, key: "trust" },
    { label: "Visibility", score: audit.scores.visibility, key: "visibility" },
  ];

  return (
    <div className="space-y-6">
      <MotionReveal>
        <section className="rounded-2xl border border-cyan-500/35 bg-[linear-gradient(155deg,rgba(34,211,238,0.12),rgba(15,23,42,0.95))] p-5 md:p-6">
          <div className="grid gap-4 xl:grid-cols-[0.74fr_1.26fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Overall audit score</p>
              <MetricRing value={audit.scores.overall} className="mx-auto mt-2" />
              <p className="mt-2 text-center text-xs text-slate-300">
                {audit.url}
              </p>
              <p className="mt-3 text-sm text-slate-200">{audit.narrative.executiveSummary}</p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {categoryTiles.map((tile) => {
                  const rag = ragFromScore(tile.score);
                  return (
                    <article key={tile.key} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <p className="text-[11px] text-slate-400">{tile.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{tile.score}</p>
                      <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${ragBadgeClasses(rag)}`}>
                        {rag}
                      </span>
                    </article>
                  );
                })}
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-slate-950/75 p-3">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan-200 uppercase">Report actions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-slate-700 bg-slate-900/75 text-slate-100 hover:bg-slate-800"
                    onClick={copyShareLink}
                  >
                    <Copy className="size-3.5" />
                    Copy share link
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-slate-700 bg-slate-900/75 text-slate-100 hover:bg-slate-800"
                    onClick={() => requireLeadForAction("pdf")}
                  >
                    <FileDown className="size-3.5" />
                    Download PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-slate-700 bg-slate-900/75 text-slate-100 hover:bg-slate-800"
                    onClick={() => requireLeadForAction("email")}
                  >
                    <Mail className="size-3.5" />
                    Email me this report
                  </Button>
                </div>
                {toast ? <p className="mt-2 text-xs text-cyan-200">{toast}</p> : null}
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Speed & Page Experience</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <h2 className="text-lg font-semibold text-white">What customers feel on first visit</h2>
              <p className="mt-2 text-sm text-slate-300">
                {audit.scores.speed >= 80
                  ? "Your loading experience is mostly healthy, but you can still tighten conversion pages for better response speed."
                  : audit.scores.speed >= 55
                    ? "Page speed is acceptable but inconsistent. Faster rendering and lighter payloads should improve enquiry conversion."
                    : "Page speed is currently a high-friction point. Slow first impression and interaction latency are likely costing enquiries."}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-200">
                <li>Scripts detected: {audit.pageExperience.scriptCount}</li>
                <li>Images detected: {audit.pageExperience.imageCount}</li>
                <li>DOM estimate: {audit.pageExperience.domEstimate}</li>
                <li>Complexity index: {audit.pageExperience.estimatedLoadComplexity}/100</li>
                {typeof audit.pageExperience.psiPerformance === "number" ? (
                  <li>PageSpeed mobile: {audit.pageExperience.psiPerformance}/100</li>
                ) : (
                  <li>PageSpeed API not configured. Using deterministic fallback heuristic.</li>
                )}
                {typeof audit.pageExperience.lcpMs === "number" ? <li>LCP: {audit.pageExperience.lcpMs}ms</li> : null}
                {typeof audit.pageExperience.cls === "number" ? <li>CLS: {audit.pageExperience.cls}</li> : null}
                {typeof audit.pageExperience.inpMs === "number" ? <li>INP: {audit.pageExperience.inpMs}ms</li> : null}
              </ul>
            </div>

            <div className="space-y-2">
              {audit.checks
                .filter((check) => check.category === "Speed")
                .map((check) => (
                  <article key={check.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{check.label}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${ragBadgeClasses(check.status)}`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">{check.evidence}</p>
                    <p className="mt-1 text-xs text-slate-400">Fix: {check.fix}</p>
                  </article>
                ))}
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Google & Search Readiness</p>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Search readiness score</p>
              <p className="text-sm font-semibold text-white">{readinessScore}/100</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">What Google sees</p>
              <div className="mt-2 space-y-2">
                {googleChecks.map((check) => (
                  <div key={check.id} className="rounded-lg border border-slate-800 bg-slate-900/65 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{check.label}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${ragBadgeClasses(check.status)}`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">{check.evidence}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">What customers see</p>
              <div className="mt-2 space-y-2">
                {customerChecks.map((check) => (
                  <div key={check.id} className="rounded-lg border border-slate-800 bg-slate-900/65 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{check.label}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${ragBadgeClasses(check.status)}`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">{check.evidence}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Authority + Visibility Baseline</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Backlinks / authority (baseline)</p>
              <p className="mt-2 text-sm text-slate-300">
                {audit.checks.find((check) => check.id === "authority-baseline")?.evidence || "Baseline authority signals not available."}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Backlinks data not connected. Connect Ahrefs / Search Console (coming soon). Until connected, this uses on-page authority readiness heuristics only.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-slate-200">Authority readiness: {audit.scores.visibility}/100</span>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-slate-200">Provider: Not connected</span>
              </div>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Social + local visibility signals</p>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {[
                  { label: "Instagram", value: audit.visibilitySignals.socialLinks.instagram },
                  { label: "Facebook", value: audit.visibilitySignals.socialLinks.facebook },
                  { label: "LinkedIn", value: audit.visibilitySignals.socialLinks.linkedin },
                  { label: "TikTok", value: audit.visibilitySignals.socialLinks.tiktok },
                  { label: "YouTube", value: audit.visibilitySignals.socialLinks.youtube },
                  { label: "Google Business hint", value: audit.visibilitySignals.hasGoogleBusinessHint },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/65 p-2.5">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className={item.value ? "text-sm font-semibold text-emerald-300" : "text-sm font-semibold text-amber-200"}>
                      {item.value ? "Found" : "Not found"}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Top 10 findings</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Consultant priority table</h2>
            </div>
            <p className="max-w-md text-xs text-slate-400">Severity + impact sorted. Start with red/high items first for fastest commercial lift.</p>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[1080px] border-collapse text-sm">
              <thead className="bg-slate-950/90 text-left text-xs text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Finding</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Effort</th>
                  <th className="px-3 py-2 font-medium">Impact</th>
                  <th className="px-3 py-2 font-medium">Why it matters</th>
                  <th className="px-3 py-2 font-medium">Business impact</th>
                  <th className="px-3 py-2 font-medium">Fix</th>
                </tr>
              </thead>
              <tbody>
                {audit.topFindings.map((finding) => (
                  <tr key={finding.id} className="border-t border-slate-800 bg-slate-950/55 align-top">
                    <td className="px-3 py-2 font-medium text-slate-100">{finding.label}</td>
                    <td className="px-3 py-2 text-slate-300">{finding.category}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${ragBadgeClasses(finding.status)}`}>
                        {finding.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-300">{finding.effort}</td>
                    <td className="px-3 py-2 text-slate-300">{finding.impact}</td>
                    <td className="px-3 py-2 text-xs text-slate-300">{finding.evidence || "Signal-based issue detected in scan."}</td>
                    <td className="px-3 py-2 text-xs text-slate-300">{businessImpactLine(finding)}</td>
                    <td className="px-3 py-2 text-xs text-slate-300">{finding.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Competitor benchmark</p>
          {audit.competitors?.length ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {audit.competitors.map((competitor) => (
                <article key={competitor.domain} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm font-semibold text-white">{competitor.domain}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border border-slate-800 bg-slate-900/70 p-2">
                      <p className="text-slate-400">Overall</p>
                      <p className="font-semibold text-slate-100">{competitor.scores.overall}</p>
                    </div>
                    <div className="rounded-md border border-slate-800 bg-slate-900/70 p-2">
                      <p className="text-slate-400">Speed</p>
                      <p className="font-semibold text-slate-100">{competitor.scores.speed}</p>
                    </div>
                    <div className="rounded-md border border-slate-800 bg-slate-900/70 p-2">
                      <p className="text-slate-400">SEO</p>
                      <p className="font-semibold text-slate-100">{competitor.scores.seo}</p>
                    </div>
                    <div className="rounded-md border border-slate-800 bg-slate-900/70 p-2">
                      <p className="text-slate-400">Conversion</p>
                      <p className="font-semibold text-slate-100">{competitor.scores.conversion}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-cyan-200 uppercase">They win because</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-300">
                      {competitor.topWins.length ? (
                        competitor.topWins.map((item) => <li key={item}>• {item}</li>)
                      ) : (
                        <li>• No major category advantage detected.</li>
                      )}
                    </ul>
                  </div>
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-cyan-200 uppercase">You are stronger in</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-300">
                      {competitor.topGaps.length ? (
                        competitor.topGaps.map((item) => <li key={item}>• {item}</li>)
                      ) : (
                        <li>• No clear category advantage yet.</li>
                      )}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              Add up to 3 competitor URLs on the scan form to benchmark this report against real alternatives in your market.
            </div>
          )}
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Recommended modules</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Open the exact modules that fix what we found</h2>
          <div className="mt-4 -mx-1 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-3 px-1">
              {audit.recommendedModules.slice(0, 6).map((module) => (
                <article key={module.id} className="w-[270px] rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                  <p className="text-[11px] text-cyan-200">{module.priceLabel}</p>
                  <h3 className="mt-1 text-base font-semibold text-white">{module.title}</h3>
                  <p className="mt-2 text-xs text-slate-300">{module.why}</p>
                  <p className="mt-2 text-xs text-slate-400">{module.phase}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button asChild size="sm" variant="outline" className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800">
                      <Link href={module.href}>Open the module that fixes this</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                      <Link
                        href={`/bespoke-plan?track=track1&website=${encodeURIComponent(audit.url)}&industry=${encodeURIComponent(
                          audit.industry || "service",
                        )}&goal=${encodeURIComponent(audit.goal || "leads")}&module=${encodeURIComponent(module.title)}`}
                      >
                        Done-for-you implementation
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-cyan-500/30 bg-[linear-gradient(155deg,rgba(34,211,238,0.1),rgba(2,6,23,0.94))] p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Action plan</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Top 3 actions to close revenue leaks</h2>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {topActions.map((action, index) => (
              <article key={`${action.id}-${index}`} className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Action {index + 1}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{action.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{action.why}</p>
                <p className="mt-2 text-xs text-slate-400">Because we detected: {action.because}</p>
                <p className="mt-2 text-xs text-cyan-200">Estimated uplift: +{action.upliftLow}% to +{action.upliftHigh}%</p>
                <div className="mt-3 flex flex-col gap-2">
                  <Button asChild size="sm" variant="outline" className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800">
                    <Link href={action.diyHref}>DIY (Track 2)</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                    <Link
                      href={`/bespoke-plan?track=track1&website=${encodeURIComponent(audit.url)}&industry=${encodeURIComponent(
                        audit.industry || "service",
                      )}&goal=${encodeURIComponent(audit.goal || "leads")}&module=${encodeURIComponent(action.title)}`}
                    >
                      Done-for-you (Track 1)
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Projected uplift</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Estimate monthly lead + revenue lift</h2>
          <p className="mt-2 text-sm text-slate-300">Assumptions are adjustable. This is a planning model, not a guarantee.</p>

          <p className="mt-3 text-xs text-slate-300">
            Assumptions used: Visitors {visitors.toLocaleString("en-GB")} ({usingDefaultVisitors ? "default" : "custom"}) · Conv {conversionRate.toFixed(1)}% ({usingDefaultConversion ? "default" : "custom"}) · AOV {formatCurrency(avgOrderValue)} ({usingDefaultAov ? "default" : "custom"})
          </p>

          <button
            type="button"
            onClick={() => setAssumptionsOpen((previous) => !previous)}
            className="mt-2 text-xs font-semibold text-cyan-300 underline-offset-2 hover:text-cyan-200 hover:underline"
          >
            {assumptionsOpen ? "Hide assumptions editor" : "Edit assumptions"}
          </button>

          {assumptionsOpen ? (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Monthly visitors</label>
                <input
                  value={monthlyVisitorsInput}
                  onChange={(event) => setMonthlyVisitorsInput(event.target.value)}
                  inputMode="numeric"
                  className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                  placeholder={String(defaults.visitors)}
                />
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Conversion rate (%)</label>
                <input
                  value={conversionRateInput}
                  onChange={(event) => setConversionRateInput(event.target.value)}
                  inputMode="decimal"
                  className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                  placeholder={String(defaults.conversionRate)}
                />
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Average order value</label>
                <input
                  value={avgOrderValueInput}
                  onChange={(event) => setAvgOrderValueInput(event.target.value)}
                  inputMode="numeric"
                  className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                  placeholder={String(defaults.avgOrder)}
                />
              </article>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Projected lead uplift</p>
              <p className="mt-2 text-lg font-semibold text-white">+{uplift.leadIncreaseLow.toLocaleString("en-GB")} to +{uplift.leadIncreaseHigh.toLocaleString("en-GB")} leads/mo</p>
              <p className="mt-1 text-xs text-slate-400">Range: +{uplift.lowPct}% to +{uplift.highPct}%</p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Projected revenue uplift</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(uplift.revenueLow)} to {formatCurrency(uplift.revenueHigh)}/mo</p>
              <p className="mt-1 text-xs text-slate-400">If you deploy only the top 1-2 actions first, you typically see the fastest lift.</p>
            </article>
          </div>

          <Button asChild className="mt-4 bg-cyan-300 text-slate-950 hover:bg-cyan-200">
            <Link href={`/growth-simulator?${simulatorQuery}`}>Project my revenue uplift</Link>
          </Button>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">What to do next</p>
          <p className="mt-2 text-sm text-slate-300">{audit.narrative.whyItMatters}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-200">
            {audit.narrative.nextSteps.slice(0, 6).map((step) => (
              <li key={step} className="list-disc pl-1 marker:text-cyan-300">{step}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href="/services" className="font-semibold text-cyan-300 hover:text-cyan-200">View services</Link>
            <span className="text-slate-600">•</span>
            <Link href={`/bespoke-plan?track=track1&website=${encodeURIComponent(audit.url)}`} className="font-semibold text-cyan-300 hover:text-cyan-200">
              Build bespoke plan
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/tools/website-audit/start" className="font-semibold text-cyan-300 hover:text-cyan-200">Run another scan</Link>
          </div>
        </section>
      </MotionReveal>

      {leadModalOpen ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl shadow-cyan-950/40">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Save your report details</h3>
              <button
                type="button"
                className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:text-white"
                onClick={() => {
                  setLeadModalOpen(false);
                  setPendingAction(null);
                }}
              >
                Close
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">For PDF export we require name, business name, and email. Phone is optional.</p>

            <form onSubmit={submitLeadGate} className="mt-4 space-y-3">
              <input
                value={leadForm.name}
                onChange={(event) => setLeadForm((previous) => ({ ...previous, name: event.target.value }))}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                placeholder="Your name"
              />
              <input
                value={leadForm.businessName}
                onChange={(event) => setLeadForm((previous) => ({ ...previous, businessName: event.target.value }))}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                placeholder="Business name"
              />
              <input
                value={leadForm.email}
                onChange={(event) => setLeadForm((previous) => ({ ...previous, email: event.target.value }))}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                placeholder="Email"
                type="email"
                required
              />
              <input
                value={leadForm.phone}
                onChange={(event) => setLeadForm((previous) => ({ ...previous, phone: event.target.value }))}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                placeholder="Phone (optional)"
              />
              <label className="flex items-start gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={leadForm.consentWeekly}
                  onChange={(event) => setLeadForm((previous) => ({ ...previous, consentWeekly: event.target.checked }))}
                  className="mt-0.5"
                />
                Yes — send occasional practical growth updates.
              </label>
              <Button type="submit" className="w-full" disabled={leadSubmitting}>
                {leadSubmitting ? "Saving..." : pendingAction === "pdf" ? "Save and continue to PDF" : "Save details"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
