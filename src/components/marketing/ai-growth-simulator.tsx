"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Sparkles } from "lucide-react";

import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type SimulatorMode = "preview" | "full";

type AIGrowthSimulatorProps = {
  mode?: SimulatorMode;
  className?: string;
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
};

const defaults: SimulatorState = {
  industry: "trades",
  monthlyRevenue: 28000,
  monthlyLeads: 100,
  conversionRate: 17,
  avgOrderValue: 560,
  responseTimeMinutes: 20,
  followUpMaturity: 2,
  reviewCount: 35,
  noShowRate: 24,
};

const industryPresets: Record<string, { multiplier: number; baselineConversion: number; label: string }> = {
  trades: { multiplier: 1.08, baselineConversion: 0.17, label: "Trades" },
  clinics: { multiplier: 1.04, baselineConversion: 0.21, label: "Clinics" },
  gyms: { multiplier: 0.98, baselineConversion: 0.14, label: "Gyms" },
  dentists: { multiplier: 1.1, baselineConversion: 0.24, label: "Dentists" },
  law: { multiplier: 1.15, baselineConversion: 0.18, label: "Law Firms" },
  realestate: { multiplier: 1.06, baselineConversion: 0.16, label: "Real Estate" },
  ecom: { multiplier: 0.92, baselineConversion: 0.11, label: "Ecommerce" },
  local: { multiplier: 1.0, baselineConversion: 0.15, label: "Local Services" },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatCurrency(value: number) {
  return `£${Math.max(0, value).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

export function AIGrowthSimulator({ mode = "preview", className }: AIGrowthSimulatorProps) {
  const [form, setForm] = useState<SimulatorState>(defaults);
  const [hasStarted, setHasStarted] = useState(false);
  const [copied, setCopied] = useState(false);

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

    const responseIndex = clamp((45 - form.responseTimeMinutes) / 45, 0, 1);
    const followUpIndex = clamp(form.followUpMaturity / 5, 0, 1);
    const reviewsIndex = clamp(form.reviewCount / 300, 0, 1);
    const showRate = 1 - clamp(form.noShowRate / 100, 0, 0.9);

    const currentConversion = clamp(form.conversionRate / 100, 0.04, 0.75);
    const baselineBlend = (currentConversion * 0.6 + preset.baselineConversion * 0.4) * preset.multiplier;

    const responseUplift = (1 - responseIndex) * 0.11;
    const followUpUplift = (1 - followUpIndex) * 0.14;
    const reviewUplift = (1 - reviewsIndex) * 0.07;
    const noShowUplift = (1 - showRate) * 0.09;

    const totalUpliftPotential = clamp(responseUplift + followUpUplift + reviewUplift + noShowUplift, 0.08, 0.52);

    const projectedConversion = clamp(baselineBlend * (1 + totalUpliftPotential), 0.05, 0.78);

    const currentBookings = form.monthlyLeads * baselineBlend * showRate;
    const projectedBookings = form.monthlyLeads * projectedConversion * (showRate + 0.05);

    const currentRevenueEstimate = currentBookings * form.avgOrderValue;
    const projectedRevenueEstimate = projectedBookings * form.avgOrderValue;

    const leadValueGap = Math.max(0, projectedRevenueEstimate - currentRevenueEstimate);
    const liftLow = leadValueGap * 0.72;
    const liftHigh = leadValueGap * 1.23;

    const score = clamp(
      Math.round(
        30 +
          responseIndex * 20 +
          followUpIndex * 22 +
          reviewsIndex * 12 +
          (1 - clamp(form.noShowRate / 100, 0, 1)) * 16 +
          clamp(form.conversionRate / 35, 0, 1) * 16,
      ),
      0,
      100,
    );

    const leakCandidates = [
      {
        label: "Slow first response causes qualified leads to go cold.",
        score: form.responseTimeMinutes,
      },
      {
        label: "Follow-up workflow maturity is too low for consistent conversion.",
        score: 5 - form.followUpMaturity,
      },
      {
        label: "No-show rate is reducing booked revenue efficiency.",
        score: form.noShowRate / 8,
      },
      {
        label: "Review authority is limiting trust and conversion at point of decision.",
        score: Math.max(0, 120 - form.reviewCount) / 25,
      },
      {
        label: "Current conversion rate is below potential for this lead volume.",
        score: Math.max(0, 24 - form.conversionRate) / 3,
      },
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.label);

    const leverImprovements = [
      {
        lever: "Response-time automation",
        projected: `${Math.round(responseUplift * 100 + 5)}% faster lead-to-contact`,
      },
      {
        lever: "Follow-up system",
        projected: `${Math.round(followUpUplift * 100 + 6)}% booking uplift potential`,
      },
      {
        lever: "No-show prevention",
        projected: `${Math.round(noShowUplift * 100 + 4)}% attendance recovery`,
      },
      {
        lever: "Review and trust signals",
        projected: `${Math.round(reviewUplift * 100 + 3)}% conversion support`,
      },
    ];

    const recommendedAssetPack = [
      { label: "Website + conversion layer", href: "/services/websites-in-72-hours", reason: "Improve lead quality and CTA completion." },
      { label: "CRM + automations", href: "/services/automations-workflows", reason: "Reduce response delay and enforce follow-up." },
      { label: "Booking + reminders", href: "/services/booking-systems-reminders", reason: "Lower no-shows and increase confirmed appointments." },
    ];

    if (form.responseTimeMinutes > 15) {
      recommendedAssetPack[1] = {
        label: "Missed-call recovery",
        href: "/services/missed-call-recovery",
        reason: "Capture inbound demand instantly outside office hours.",
      };
    }

    if (form.reviewCount < 60) {
      recommendedAssetPack[0] = {
        label: "SEO + AEO",
        href: "/services/seo-aeo",
        reason: "Increase visibility and authority for intent-based traffic.",
      };
    }

    return {
      score,
      leakDiagnosis: leakCandidates,
      leverImprovements,
      currentBookings,
      projectedBookings,
      currentRevenueEstimate,
      projectedRevenueEstimate,
      liftLow,
      liftHigh,
      recommendedAssetPack,
    };
  }, [form]);

  const scoreRadius = 48;
  const scoreCircumference = 2 * Math.PI * scoreRadius;
  const scoreOffset = scoreCircumference - (scoreCircumference * result.score) / 100;

  const bookingHref = `/book?industry=${encodeURIComponent(form.industry)}&score=${result.score}&revenue=${Math.round(result.currentRevenueEstimate)}&leads=${form.monthlyLeads}`;

  const updateNumber = (key: keyof Omit<SimulatorState, "industry">, value: string) => {
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

  const exportPlan = async () => {
    startTracking();
    const payload = {
      generatedAt: new Date().toISOString(),
      inputs: form,
      outputs: {
        score: result.score,
        leakDiagnosis: result.leakDiagnosis,
        leverImprovements: result.leverImprovements,
        monthlyLiftRange: {
          low: Math.round(result.liftLow),
          high: Math.round(result.liftHigh),
        },
        recommendedAssetPack: result.recommendedAssetPack,
      },
      note: "Example projection only. Not a guarantee of revenue outcomes.",
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "growth-simulator-summary.json";
      anchor.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-cyan-500/28 bg-[linear-gradient(160deg,rgba(56,189,248,0.16),rgba(15,23,42,0.94))] p-6 shadow-[0_30px_90px_rgba(2,6,23,0.62)] md:p-8",
        className,
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">AI Growth Simulator</p>
          <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Model your growth leaks and monthly lift range</h3>
          <p className="mt-3 text-sm text-slate-300">Use your current funnel metrics to estimate upside and identify which asset pack to deploy first.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Industry</label>
              <select value={form.industry} onChange={(event) => updateIndustry(event.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100">
                {Object.entries(industryPresets).map(([value, preset]) => (
                  <option key={value} value={value}>{preset.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Monthly Revenue (£)</label>
              <Input type="number" value={form.monthlyRevenue} onChange={(event) => updateNumber("monthlyRevenue", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Monthly Leads</label>
              <Input type="number" value={form.monthlyLeads} onChange={(event) => updateNumber("monthlyLeads", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Conversion Rate (%)</label>
              <Input type="number" value={form.conversionRate} onChange={(event) => updateNumber("conversionRate", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Avg Order Value (£)</label>
              <Input type="number" value={form.avgOrderValue} onChange={(event) => updateNumber("avgOrderValue", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Response Time (min)</label>
              <Input type="number" value={form.responseTimeMinutes} onChange={(event) => updateNumber("responseTimeMinutes", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Follow-up Maturity (0-5)</label>
              <Input type="number" value={form.followUpMaturity} onChange={(event) => updateNumber("followUpMaturity", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" min={0} max={5} />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">Review Count</label>
              <Input type="number" value={form.reviewCount} onChange={(event) => updateNumber("reviewCount", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.08em] text-slate-400 uppercase">No-Show Rate (%)</label>
              <Input type="number" value={form.noShowRate} onChange={(event) => updateNumber("noShowRate", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/72 p-5">
          <div className="grid gap-4 sm:grid-cols-[0.44fr_0.56fr]">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Growth Score</p>
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
                  <text x="60" y="64" textAnchor="middle" className="fill-white text-[20px] font-semibold">{result.score}</text>
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Monthly lift range</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">{formatCurrency(result.liftLow)} - {formatCurrency(result.liftHigh)}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Projected bookings</p>
                <p className="mt-2 text-lg font-semibold text-white">{result.currentBookings.toFixed(1)} → {result.projectedBookings.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Top 3 leak diagnosis</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {result.leakDiagnosis.map((item) => (
                <li key={item} className="flex items-start gap-2"><Sparkles className="mt-0.5 size-4 text-cyan-300" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Projected improvements by lever</p>
            <div className="mt-3 space-y-2 text-sm text-slate-200">
              {result.leverImprovements.map((item) => (
                <div key={item.lever} className="rounded-lg border border-slate-800 bg-slate-950/65 p-2">
                  <p className="text-xs text-slate-400">{item.lever}</p>
                  <p className="mt-1">{item.projected}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Recommended asset pack</p>
            <div className="mt-3 space-y-2 text-sm text-slate-200">
              {result.recommendedAssetPack.map((asset) => (
                <Link key={asset.label} href={asset.href} className="block rounded-lg border border-slate-800 bg-slate-950/65 p-2 hover:border-cyan-400/45">
                  <p className="font-semibold text-white">{asset.label}</p>
                  <p className="text-xs text-slate-400">{asset.reason}</p>
                </Link>
              ))}
            </div>
          </div>

          {mode === "full" ? <KPICharts /> : null}

          <p className="text-xs text-slate-400">Estimates only. Use this model for planning and prioritisation, not guaranteed financial outcomes.</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {mode === "full" ? (
              <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800" onClick={exportPlan}>
                <Download className="size-4" />
                {copied ? "Copied" : "Export plan"}
              </Button>
            ) : (
              <PrimaryCTA label="Email Me My Plan" className="w-full" size="default" />
            )}

            <Button
              asChild
              className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              onClick={() =>
                trackEvent("simulator_complete", {
                  source: mode,
                  score: result.score,
                  industry: form.industry,
                })
              }
            >
              <Link href={bookingHref}>Get A Real Plan</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
