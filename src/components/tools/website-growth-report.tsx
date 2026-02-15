"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bolt,
  Bot,
  CalendarClock,
  CheckCircle2,
  Copy,
  FileDown,
  Mail,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
  Wrench,
} from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Button } from "@/components/ui/button";
import { getStoredLead, requireLead, storeLead, type StoredLead } from "@/lib/leads/client";
import { buildGrowthAuditReport, type LiveAuditSignal } from "@/lib/scans/growth-audit-report";
import { buildBusinessSnapshot, buildReportTopActions } from "@/lib/scans/report-plan";
import { MetricRing } from "@/components/visuals/metric-ring";
import { OsMap } from "@/components/visuals/os-map";
import { ScanTimeline } from "@/components/visuals/scan-timeline";

type WebsiteGrowthReportProps = {
  url: string;
  industry?: string;
  goal?: string;
  liveSignal?: LiveAuditSignal | null;
};

type LeadAction = "email" | "pdf" | null;

const timelineSteps = ["Speed", "SEO", "Conversion", "Trust"];

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatCurrency(value: number) {
  return `£${Math.max(0, value).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

type MatrixQuadrant = "high-low" | "high-high" | "low-low" | "low-high";

type PriorityAction = {
  label: string;
  quadrant: MatrixQuadrant;
};

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  consentWeekly: boolean;
};

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

export function WebsiteGrowthReport({ url, industry, goal, liveSignal = null }: WebsiteGrowthReportProps) {
  const pathname = usePathname();
  const [activeStep, setActiveStep] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<LeadAction>(null);
  const [leadForm, setLeadForm] = useState<LeadFormState>(() => toLeadFormState(getStoredLead(), url));
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [monthlyVisitorsInput, setMonthlyVisitorsInput] = useState("");
  const [conversionRateInput, setConversionRateInput] = useState("");
  const [avgOrderValueInput, setAvgOrderValueInput] = useState("");

  const report = useMemo(() => buildGrowthAuditReport({ url, industry, goal }, { liveSignal }), [url, industry, goal, liveSignal]);
  const reportId = useMemo(
    () => `${report.normalizedUrl}|${industry || "service"}|${goal || "leads"}|${report.score}`,
    [goal, industry, report.normalizedUrl, report.score],
  );

  const reportSnapshot = useMemo(
    () => ({
      reportId,
      rid: reportId,
      url: report.normalizedUrl,
      industry: industry || "service",
      goal: goal || "leads",
      scores: {
        overall: report.score,
        speed: report.speedScore,
        seo: report.seoScore,
        conversion: report.conversionScore,
        trust: report.trustScore,
      },
      topLeaks: report.topLeaks.map((leak) => ({
        title: leak.title,
        estimatedImpact: leak.estimatedImpact,
        fix: leak.fix,
      })),
      recommendedModules: report.recommendedModules.map((module) => ({
        title: module.title,
        phase: module.phase,
        href: module.href,
      })),
      topActions: buildReportTopActions(report).map((action) => ({
        title: action.title,
        becauseDetected: action.becauseDetected,
        upliftRange: action.upliftRange,
      })),
      generatedAt: new Date().toISOString(),
    }),
    [goal, industry, report, reportId],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((previous) => {
        if (previous >= timelineSteps.length - 1) {
          window.clearInterval(interval);
          window.setTimeout(() => setShowReport(true), 280);
          return previous;
        }
        return previous + 1;
      });
    }, 520);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    window.localStorage.setItem("dba_last_audit_url", report.normalizedUrl);
    setLeadForm((previous) => ({
      ...previous,
      website: previous.website || report.normalizedUrl,
    }));
  }, [report.normalizedUrl]);

  const reportQuery = new URLSearchParams({
    url: report.normalizedUrl,
    industry: industry || "General",
    goal: goal || "All of it",
  }).toString();

  const bookQuery = new URLSearchParams({
    source: "track2-audit",
    website: report.normalizedUrl,
    industry: industry || "General",
    goal: goal || "All of it",
    score: String(report.score),
  }).toString();

  const pdfQuery = new URLSearchParams({
    url: report.normalizedUrl,
    industry: industry || "service",
    goal: goal || "leads",
    rid: reportId,
  }).toString();

  const industryLower = (industry || "").toLowerCase();
  const goalLower = (goal || "").toLowerCase();
  const isEcom = /(ecom|e-commerce|shop|store|retail|d2c)/.test(industryLower);
  const isLocalOrService = /(local|service|trade|clinic|medical|dent|estate|beauty|plumb|electric)/.test(industryLower);
  const focusesLeads = /(lead|enquir|inbound|contact)/.test(goalLower);
  const focusesSales = /(sale|sales|checkout|order|pricing|revenue)/.test(goalLower);
  const industryForSimulator = isEcom ? "ecom" : isLocalOrService ? "local" : "service";

  const categoryScores = [
    { key: "speed", label: "speed", value: report.speedScore },
    { key: "seo", label: "SEO", value: report.seoScore },
    { key: "conversion", label: "conversion", value: report.conversionScore },
    { key: "trust", label: "trust", value: report.trustScore },
  ].sort((a, b) => a.value - b.value);

  const upsideMin = Math.max(8, Math.round((100 - report.score) * 0.35));
  const upsideMax = upsideMin + Math.max(6, Math.round((100 - report.score) * 0.2));
  const searchReadiness = report.liveSignal?.summaryScore ?? Math.round((report.seoScore + report.trustScore) / 2);
  const businessSnapshot = useMemo(() => buildBusinessSnapshot(report.normalizedUrl, report.liveSignal), [report.liveSignal, report.normalizedUrl]);

  const aiEmployeeSummary = {
    found: `Your biggest constraint is ${categoryScores[0].label} (${categoryScores[0].value}/100), with ${report.topLeaks[0]?.title.toLowerCase() || "conversion leakage"} showing first.`,
    fixFirst: report.quickWins[0] || "Tighten your offer and CTA hierarchy so high-intent visitors can act immediately.",
    automate: `Automate ${report.recommendedModules.slice(0, 2).map((module) => module.title).join(" + ")} to reduce manual follow-up and protect every enquiry.`,
    upside: `If top priorities are implemented well, your booking performance could improve by roughly +${upsideMin}% to +${upsideMax}% over the next cycle.`,
  };

  const priorityActions: PriorityAction[] = useMemo(() => {
    const actions: PriorityAction[] = [
      { label: "Speed compression sprint", quadrant: "high-low" },
      { label: "Hero offer + CTA rewrite", quadrant: "high-low" },
      { label: "CRM follow-up automation", quadrant: "high-high" },
      { label: "FAQ clarity pass", quadrant: "low-low" },
      { label: "Full template redesign", quadrant: "low-high" },
    ];

    if (isEcom) {
      actions.push({ label: "Checkout friction fixes", quadrant: "high-high" });
      actions.push({ label: "PDP trust messaging", quadrant: "high-low" });
    }

    if (isLocalOrService) {
      actions.push({ label: "Call + WhatsApp quick actions", quadrant: "high-low" });
      actions.push({ label: "Map-pack review push", quadrant: "high-high" });
    }

    if (focusesLeads) {
      actions.push({ label: "Shorter lead forms", quadrant: "high-low" });
    }

    if (focusesSales) {
      actions.push({ label: "Pricing clarity blocks", quadrant: "high-low" });
    }

    return Array.from(new Map(actions.map((action) => [action.label, action])).values()).slice(0, 6);
  }, [focusesLeads, focusesSales, isEcom, isLocalOrService]);

  const topActions = useMemo(() => buildReportTopActions(report), [report]);

  const projectedDefaults = useMemo(() => {
    if (isEcom) {
      return { visitors: 12000, conversionRate: 1.8, avgOrder: 82, label: "ecommerce baseline" };
    }
    if (isLocalOrService) {
      return { visitors: 3600, conversionRate: 3.2, avgOrder: 420, label: "local/service baseline" };
    }
    return { visitors: 5200, conversionRate: 2.4, avgOrder: 260, label: "general baseline" };
  }, [isEcom, isLocalOrService]);

  const visitorsValueRaw = Number(monthlyVisitorsInput);
  const conversionRateRaw = Number(conversionRateInput);
  const avgOrderValueRaw = Number(avgOrderValueInput);
  const usingDefaultVisitors = !Number.isFinite(visitorsValueRaw) || visitorsValueRaw <= 0;
  const usingDefaultConversion = !Number.isFinite(conversionRateRaw) || conversionRateRaw <= 0;
  const usingDefaultAvgOrder = !Number.isFinite(avgOrderValueRaw) || avgOrderValueRaw <= 0;
  const monthlyVisitors = usingDefaultVisitors ? projectedDefaults.visitors : visitorsValueRaw;
  const conversionRate = usingDefaultConversion ? projectedDefaults.conversionRate : conversionRateRaw;
  const avgOrderValue = usingDefaultAvgOrder ? projectedDefaults.avgOrder : avgOrderValueRaw;

  const projectedUplift = useMemo(() => {
    const readinessPenalty = (100 - searchReadiness) / 100;
    const scorePenalty = (100 - report.score) / 100;
    const lowLeadUpliftPct = clamp(Math.round(8 + readinessPenalty * 12 + scorePenalty * 10), 8, 30);
    const highLeadUpliftPct = clamp(lowLeadUpliftPct + Math.round(7 + scorePenalty * 8), lowLeadUpliftPct + 4, 45);
    const baselineLeads = monthlyVisitors * (conversionRate / 100);
    const leadIncreaseLow = Math.round((baselineLeads * lowLeadUpliftPct) / 100);
    const leadIncreaseHigh = Math.round((baselineLeads * highLeadUpliftPct) / 100);
    const revenueIncreaseLow = Math.round(leadIncreaseLow * avgOrderValue);
    const revenueIncreaseHigh = Math.round(leadIncreaseHigh * avgOrderValue);

    return {
      lowLeadUpliftPct,
      highLeadUpliftPct,
      leadIncreaseLow,
      leadIncreaseHigh,
      revenueIncreaseLow,
      revenueIncreaseHigh,
    };
  }, [avgOrderValue, conversionRate, monthlyVisitors, report.score, searchReadiness]);

  const simulatorQuery = useMemo(() => {
    const params = new URLSearchParams({
      industry: industryForSimulator,
      goal: goal || "leads",
      readinessScore: String(searchReadiness),
      topActions: topActions.map((action) => action.title).join("|"),
      rid: reportId,
    });
    if (!usingDefaultVisitors) {
      params.set("visitors", String(Math.round(monthlyVisitors)));
    }
    if (!usingDefaultConversion) {
      params.set("conversionRate", String(Number(conversionRate.toFixed(2))));
    }
    if (!usingDefaultAvgOrder) {
      params.set("avgOrderValue", String(Math.round(avgOrderValue)));
    }
    return params.toString();
  }, [
    avgOrderValue,
    conversionRate,
    goal,
    industryForSimulator,
    monthlyVisitors,
    reportId,
    searchReadiness,
    topActions,
    usingDefaultAvgOrder,
    usingDefaultConversion,
    usingDefaultVisitors,
  ]);

  const persistLeadAndReport = useCallback(async (lead: LeadFormState, source: string) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        businessName: lead.businessName,
        website: lead.website || report.normalizedUrl,
        source,
        pagePath: pathname || "/",
        consentWeekly: lead.consentWeekly,
        auditReport: reportSnapshot,
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
      website: lead.website || report.normalizedUrl,
      consentWeekly: lead.consentWeekly,
    };
    storeLead(storedLead);
    return storedLead;
  }, [pathname, report.normalizedUrl, reportSnapshot]);

  useEffect(() => {
    if (!showReport) {
      return;
    }
    const lead = requireLead();
    if (!lead) {
      return;
    }

    const savedKey = `dba_saved_report_${reportId}`;
    if (window.localStorage.getItem(savedKey) === "1") {
      return;
    }

    const payload: LeadFormState = toLeadFormState(lead, report.normalizedUrl);
    const email = payload.email.trim();
    if (!email || !emailIsValid(email)) {
      return;
    }

    persistLeadAndReport(payload, "audit_results")
      .then(() => {
        window.localStorage.setItem(savedKey, "1");
      })
      .catch(() => {
        // silent; this sync is best-effort
      });
  }, [persistLeadAndReport, report.normalizedUrl, reportId, showReport]);

  const copyShareLink = async () => {
    try {
      const shareLink = `${window.location.origin}/tools/website-audit/results?${reportQuery}`;
      await navigator.clipboard.writeText(shareLink);
      setToast("Share link copied.");
    } catch {
      setToast("Could not copy link. Please copy from your browser address bar.");
    }
  };

  const runDirectAction = async (action: Exclude<LeadAction, null>, lead: StoredLead) => {
    const payload = toLeadFormState(lead, report.normalizedUrl);
    const needsFullIdentity = action === "pdf";
    const missingIdentity =
      !payload.email ||
      !emailIsValid(payload.email) ||
      (needsFullIdentity && (!payload.name.trim() || !payload.businessName.trim()));
    if (missingIdentity) {
      setPendingAction(action);
      setLeadForm(payload);
      setLeadModalOpen(true);
      return;
    }

    try {
      await persistLeadAndReport(payload, action === "email" ? "email_report" : "pdf_export");
      if (action === "email") {
        setToast("Report saved to your lead profile. Email delivery is now enabled.");
        return;
      }
      window.location.href = `/tools/website-audit/pdf?${pdfQuery}`;
    } catch {
      setToast("Could not save lead details right now. Please try again.");
    }
  };

  const requireLeadForAction = async (action: Exclude<LeadAction, null>) => {
    const lead = requireLead();
    if (!lead) {
      setPendingAction(action);
      setLeadForm(toLeadFormState(null, report.normalizedUrl));
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
      setToast("For PDF export, please add your name and business name.");
      return;
    }

    setLeadSubmitting(true);
    try {
      await persistLeadAndReport(leadForm, pendingAction === "email" ? "email_report" : "pdf_export");
      setLeadModalOpen(false);
      if (pendingAction === "email") {
        setToast("Thanks. Your report is saved and linked to your email.");
      } else {
        window.location.href = `/tools/website-audit/pdf?${pdfQuery}`;
      }
      setPendingAction(null);
    } catch {
      setToast("Could not save your details right now. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showReport ? (
        <ScanTimeline steps={timelineSteps} activeStep={activeStep} />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
            <MotionReveal>
              <div className="rounded-2xl border border-cyan-500/35 bg-[linear-gradient(155deg,rgba(34,211,238,0.12),rgba(15,23,42,0.95))] p-5 md:p-6">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Growth Score</p>
                <MetricRing value={report.score} className="mx-auto" />
                <p className="mt-3 text-center text-xs text-slate-300">
                  Score for <span className="font-semibold text-slate-100">{report.normalizedUrl}</span>
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    { label: "Speed", value: report.speedScore },
                    { label: "SEO", value: report.seoScore },
                    { label: "Conversion", value: report.conversionScore },
                    { label: "Trust", value: report.trustScore },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                      <p className="text-[11px] text-cyan-200">{item.label}</p>
                      <p className="text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-cyan-500/30 bg-[linear-gradient(155deg,rgba(34,211,238,0.1),rgba(2,6,23,0.95))] p-3 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan-200 uppercase">Report actions</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-slate-700 bg-slate-950/75 text-slate-100 backdrop-blur hover:bg-slate-900"
                      onClick={copyShareLink}
                    >
                      <Copy className="size-3.5" />
                      Copy share link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-slate-700 bg-slate-950/75 text-slate-100 backdrop-blur hover:bg-slate-900"
                      onClick={() => requireLeadForAction("pdf")}
                    >
                      <FileDown className="size-3.5" />
                      Export PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-slate-700 bg-slate-950/75 text-slate-100 backdrop-blur hover:bg-slate-900"
                      onClick={() => requireLeadForAction("email")}
                    >
                      <Mail className="size-3.5" />
                      Email me this report
                    </Button>
                  </div>
                  {toast ? <p className="mt-2 text-xs text-cyan-200">{toast}</p> : null}
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.04}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Top 3 revenue leaks</p>
                <div className="mt-3 space-y-3">
                  {report.topLeaks.map((leak, index) => (
                    <article key={`${leak.category}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                      <h3 className="text-sm font-semibold text-white">{leak.title}</h3>
                      <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                        <li>
                          <span className="font-semibold text-cyan-200">What it is:</span> {leak.what}
                        </li>
                        <li>
                          <span className="font-semibold text-cyan-200">Why it loses bookings:</span> {leak.why}
                        </li>
                        <li>
                          <span className="font-semibold text-cyan-200">Fix:</span> {leak.fix}
                        </li>
                        <li>
                          <span className="font-semibold text-cyan-200">Estimated impact:</span> {leak.estimatedImpact}
                        </li>
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </MotionReveal>
          </div>

          <MotionReveal>
            <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Google-style checks</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Search Readiness</h2>
                <p className="text-sm font-semibold text-cyan-200">
                  {report.liveSignal ? `${report.liveSignal.summaryScore}/100` : "Unavailable"}
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400/90 via-cyan-300 to-teal-300 transition-all duration-700"
                  style={{ width: `${report.liveSignal?.summaryScore || 0}%` }}
                />
              </div>

              {report.liveSignal ? (
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  {report.liveSignal.checks.map((check) => (
                    <article key={check.label} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                      <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                        {check.pass ? (
                          <CheckCircle2 className="size-4 text-emerald-300" />
                        ) : (
                          <XCircle className="size-4 text-rose-300" />
                        )}
                        {check.label}
                      </p>
                      <p className={`mt-1 text-xs ${check.pass ? "text-slate-300" : "text-rose-200"}`}>{check.note}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-300">
                  Could not fetch live page HTML for this URL. Re-run the report on a publicly accessible HTTPS page to
                  view search readiness checks.
                </p>
              )}
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Business snapshot</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                  <p className="text-xs text-slate-400">Website</p>
                  <p className="mt-1 text-sm font-semibold text-white">{businessSnapshot.hostname}</p>
                  <p className="mt-2 text-xs text-slate-300">
                    HTTPS: <span className={businessSnapshot.isHttps ? "text-emerald-300" : "text-rose-300"}>{businessSnapshot.isHttps ? "Yes" : "No"}</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-300">Likely site type: {businessSnapshot.likelySiteType}</p>
                </article>
                <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                  <p className="text-xs text-slate-400">Detected title</p>
                  <p className="mt-1 text-sm text-slate-200">{businessSnapshot.titleText || "Not detected"}</p>
                  <p className="mt-2 text-xs text-slate-400">Detected H1</p>
                  <p className="mt-1 text-sm text-slate-200">{businessSnapshot.h1Text || "Not detected"}</p>
                </article>
              </div>
              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                <p className="text-xs text-slate-400">Contact page signals</p>
                <p className="mt-2 text-sm text-slate-200">
                  Email: {businessSnapshot.hasEmailContact ? "Detected" : "Missing"} · Phone: {businessSnapshot.hasPhoneContact ? "Detected" : "Missing"} ·
                  Address: {businessSnapshot.hasAddressSignal ? "Detected" : "Missing"}
                </p>
              </div>
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="rounded-2xl border border-cyan-500/30 bg-[linear-gradient(155deg,rgba(34,211,238,0.1),rgba(2,6,23,0.94))] p-5 md:p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Top 3 actions</p>
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">What to fix first for revenue impact</h2>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {topActions.map((action, index) => (
                  <article key={`${action.id}-${index}`} className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Action {index + 1}</p>
                    <h3 className="mt-1 text-base font-semibold text-white">{action.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{action.why}</p>
                    <p className="mt-2 text-xs text-slate-400">Because we detected: {action.becauseDetected}</p>
                    <p className="mt-2 text-xs text-slate-300">Why this matters for revenue: {action.revenueWhy}</p>
                    <p className="mt-2 text-xs text-cyan-200">Estimated uplift: {action.upliftRange}</p>
                    <div className="mt-3 flex flex-col gap-2">
                      <Button asChild size="sm" variant="outline" className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800">
                        <Link href={action.href}>DIY (Track 2)</Link>
                      </Button>
                      <Button asChild size="sm" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                        <Link
                          href={`/bespoke-plan?track=track1&website=${encodeURIComponent(report.normalizedUrl)}&industry=${encodeURIComponent(
                            industryForSimulator,
                          )}&goal=${encodeURIComponent(goal || "leads")}&module=${encodeURIComponent(action.title)}`}
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
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Estimated monthly upside from priority fixes</h2>
              <p className="mt-2 text-sm text-slate-300">
                This model uses your scan score plus baseline assumptions for your segment ({projectedDefaults.label}).
              </p>
              <p className="mt-3 text-xs text-slate-300">
                Assumptions used: Visitors {monthlyVisitors.toLocaleString("en-GB")} ({usingDefaultVisitors ? "default" : "custom"}) · Conv{" "}
                {conversionRate.toFixed(1)}% ({usingDefaultConversion ? "default" : "custom"}) · AOV {formatCurrency(avgOrderValue)} (
                {usingDefaultAvgOrder ? "default" : "custom"})
              </p>

              <button
                type="button"
                onClick={() => setAssumptionsOpen((previous) => !previous)}
                className="mt-3 text-xs font-semibold text-cyan-300 underline-offset-2 hover:text-cyan-200 hover:underline"
              >
                {assumptionsOpen ? "Hide assumption editor" : "Edit assumptions"}
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
                      placeholder={String(projectedDefaults.visitors)}
                    />
                  </article>
                  <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                    <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Conversion rate (%)</label>
                    <input
                      value={conversionRateInput}
                      onChange={(event) => setConversionRateInput(event.target.value)}
                      inputMode="decimal"
                      className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                      placeholder={String(projectedDefaults.conversionRate)}
                    />
                  </article>
                  <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                    <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Average order value</label>
                    <input
                      value={avgOrderValueInput}
                      onChange={(event) => setAvgOrderValueInput(event.target.value)}
                      inputMode="numeric"
                      className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                      placeholder={String(projectedDefaults.avgOrder)}
                    />
                  </article>
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Estimated lead increase</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    +{projectedUplift.leadIncreaseLow.toLocaleString("en-GB")} to +{projectedUplift.leadIncreaseHigh.toLocaleString("en-GB")} leads/mo
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Uplift range: +{projectedUplift.lowLeadUpliftPct}% to +{projectedUplift.highLeadUpliftPct}%
                  </p>
                </article>
                <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Estimated revenue increase</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {formatCurrency(projectedUplift.revenueIncreaseLow)} to {formatCurrency(projectedUplift.revenueIncreaseHigh)}/mo
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Model based on score pressure, readiness, and industry baseline assumptions.</p>
                </article>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Estimates only. Final results depend on implementation quality, traffic quality, offer strength, and follow-up execution.
              </p>
              <p className="mt-2 text-xs text-cyan-200">
                If you deploy only the top 1-2 actions first, you typically see the fastest lift.
              </p>

              <Button asChild className="mt-4 bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <Link href={`/growth-simulator?${simulatorQuery}`}>Project my revenue uplift</Link>
              </Button>
            </section>
          </MotionReveal>

          <div className="grid gap-4 xl:grid-cols-2">
            <MotionReveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">
                  <Bolt className="size-3.5" />
                  Quick wins (30-60 mins)
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {report.quickWins.map((item) => (
                    <li key={item} className="list-disc pl-1 marker:text-cyan-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.04}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">
                  <CalendarClock className="size-3.5" />
                  Bigger wins (1-2 weeks)
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {report.mediumWins.map((item) => (
                    <li key={item} className="list-disc pl-1 marker:text-cyan-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </MotionReveal>
          </div>

          <MotionReveal>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Business OS map snapshot</p>
              <p className="mt-1 text-sm text-slate-300">The implementation flow below is how we convert findings into measurable growth outcomes.</p>
              <OsMap className="mt-4" compact />
            </div>
          </MotionReveal>

          <MotionReveal>
            <div className="rounded-2xl border border-cyan-500/35 bg-[linear-gradient(145deg,rgba(34,211,238,0.14),rgba(15,23,42,0.96))] p-5 md:p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Recommended modules</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {report.recommendedModules.map((module, index) => (
                  <article key={`${module.id}-${index}`} className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                    <p className="text-[11px] text-cyan-200">{module.priceLabel}</p>
                    <h3 className="mt-1 text-base font-semibold text-white">{module.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{module.why}</p>
                    <Link href={module.href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                      View module
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </article>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4 text-xs">
                <Link href="/services" className="font-semibold text-cyan-300 hover:text-cyan-200">
                  Explore all service modules
                </Link>
                <span className="text-slate-500">•</span>
                <Link href={`/bespoke-plan?track=track2&website=${encodeURIComponent(report.normalizedUrl)}`} className="font-semibold text-cyan-300 hover:text-cyan-200">
                  Build bespoke plan from this audit
                </Link>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal>
            <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">
                Implementation plan (what we&apos;d do in 14 days)
              </p>
              <div className="mt-4 space-y-3">
                {report.recommendedModules.map((module, index) => (
                  <article key={`${module.id}-${module.phase}-${index}`} className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">
                      Step {index + 1} · {module.phase}
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{module.action}</p>
                    <Link href={module.href} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                      {module.title}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </article>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200 sm:flex-1">
                  <Link href={`/bespoke-plan?track=track1&website=${encodeURIComponent(report.normalizedUrl)}`}>Build my plan</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-800 sm:flex-1">
                  <Link href="/services">Start Track 1</Link>
                </Button>
              </div>
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Your AI Employee summary</p>
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">One operator view of what to do next</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">
                    <Target className="size-3.5" />
                    What we found
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{aiEmployeeSummary.found}</p>
                  {report.liveSignal ? (
                    <p className="mt-2 text-xs text-cyan-200">Real signal: {report.liveSignal.summary}</p>
                  ) : null}
                </article>
                <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">
                    <Wrench className="size-3.5" />
                    What to fix first
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{aiEmployeeSummary.fixFirst}</p>
                </article>
                <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">
                    <Bot className="size-3.5" />
                    What we can automate
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{aiEmployeeSummary.automate}</p>
                </article>
                <article className="rounded-xl border border-slate-800 bg-slate-950/72 p-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">
                    <TrendingUp className="size-3.5" />
                    Expected upside
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{aiEmployeeSummary.upside}</p>
                </article>
              </div>
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">
                <CheckCircle2 className="size-3.5" />
                Priority matrix (Impact × Effort)
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {[
                  { id: "high-low", title: "High impact · Low effort" },
                  { id: "high-high", title: "High impact · High effort" },
                  { id: "low-low", title: "Low impact · Low effort" },
                  { id: "low-high", title: "Low impact · High effort" },
                ].map((quadrant) => (
                  <article key={quadrant.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">{quadrant.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {priorityActions
                        .filter((action) => action.quadrant === quadrant.id)
                        .map((action) => (
                          <span key={action.label} className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                            {action.label}
                          </span>
                        ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Your best next step</p>
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Choose your path based on how hands-on you want to be</h2>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Track 2 · DIY</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Keep scanning and fix with guided tasks</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    <li className="list-disc pl-1 marker:text-cyan-300">Run additional scenarios to compare different goals and industries.</li>
                    <li className="list-disc pl-1 marker:text-cyan-300">Use guided priorities so your team fixes revenue leaks in order.</li>
                    <li className="list-disc pl-1 marker:text-cyan-300">Deploy modules only when the numbers justify the upgrade.</li>
                  </ul>
                  <Button asChild className="mt-4 w-full">
                    <Link href="/playground">Continue with guided scans</Link>
                  </Button>
                  <Link href="/tools" className="mt-3 inline-flex text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                    Explore all tools
                  </Link>
                </article>

                <article className="rounded-xl border border-cyan-500/35 bg-[linear-gradient(145deg,rgba(34,211,238,0.12),rgba(15,23,42,0.9))] p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Track 1 · Done-for-you</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">We implement and manage your growth system</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-100">
                    <li className="list-disc pl-1 marker:text-cyan-300">You get a bespoke implementation plan mapped to your audit findings.</li>
                    <li className="list-disc pl-1 marker:text-cyan-300">We deploy website, follow-up, and pipeline modules with clear ownership.</li>
                    <li className="list-disc pl-1 marker:text-cyan-300">You track outcomes with transparent priorities and measurable reporting.</li>
                  </ul>
                  <Button asChild className="mt-4 w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                    <Link href={`/bespoke-plan?track=track1&website=${encodeURIComponent(report.normalizedUrl)}`}>Build my done-for-you plan</Link>
                  </Button>
                  <Link href="/services" className="mt-3 inline-flex text-xs font-semibold text-cyan-200 hover:text-cyan-100">
                    View service modules
                  </Link>
                </article>
              </div>

              <p className="mt-4 text-sm text-slate-300">
                Not sure?{" "}
                <Link href={`/book?${bookQuery}`} className="font-semibold text-cyan-300 hover:text-cyan-200">
                  Book a 15-min growth call
                </Link>
                .
              </p>
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="rounded-2xl border border-cyan-500/45 bg-slate-950/80 p-5 md:p-6">
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">
                <Sparkles className="size-3.5" />
                Next step
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Turn this report into a 30-day growth deployment plan</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">
                Use this as a diagnostic baseline. Final outcomes depend on implementation quality, response speed, and market conditions.
              </p>
              <div className="mt-5 flex flex-col gap-3 md:flex-row">
                <Button asChild size="lg" variant="outline" className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800 md:flex-1">
                  <Link href="/tools/website-audit/start">
                    Run Another Audit
                    <Search className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800 md:flex-1">
                  <Link href={`/bespoke-plan?track=track2&website=${encodeURIComponent(report.normalizedUrl)}`}>Build My Plan</Link>
                </Button>
                <Button asChild size="lg" className="md:flex-1">
                  <Link href={`/book?${bookQuery}`}>Book a Call</Link>
                </Button>
              </div>
            </section>
          </MotionReveal>
        </>
      )}

      {leadModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <form onSubmit={submitLeadGate} className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-lg font-semibold text-white">Unlock this report action</h3>
            <p className="mt-1 text-sm text-slate-300">
              Add your details once. We will save your report and enable {pendingAction === "pdf" ? "PDF export" : "email report"}.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={leadForm.name}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Name"
                required={pendingAction === "pdf"}
                className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              />
              <input
                value={leadForm.email}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                type="email"
                required
                className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              />
              <input
                value={leadForm.phone}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Phone"
                className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              />
              <input
                value={leadForm.businessName}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, businessName: event.target.value }))}
                placeholder="Business name"
                required={pendingAction === "pdf"}
                className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              />
            </div>

            <input
              value={leadForm.website}
              onChange={(event) => setLeadForm((prev) => ({ ...prev, website: event.target.value }))}
              placeholder="Website"
              className="mt-3 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
            />

            <label className="mt-3 flex items-start gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={leadForm.consentWeekly}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, consentWeekly: event.target.checked }))}
                className="mt-0.5 size-4 rounded border-slate-700 bg-slate-950"
              />
              Yes — send my weekly Growth Check
            </label>

            <div className="mt-4 flex gap-2">
              <Button type="submit" className="flex-1 bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={leadSubmitting}>
                {leadSubmitting ? "Saving..." : pendingAction === "pdf" ? "Save & export PDF" : "Save & email report"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                onClick={() => {
                  setLeadModalOpen(false);
                  setPendingAction(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
