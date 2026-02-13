"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, FileDown, Sparkles } from "lucide-react";

import { KPICharts } from "@/components/marketing/kpi-charts";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type SimulatorMode = "preview" | "full";

type AIGrowthSimulatorProps = {
  mode?: SimulatorMode;
  className?: string;
};

type TrafficSources = {
  google: number;
  meta: number;
  referrals: number;
  walkIns: number;
};

type SimulatorState = {
  industry: string;
  monthlyRevenue: number;
  monthlyLeads: number;
  conversionRate: number;
  avgOrderValue: number;
  responseTimeMinutes: number;
  followUpMaturity: number;
  reviewCount: number;
  noShowRate: number;
  teamSize: number;
  trafficSources: TrafficSources;
};

const defaults: SimulatorState = {
  industry: "trades",
  monthlyRevenue: 28000,
  monthlyLeads: 100,
  conversionRate: 16,
  avgOrderValue: 560,
  responseTimeMinutes: 24,
  followUpMaturity: 2,
  reviewCount: 35,
  noShowRate: 24,
  teamSize: 4,
  trafficSources: {
    google: 45,
    meta: 25,
    referrals: 20,
    walkIns: 10,
  },
};

const industryPresets: Record<
  string,
  { multiplier: number; baselineConversion: number; speedSensitivity: number; label: string }
> = {
  trades: { multiplier: 1.1, baselineConversion: 0.17, speedSensitivity: 1.25, label: "Trades" },
  clinics: { multiplier: 1.05, baselineConversion: 0.21, speedSensitivity: 1.08, label: "Clinics" },
  gyms: { multiplier: 0.98, baselineConversion: 0.14, speedSensitivity: 1.14, label: "Gyms" },
  dentists: { multiplier: 1.11, baselineConversion: 0.24, speedSensitivity: 1.05, label: "Dentists" },
  law: { multiplier: 1.16, baselineConversion: 0.18, speedSensitivity: 1.09, label: "Law Firms" },
  realestate: { multiplier: 1.07, baselineConversion: 0.16, speedSensitivity: 1.16, label: "Real Estate" },
  ecom: { multiplier: 0.95, baselineConversion: 0.11, speedSensitivity: 1.12, label: "Ecommerce" },
  local: { multiplier: 1, baselineConversion: 0.15, speedSensitivity: 1.2, label: "Local Services" },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatCurrency(value: number) {
  return `£${Math.max(0, value).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

function normalizeTraffic(traffic: TrafficSources) {
  const total = traffic.google + traffic.meta + traffic.referrals + traffic.walkIns;
  if (total <= 0) {
    return {
      google: 25,
      meta: 25,
      referrals: 25,
      walkIns: 25,
    };
  }

  return {
    google: (traffic.google / total) * 100,
    meta: (traffic.meta / total) * 100,
    referrals: (traffic.referrals / total) * 100,
    walkIns: (traffic.walkIns / total) * 100,
  };
}

export function AIGrowthSimulator({ mode = "preview", className }: AIGrowthSimulatorProps) {
  const [form, setForm] = useState<SimulatorState>(defaults);
  const [hasStarted, setHasStarted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const startTracking = () => {
    if (hasStarted) {
      return;
    }

    setHasStarted(true);
    trackEvent("simulator_start", {
      source: mode,
    });
  };

  const result = useMemo(() => {
    const preset = industryPresets[form.industry] || industryPresets.local;
    const traffic = normalizeTraffic(form.trafficSources);

    const responseIndex = clamp((45 - form.responseTimeMinutes) / 45, 0, 1);
    const followUpIndex = clamp(form.followUpMaturity / 5, 0, 1);
    const reviewsIndex = clamp(form.reviewCount / 280, 0, 1);
    const showRate = 1 - clamp(form.noShowRate / 100, 0, 0.9);
    const teamIndex = clamp(form.teamSize / 12, 0, 1);

    const channelQuality =
      traffic.google * 0.36 + traffic.meta * 0.24 + traffic.referrals * 0.3 + traffic.walkIns * 0.1;

    const speedPenalty = clamp((1 - responseIndex) * preset.speedSensitivity, 0, 1.2);
    const conversionBase = clamp(form.conversionRate / 100, 0.03, 0.78);
    const blendedConversion = clamp((conversionBase * 0.58 + preset.baselineConversion * 0.42) * preset.multiplier, 0.04, 0.8);

    const leadUpliftPct = clamp(
      6 + speedPenalty * 18 + (1 - followUpIndex) * 16 + (teamIndex < 0.3 ? 8 : 0) + (channelQuality < 30 ? 10 : 0),
      5,
      58,
    );

    const bookingUpliftPct = clamp(
      8 + speedPenalty * 20 + (1 - showRate) * 18 + (1 - reviewsIndex) * 10 + (1 - followUpIndex) * 14,
      6,
      62,
    );

    const projectedLeads = form.monthlyLeads * (1 + leadUpliftPct / 100);
    const projectedConversion = clamp(blendedConversion * (1 + bookingUpliftPct / 100), 0.05, 0.84);

    const currentBookings = form.monthlyLeads * blendedConversion * showRate;
    const projectedBookings = projectedLeads * projectedConversion * clamp(showRate + 0.06, 0.45, 0.98);

    const currentRevenueEstimate = Math.max(form.monthlyRevenue, currentBookings * form.avgOrderValue);
    const projectedRevenueEstimate = projectedBookings * form.avgOrderValue;
    const revenueDelta = Math.max(0, projectedRevenueEstimate - currentRevenueEstimate);

    const recoveredRevenueLow = revenueDelta * 0.7;
    const recoveredRevenueHigh = revenueDelta * 1.28;

    const speedToLeadScore = clamp(
      Math.round(
        22 +
          responseIndex * 36 +
          followUpIndex * 14 +
          (1 - clamp(form.noShowRate / 100, 0, 1)) * 12 +
          (traffic.google >= 35 ? 6 : 0) +
          (traffic.referrals >= 20 ? 5 : 0) +
          Math.min(5, form.teamSize),
      ),
      0,
      100,
    );

    const leakDiagnosis = [
      {
        label: "Slow response speed is leaking ready-to-buy leads.",
        score: form.responseTimeMinutes * preset.speedSensitivity,
      },
      {
        label: "Follow-up consistency is too low to protect conversion.",
        score: (5 - form.followUpMaturity) * 8,
      },
      {
        label: "No-show prevention is underpowered for current booking volume.",
        score: form.noShowRate * 0.9,
      },
      {
        label: "Traffic mix depends too heavily on low-intent sources.",
        score: Math.max(0, traffic.walkIns + traffic.meta - 45),
      },
      {
        label: "Review authority and trust assets are not strong enough yet.",
        score: Math.max(0, 140 - form.reviewCount) * 0.45,
      },
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.label);

    const moduleRecommendations = [
      {
        label: "Website conversion layer",
        href: "/services/websites-in-72-hours",
        reason: "Clarify offer and capture intent faster.",
        checked: traffic.google > 30 || conversionBase < 0.18,
      },
      {
        label: "Missed-call recovery",
        href: "/services/missed-call-recovery",
        reason: "Recover demand before competitors reply.",
        checked: form.responseTimeMinutes > 12,
      },
      {
        label: "CRM + workflow automation",
        href: "/services/automations-workflows",
        reason: "Enforce follow-up and stage progression.",
        checked: form.followUpMaturity < 4,
      },
      {
        label: "Booking + reminders",
        href: "/services/booking-systems-reminders",
        reason: "Reduce no-show loss and improve attendance.",
        checked: form.noShowRate > 12,
      },
      {
        label: "SEO + AEO growth layer",
        href: "/services/seo-aeo",
        reason: "Increase qualified demand and answer visibility.",
        checked: traffic.google < 35 || reviewsIndex < 0.4,
      },
    ];

    const starterModules = moduleRecommendations.filter((module) => module.checked);

    return {
      speedToLeadScore,
      leakDiagnosis,
      currentBookings,
      projectedBookings,
      currentRevenueEstimate,
      projectedRevenueEstimate,
      recoveredRevenueLow,
      recoveredRevenueHigh,
      leadUpliftPct,
      bookingUpliftPct,
      starterModules,
      moduleRecommendations,
      traffic,
    };
  }, [form]);

  const scoreRadius = 48;
  const scoreCircumference = 2 * Math.PI * scoreRadius;
  const scoreOffset = scoreCircumference - (scoreCircumference * result.speedToLeadScore) / 100;

  const starterModuleList = result.starterModules.map((module) => module.label).join(", ");
  const bookingHref = `/book?industry=${encodeURIComponent(form.industry)}&score=${result.speedToLeadScore}&revenue=${Math.round(result.currentRevenueEstimate)}&leads=${form.monthlyLeads}&goals=${encodeURIComponent(`Focus on: ${starterModuleList || "Core conversion stack"}`)}`;

  const updateNumber = (key: keyof Omit<SimulatorState, "industry" | "trafficSources">, value: string) => {
    startTracking();
    const parsed = Number(value);
    setForm((previous) => ({
      ...previous,
      [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    }));
  };

  const updateIndustry = (value: string) => {
    startTracking();
    setForm((previous) => ({ ...previous, industry: value }));
  };

  const updateTraffic = (key: keyof TrafficSources, value: string) => {
    startTracking();
    const parsed = Number(value);
    setForm((previous) => ({
      ...previous,
      trafficSources: {
        ...previous.trafficSources,
        [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
      },
    }));
  };

  const exportPayload = {
    generatedAt: new Date().toISOString(),
    inputs: form,
    outputs: {
      speedToLeadScore: result.speedToLeadScore,
      leadUpliftPct: Number(result.leadUpliftPct.toFixed(1)),
      bookingUpliftPct: Number(result.bookingUpliftPct.toFixed(1)),
      recoveredRevenueRange: {
        low: Math.round(result.recoveredRevenueLow),
        high: Math.round(result.recoveredRevenueHigh),
      },
      currentBookings: Number(result.currentBookings.toFixed(1)),
      projectedBookings: Number(result.projectedBookings.toFixed(1)),
      leakDiagnosis: result.leakDiagnosis,
      recommendedModules: result.starterModules,
    },
    note: "Projection only. Not a revenue guarantee.",
  };

  const exportSummary = JSON.stringify(exportPayload, null, 2);

  const exportPlan = async () => {
    startTracking();

    try {
      await navigator.clipboard.writeText(exportSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const blob = new Blob([exportSummary], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "growth-simulator-summary.json";
      anchor.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadPdf = async () => {
    setPdfLoading(true);
    startTracking();

    try {
      const response = await fetch("/api/simulator/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportPayload),
      });

      if (!response.ok) {
        throw new Error("Could not generate PDF.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "growth-plan-summary.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[simulator] pdf export failed", error);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-cyan-500/28 bg-[linear-gradient(160deg,rgba(56,189,248,0.16),rgba(15,23,42,0.94))] p-6 shadow-[0_30px_90px_rgba(2,6,23,0.62)] md:p-8",
        className,
      )}
    >
      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">AI Growth Simulator</p>
          <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Model your leaks, speed score, and revenue upside</h3>
          <p className="mt-3 text-sm text-slate-300">Use realistic numbers to estimate recovered revenue and decide which modules to install first.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Industry</label>
              <select
                value={form.industry}
                onChange={(event) => updateIndustry(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100"
              >
                {Object.entries(industryPresets).map(([value, preset]) => (
                  <option key={value} value={value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Monthly Revenue (£)</label>
              <Input
                type="number"
                value={form.monthlyRevenue}
                onChange={(event) => updateNumber("monthlyRevenue", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Monthly Leads</label>
              <Input
                type="number"
                value={form.monthlyLeads}
                onChange={(event) => updateNumber("monthlyLeads", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Conversion Rate (%)</label>
              <Input
                type="number"
                value={form.conversionRate}
                onChange={(event) => updateNumber("conversionRate", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Avg Order Value (£)</label>
              <Input
                type="number"
                value={form.avgOrderValue}
                onChange={(event) => updateNumber("avgOrderValue", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Response Time (min)</label>
              <Input
                type="number"
                value={form.responseTimeMinutes}
                onChange={(event) => updateNumber("responseTimeMinutes", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Team Size</label>
              <Input
                type="number"
                value={form.teamSize}
                onChange={(event) => updateNumber("teamSize", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Follow-up Maturity (0-5)</label>
              <Input
                type="number"
                value={form.followUpMaturity}
                onChange={(event) => updateNumber("followUpMaturity", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
                min={0}
                max={5}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Review Count</label>
              <Input
                type="number"
                value={form.reviewCount}
                onChange={(event) => updateNumber("reviewCount", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">No-Show Rate (%)</label>
              <Input
                type="number"
                value={form.noShowRate}
                onChange={(event) => updateNumber("noShowRate", event.target.value)}
                className="border-slate-700 bg-slate-950/70 text-slate-100"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Traffic Sources (%)</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {([
                  ["google", "Google"],
                  ["meta", "Meta"],
                  ["referrals", "Referrals"],
                  ["walkIns", "Walk-ins"],
                ] as Array<[keyof TrafficSources, string]>).map(([key, label]) => (
                  <div key={key} className="rounded-xl border border-slate-800 bg-slate-900/65 p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <Input
                      type="number"
                      value={form.trafficSources[key]}
                      onChange={(event) => updateTraffic(key, event.target.value)}
                      className="mt-2 border-slate-700 bg-slate-950/70 text-slate-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/72 p-5">
          <div className="grid gap-4 sm:grid-cols-[0.44fr_0.56fr]">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Speed-to-lead score</p>
              <div className="mt-3 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="h-30 w-30">
                  <circle cx="60" cy="60" r={scoreRadius} stroke="rgba(51,65,85,0.85)" strokeWidth="10" fill="none" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r={scoreRadius}
                    stroke="url(#score-gradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={scoreCircumference}
                    animate={{ strokeDashoffset: scoreOffset }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    transform="rotate(-90 60 60)"
                  />
                  <defs>
                    <linearGradient id="score-gradient" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  <text x="60" y="64" textAnchor="middle" className="fill-white text-[20px] font-semibold">
                    {result.speedToLeadScore}
                  </text>
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Recovered revenue</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">
                  {formatCurrency(result.recoveredRevenueLow)} - {formatCurrency(result.recoveredRevenueHigh)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Projected uplift</p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Leads +{result.leadUpliftPct.toFixed(0)}% · Bookings +{result.bookingUpliftPct.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Before vs After</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded-lg border border-slate-800 bg-slate-950/65 p-3">
                <p className="text-xs text-slate-400">Current Bookings</p>
                <p className="mt-1 font-semibold text-white">{result.currentBookings.toFixed(1)}/mo</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/65 p-3">
                <p className="text-xs text-slate-400">Projected Bookings</p>
                <p className="mt-1 font-semibold text-cyan-200">{result.projectedBookings.toFixed(1)}/mo</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/65 p-3">
                <p className="text-xs text-slate-400">Current Revenue</p>
                <p className="mt-1 font-semibold text-white">{formatCurrency(result.currentRevenueEstimate)}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/65 p-3">
                <p className="text-xs text-slate-400">Projected Revenue</p>
                <p className="mt-1 font-semibold text-cyan-200">{formatCurrency(result.projectedRevenueEstimate)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Top 3 leak diagnosis</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {result.leakDiagnosis.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-4 text-cyan-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Starter install modules</p>
            <div className="mt-3 space-y-2 text-sm text-slate-200">
              {result.moduleRecommendations.map((module) => (
                <Link
                  key={module.label}
                  href={module.href}
                  className={cn(
                    "block rounded-lg border bg-slate-950/65 p-2 transition hover:border-cyan-400/45",
                    module.checked ? "border-cyan-500/45" : "border-slate-800",
                  )}
                >
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <span className={cn("inline-flex size-4 items-center justify-center rounded-sm border", module.checked ? "border-cyan-400 bg-cyan-400/20 text-cyan-200" : "border-slate-700 text-transparent") }>
                      <Check className="size-3" />
                    </span>
                    {module.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{module.reason}</p>
                </Link>
              ))}
            </div>
          </div>

          {mode === "full" ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Export summary view</p>
              <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-300">
                {exportSummary}
              </pre>
            </div>
          ) : null}

          {mode === "full" ? <KPICharts /> : null}

          <p className="text-xs text-slate-400">Estimates only. Use this model for planning and prioritisation, not guaranteed financial outcomes.</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {mode === "full" ? (
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800"
                onClick={exportPlan}
              >
                <Download className="size-4" />
                {copied ? "Copied" : "Export summary"}
              </Button>
            ) : (
              <PrimaryCTA label="Email Me My Plan" className="w-full" size="default" />
            )}

            <Button
              asChild
              className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem("dba_simulator_completed_at", new Date().toISOString());
                }

                trackEvent("simulator_complete", {
                  source: mode,
                  score: result.speedToLeadScore,
                  industry: form.industry,
                });
              }}
            >
              <Link href={bookingHref}>Book a Call</Link>
            </Button>
          </div>

          {mode === "full" ? (
            <Button
              variant="outline"
              className="w-full border-cyan-500/40 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/15"
              onClick={downloadPdf}
              disabled={pdfLoading}
            >
              <FileDown className="size-4" />
              {pdfLoading ? "Generating PDF..." : "Download Your Plan PDF"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
