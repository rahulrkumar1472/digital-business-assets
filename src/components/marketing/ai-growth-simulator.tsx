"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Building2,
  ChevronRight,
  Gauge,
  Globe,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { requireLead } from "@/lib/leads/client";
import {
  type GrowthGoal,
  type LocationIntent,
  type OfferType,
  type SimulatorInputs,
  type SimulatorOutput,
} from "@/lib/simulator/simulator-engine";
import { cn } from "@/lib/utils";

type SimulatorMode = "preview" | "full";

type AIGrowthSimulatorProps = {
  mode?: SimulatorMode;
  className?: string;
  prefill?: {
    industry?: string;
    goal?: string;
    readinessScore?: number;
    topActions?: string[];
    monthlyVisitors?: number;
    monthlyLeads?: number;
    conversionRate?: number;
    avgOrderValue?: number;
    auditRunId?: string;
    domain?: string;
    businessName?: string;
  };
};

type WizardStep = 1 | 2 | 3;

type FormState = {
  domain: string;
  businessName: string;
  industry: string;
  offerType: OfferType;
  locationIntent: LocationIntent;
  goal: GrowthGoal;
  visitors: string;
  conversionRate: string;
  closeRate: string;
  avgOrderValue: string;
  grossMargin: string;
  responseTimeMinutes: string;
  followups: number;
  leadCapturePoints: {
    websiteForm: boolean;
    whatsapp: boolean;
    phone: boolean;
    bookingTool: boolean;
  };
  trustSignals: {
    reviews: boolean;
    caseStudies: boolean;
    guarantees: boolean;
    certifications: boolean;
  };
};

type FormErrors = Partial<Record<"domain" | "industry" | "visitors" | "conversionRate" | "avgOrderValue" | "responseTimeMinutes", string>>;

type SimulatorApiResponse = {
  ok: boolean;
  simulatorRunId?: string;
  output?: SimulatorOutput;
  inputs?: SimulatorInputs;
  message?: string;
};

const industryOptions = [
  "Trades",
  "Healthcare",
  "Dental",
  "Beauty",
  "Real Estate",
  "Retail",
  "Legal",
  "Hospitality",
  "Coaching",
  "SaaS",
];

const offerTypeOptions: Array<{ value: OfferType; label: string; help: string }> = [
  { value: "local-service", label: "Local Service", help: "Calls, bookings, and quote-driven sales" },
  { value: "ecom", label: "Ecom", help: "Cart and checkout driven revenue" },
  { value: "lead-gen", label: "Lead Gen", help: "Leads handed to a sales process" },
  { value: "saas", label: "SaaS", help: "Trial/demo/sign-up led pipeline" },
];

const locationIntentOptions: Array<{ value: LocationIntent; label: string }> = [
  { value: "local", label: "Local" },
  { value: "national", label: "National" },
  { value: "international", label: "International" },
];

const goalOptions: Array<{ value: GrowthGoal; label: string }> = [
  { value: "more-leads", label: "More leads" },
  { value: "more-bookings", label: "More bookings" },
  { value: "more-sales", label: "More sales" },
  { value: "higher-aov", label: "Higher AOV" },
  { value: "lower-cpl", label: "Lower CPL" },
];

function formatCurrency(value: number) {
  return `£${Math.max(0, value).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

function toRag(score: number): "green" | "amber" | "red" {
  if (score >= 90) return "green";
  if (score >= 50) return "amber";
  return "red";
}

function ragClasses(rag: "green" | "amber" | "red") {
  if (rag === "green") return "border-emerald-400/35 bg-emerald-500/15 text-emerald-200";
  if (rag === "amber") return "border-amber-400/35 bg-amber-500/15 text-amber-200";
  return "border-rose-400/35 bg-rose-500/15 text-rose-200";
}

function parseNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toOfferType(value?: string): OfferType {
  const source = (value || "").toLowerCase();
  if (source.includes("ecom") || source.includes("shop")) return "ecom";
  if (source.includes("saas") || source.includes("software")) return "saas";
  if (source.includes("lead")) return "lead-gen";
  return "local-service";
}

function toGoal(value?: string): GrowthGoal {
  const source = (value || "").toLowerCase();
  if (source.includes("book")) return "more-bookings";
  if (source.includes("sales")) return "more-sales";
  if (source.includes("aov") || source.includes("value")) return "higher-aov";
  if (source.includes("cpl") || source.includes("cost")) return "lower-cpl";
  return "more-leads";
}

function inferVisitorsFromPrefill(prefill?: AIGrowthSimulatorProps["prefill"]) {
  if (typeof prefill?.monthlyVisitors === "number" && prefill.monthlyVisitors > 0) return Math.round(prefill.monthlyVisitors);
  if (
    typeof prefill?.monthlyLeads === "number" &&
    prefill.monthlyLeads > 0 &&
    typeof prefill?.conversionRate === "number" &&
    prefill.conversionRate > 0
  ) {
    return Math.round((prefill.monthlyLeads * 100) / prefill.conversionRate);
  }
  return 2800;
}

function buildInitialForm(prefill?: AIGrowthSimulatorProps["prefill"]): FormState {
  return {
    domain: prefill?.domain || "",
    businessName: prefill?.businessName || "",
    industry: prefill?.industry || "Local Services",
    offerType: toOfferType(prefill?.industry),
    locationIntent: "local",
    goal: toGoal(prefill?.goal),
    visitors: String(inferVisitorsFromPrefill(prefill)),
    conversionRate: typeof prefill?.conversionRate === "number" ? String(prefill.conversionRate) : "",
    closeRate: "",
    avgOrderValue: typeof prefill?.avgOrderValue === "number" ? String(prefill.avgOrderValue) : "420",
    grossMargin: "",
    responseTimeMinutes:
      typeof prefill?.readinessScore === "number" ? String(Math.max(4, Math.round(50 - prefill.readinessScore * 0.35))) : "18",
    followups: typeof prefill?.readinessScore === "number" ? Math.max(1, Math.min(6, Math.round(prefill.readinessScore / 20))) : 2,
    leadCapturePoints: {
      websiteForm: true,
      whatsapp: true,
      phone: true,
      bookingTool: false,
    },
    trustSignals: {
      reviews: true,
      caseStudies: false,
      guarantees: false,
      certifications: false,
    },
  };
}

function domainFromInput(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(candidate).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

export function AIGrowthSimulator({ mode = "preview", className, prefill }: AIGrowthSimulatorProps) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<FormState>(() => buildInitialForm(prefill));
  const [assumeConversionDefault, setAssumeConversionDefault] = useState<boolean>(!prefill?.conversionRate);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [output, setOutput] = useState<SimulatorOutput | null>(null);
  const [simulatorRunId, setSimulatorRunId] = useState<string | null>(null);
  const [eventStartedSent, setEventStartedSent] = useState(false);

  const lead = useMemo(() => requireLead(), []);
  const auditRunId = useMemo(() => prefill?.auditRunId || searchParams.get("auditRunId") || undefined, [prefill?.auditRunId, searchParams]);
  const reportId = useMemo(() => searchParams.get("rid") || undefined, [searchParams]);

  const prefillStripDomain = useMemo(() => {
    const explicit = prefill?.domain || searchParams.get("domain") || searchParams.get("website") || "";
    return domainFromInput(explicit) || domainFromInput(form.domain);
  }, [form.domain, prefill?.domain, searchParams]);

  const progress = (step / 3) * 100;

  const postEvent = async (
    type:
      | "simulator_started"
      | "simulator_completed"
      | "simulator_action_clicked"
      | "simulator_bespoke_plan_clicked"
      | "simulator_opened",
    payload: Record<string, unknown>,
    overrideSimulatorRunId?: string,
  ) => {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          payload,
          leadId: lead?.leadId,
          auditRunId,
          simulatorRunId: overrideSimulatorRunId || simulatorRunId || undefined,
        }),
      });
    } catch {
      // best effort
    }
  };

  useEffect(() => {
    void postEvent("simulator_opened", {
      source: mode,
      domain: prefillStripDomain || domainFromInput(form.domain) || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateStep = (targetStep: WizardStep) => {
    const nextErrors: FormErrors = {};

    if (targetStep === 1) {
      if (!form.industry.trim()) nextErrors.industry = "Select an industry.";
      const maybeDomain = domainFromInput(form.domain);
      if (!maybeDomain) nextErrors.domain = "Enter a valid website URL or domain.";
    }

    if (targetStep === 2) {
      const visitors = parseNumber(form.visitors);
      const aov = parseNumber(form.avgOrderValue);

      if (!visitors || visitors <= 0) nextErrors.visitors = "Enter monthly visitors.";
      if (!assumeConversionDefault) {
        const conversion = parseNumber(form.conversionRate);
        if (!conversion || conversion <= 0) {
          nextErrors.conversionRate = "Enter conversion rate or use default estimate.";
        }
      }
      if (!aov || aov <= 0) nextErrors.avgOrderValue = "Enter average order value.";
    }

    if (targetStep === 3) {
      const response = parseNumber(form.responseTimeMinutes);
      if (response === null || response <= 0) {
        nextErrors.responseTimeMinutes = "Enter response time in minutes.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const runSimulation = async () => {
    const payload = {
      leadId: lead?.leadId,
      auditRunId,
      domain: form.domain,
      businessName: form.businessName,
      industry: form.industry,
      offerType: form.offerType,
      locationIntent: form.locationIntent,
      goal: form.goal,
      visitors: Number(form.visitors),
      conversionRate: assumeConversionDefault ? null : Number(form.conversionRate),
      avgOrderValue: Number(form.avgOrderValue),
      closeRate: parseNumber(form.closeRate),
      grossMargin: parseNumber(form.grossMargin),
      responseTimeMinutes: Number(form.responseTimeMinutes),
      followups: form.followups,
      leadCapturePoints: form.leadCapturePoints,
      trustSignals: form.trustSignals,
      currency: "GBP",
    };

    setSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/simulator/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as SimulatorApiResponse;
      if (!response.ok || !data.ok || !data.output) {
        throw new Error(data.message || "Could not generate simulator output.");
      }

      setOutput(data.output);
      if (data.simulatorRunId) setSimulatorRunId(data.simulatorRunId);

      trackEvent("simulator_complete", {
        score: data.output.summaryScore,
        goal: form.goal,
      });

      await postEvent(
        "simulator_completed",
        {
          domain: domainFromInput(form.domain),
          goal: form.goal,
          summaryScore: data.output.summaryScore,
          reportId: reportId || null,
        },
        data.simulatorRunId,
      );
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Could not generate simulator output.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = async () => {
    setApiError(null);

    if (!eventStartedSent) {
      setEventStartedSent(true);
      trackEvent("simulator_start", {
        source: mode,
      });
      await postEvent("simulator_started", {
        domain: domainFromInput(form.domain),
        goal: form.goal,
        source: mode,
      });
    }

    const valid = validateStep(step);
    if (!valid) return;

    if (step < 3) {
      setStep((previous) => (previous + 1) as WizardStep);
      return;
    }

    await runSimulation();
  };

  const topActionCtaQuery = useMemo(() => {
    const params = new URLSearchParams({
      track: "track1",
      website: domainFromInput(form.domain) || form.domain,
      industry: form.industry,
      goal: form.goal,
    });
    if (prefillStripDomain) params.set("domain", prefillStripDomain);
    return params.toString();
  }, [form.domain, form.goal, form.industry, prefillStripDomain]);

  const renderWizard = () => (
    <div className="space-y-5 pb-[calc(8.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/55 shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
        <div className="space-y-4 border-b border-slate-800 p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              Step {step} of 3
            </span>
            <span className="text-xs text-slate-400">Takes around 2 minutes</span>
          </div>

          <div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-400">
              <span className={cn(step === 1 && "text-cyan-200")}>Business</span>
              <span className={cn(step === 2 && "text-cyan-200")}>Baseline</span>
              <span className={cn(step === 3 && "text-cyan-200")}>Friction</span>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-white md:text-3xl">
            {step === 1
              ? "Tell us what your business sells"
              : step === 2
                ? "Set your baseline numbers"
                : "Add response + trust friction"}
          </h3>
          <p className="text-sm text-slate-300">
            {step === 1
              ? "We use this to model the right growth path for your market and goal."
              : step === 2
                ? "If you do not know exact numbers, use estimates. We label assumptions clearly."
                : "This is where most revenue leakage happens. Give practical values, not ideal values."}
          </p>
        </div>

        <div className="space-y-4 p-5 md:p-6">
          {step === 1 ? (
            <>
              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">
                  <Globe className="size-3.5 text-cyan-300" />
                  Website URL
                </label>
                <Input
                  value={form.domain}
                  onChange={(event) => setForm((previous) => ({ ...previous, domain: event.target.value }))}
                  placeholder="https://yourbusiness.co.uk"
                  className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  inputMode="url"
                  autoComplete="url"
                />
                {errors.domain ? <p className="text-xs text-rose-300">{errors.domain}</p> : null}
              </div>

              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">
                  <Building2 className="size-3.5 text-cyan-300" />
                  Business name (optional)
                </label>
                <Input
                  value={form.businessName}
                  onChange={(event) => setForm((previous) => ({ ...previous, businessName: event.target.value }))}
                  placeholder="Your business"
                  className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Industry</label>
                  <select
                    value={form.industry}
                    onChange={(event) => setForm((previous) => ({ ...previous, industry: event.target.value }))}
                    className="h-12 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-base text-slate-100"
                  >
                    {industryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.industry ? <p className="text-xs text-rose-300">{errors.industry}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Location intent</label>
                  <div className="grid grid-cols-3 gap-2">
                    {locationIntentOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm((previous) => ({ ...previous, locationIntent: option.value }))}
                        className={cn(
                          "h-12 rounded-lg border text-xs font-semibold",
                          form.locationIntent === option.value
                            ? "border-cyan-400/50 bg-cyan-500/12 text-cyan-100"
                            : "border-slate-700 bg-slate-950/70 text-slate-300",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Offer type</label>
                  <div className="grid gap-2">
                    {offerTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm((previous) => ({ ...previous, offerType: option.value }))}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left",
                          form.offerType === option.value
                            ? "border-cyan-400/50 bg-cyan-500/10"
                            : "border-slate-700 bg-slate-950/70",
                        )}
                      >
                        <p className="text-sm font-semibold text-white">{option.label}</p>
                        <p className="text-xs text-slate-400">{option.help}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Primary goal</label>
                  <div className="grid gap-2">
                    {goalOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm((previous) => ({ ...previous, goal: option.value }))}
                        className={cn(
                          "h-10 rounded-lg border px-3 text-left text-sm font-semibold",
                          form.goal === option.value
                            ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-100"
                            : "border-slate-700 bg-slate-950/70 text-slate-200",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Monthly visitors</label>
                  <Input
                    value={form.visitors}
                    onChange={(event) => setForm((previous) => ({ ...previous, visitors: event.target.value }))}
                    placeholder="2800"
                    inputMode="numeric"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                  {errors.visitors ? <p className="text-xs text-rose-300">{errors.visitors}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Conversion rate %</label>
                    <button
                      type="button"
                      onClick={() => setAssumeConversionDefault((previous) => !previous)}
                      className="text-[11px] font-semibold text-cyan-200 underline-offset-2 hover:underline"
                    >
                      {assumeConversionDefault ? "Using default" : "I don't know"}
                    </button>
                  </div>
                  <Input
                    value={assumeConversionDefault ? "" : form.conversionRate}
                    onChange={(event) => setForm((previous) => ({ ...previous, conversionRate: event.target.value }))}
                    placeholder={assumeConversionDefault ? "Default estimate applied" : "3.2"}
                    inputMode="decimal"
                    disabled={assumeConversionDefault}
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100 disabled:opacity-65"
                  />
                  <p className="text-[11px] text-slate-400">If you don’t know, use estimate. We label defaults in your report.</p>
                  {errors.conversionRate ? <p className="text-xs text-rose-300">{errors.conversionRate}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Average order / booking value (£)</label>
                  <Input
                    value={form.avgOrderValue}
                    onChange={(event) => setForm((previous) => ({ ...previous, avgOrderValue: event.target.value }))}
                    placeholder="420"
                    inputMode="decimal"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                  {errors.avgOrderValue ? <p className="text-xs text-rose-300">{errors.avgOrderValue}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Close rate % (optional)</label>
                  <Input
                    value={form.closeRate}
                    onChange={(event) => setForm((previous) => ({ ...previous, closeRate: event.target.value }))}
                    placeholder="Use default by industry"
                    inputMode="decimal"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Gross margin % (optional)</label>
                  <Input
                    value={form.grossMargin}
                    onChange={(event) => setForm((previous) => ({ ...previous, grossMargin: event.target.value }))}
                    placeholder="Leave blank if unknown"
                    inputMode="decimal"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                </div>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Time to first response (minutes)</label>
                  <Input
                    value={form.responseTimeMinutes}
                    onChange={(event) => setForm((previous) => ({ ...previous, responseTimeMinutes: event.target.value }))}
                    placeholder="18"
                    inputMode="numeric"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                  {errors.responseTimeMinutes ? <p className="text-xs text-rose-300">{errors.responseTimeMinutes}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Follow-ups per lead</label>
                  <div className="grid grid-cols-8 gap-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((previous) => ({ ...previous, followups: value }))}
                        className={cn(
                          "h-11 rounded-md border text-sm font-semibold",
                          form.followups === value
                            ? "border-cyan-400/50 bg-cyan-500/12 text-cyan-100"
                            : "border-slate-700 bg-slate-950/70 text-slate-300",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/65 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Lead capture points</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["websiteForm", "Website form"],
                      ["whatsapp", "WhatsApp"],
                      ["phone", "Phone"],
                      ["bookingTool", "Booking tool"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        checked={form.leadCapturePoints[key]}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            leadCapturePoints: {
                              ...previous.leadCapturePoints,
                              [key]: event.target.checked,
                            },
                          }))
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/65 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Trust signals present</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["reviews", "Reviews"],
                      ["caseStudies", "Case studies"],
                      ["guarantees", "Guarantees"],
                      ["certifications", "Certifications"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        checked={form.trustSignals[key]}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            trustSignals: {
                              ...previous.trustSignals,
                              [key]: event.target.checked,
                            },
                          }))
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {apiError ? (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{apiError}</div>
          ) : null}

          <div className="hidden items-center justify-between gap-3 md:flex">
            <Button
              type="button"
              variant="outline"
              className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
              disabled={step === 1 || submitting}
              onClick={() => setStep((previous) => (previous > 1 ? ((previous - 1) as WizardStep) : previous))}
            >
              Back
            </Button>
            <Button type="button" className="min-w-56 bg-cyan-300 text-slate-950 hover:bg-cyan-200" onClick={() => void handleContinue()} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {step === 3 ? "Generate growth model" : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
        <p className="inline-flex items-center gap-2 font-semibold text-cyan-200">
          <BadgeCheck className="size-4" />
          Trust note
        </p>
        <p className="mt-1">We never spam. We use this to generate your plan and one clear next-step recommendation.</p>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(0.7rem+env(safe-area-inset-bottom))] z-[74] px-4 md:hidden">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-950/95 p-2 backdrop-blur-xl">
          <Button
            type="button"
            className="h-12 w-full bg-cyan-300 text-base text-slate-950 hover:bg-cyan-200"
            onClick={() => void handleContinue()}
            disabled={submitting}
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {step === 3 ? "Generate growth model" : "Continue"}
            {!submitting ? <ChevronRight className="size-4" /> : null}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!output) return null;

    const domainLabel = prefillStripDomain || domainFromInput(form.domain) || "your business";

    return (
      <div className="space-y-6 pb-28 md:pb-0">
        {prefill ? (
          <section className="rounded-2xl border border-cyan-500/35 bg-cyan-500/10 p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Prefilled from audit</p>
            <p className="mt-1 text-sm text-slate-200">
              Based on your site: <span className="font-semibold text-cyan-100">{domainLabel}</span>. We carried over your baseline assumptions and readiness context.
            </p>
          </section>
        ) : null}

        <section className="rounded-2xl border border-cyan-500/35 bg-[linear-gradient(155deg,rgba(34,211,238,0.12),rgba(15,23,42,0.95))] p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Summary score</p>
              <div className="mt-2 inline-flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/35 bg-slate-950/70 text-3xl font-semibold text-white">
                {output.summaryScore}
              </div>
              <p className="mt-3 text-sm text-slate-200">For {form.businessName || domainLabel}, this is your current revenue-system readiness out of 100.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] text-slate-400">Leads / month</p>
                <p className="mt-1 text-xl font-semibold text-white">{output.baseline.leadsPerMonth.toLocaleString("en-GB")}</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] text-slate-400">Sales / month</p>
                <p className="mt-1 text-xl font-semibold text-white">{output.baseline.salesPerMonth.toLocaleString("en-GB")}</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] text-slate-400">Revenue / month</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatCurrency(output.baseline.revenuePerMonth)}</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] text-slate-400">Profit / month</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {typeof output.baseline.profitPerMonth === "number" ? formatCurrency(output.baseline.profitPerMonth) : "Add margin to calculate"}
                </p>
              </article>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-300">
            Assumptions used: {output.assumptions.defaultsUsed.length ? output.assumptions.defaultsUsed.join(", ") : "all custom values"}.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Google Insights-style readiness metrics</p>
          <div className="mt-3 -mx-1 overflow-x-auto pb-1 xl:mx-0 xl:overflow-visible">
            <div className="flex min-w-max gap-2 px-1 xl:grid xl:min-w-0 xl:grid-cols-5 xl:px-0">
              {output.metrics.map((metric) => {
                const rag = toRag(metric.score);
                return (
                  <article key={metric.key} className="w-[235px] rounded-xl border border-slate-800 bg-slate-950/72 p-3 xl:w-auto">
                    <p className="text-[11px] text-slate-400">{metric.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{metric.score}</p>
                    <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${ragClasses(rag)}`}>{rag}</span>

                    <details className="mt-2 rounded-md border border-slate-800 bg-slate-900/60 p-2 text-xs">
                      <summary className="cursor-pointer font-semibold text-cyan-200">Explain this score</summary>
                      <p className="mt-2 text-slate-300">{metric.whatItMeans}</p>
                      <p className="mt-1 text-slate-300">Business impact: {metric.whyItMatters}</p>
                      <ul className="mt-1.5 space-y-1 text-slate-400">
                        {metric.nextSteps.map((step) => (
                          <li key={step}>• {step}</li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8 border-slate-700 bg-slate-900/70 text-[11px] text-slate-100 hover:bg-slate-800"
                      >
                        <Link
                          href={metric.fixModule.href}
                          onClick={() =>
                            void postEvent("simulator_action_clicked", {
                              action: "metric_fix",
                              metric: metric.label,
                              href: metric.fixModule.href,
                              domain: domainLabel,
                            })
                          }
                        >
                          Fix this
                        </Link>
                      </Button>
                    </details>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Projected uplift scenarios</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {output.scenarios.map((scenario) => (
              <article key={scenario.key} className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                <p className="text-sm font-semibold text-white">{scenario.label}</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-300">
                  <li>Conversion uplift: +{scenario.conversionUpliftPct}%</li>
                  <li>Close-rate uplift: +{scenario.closeRateUpliftPct}%</li>
                  <li>Response-time impact: +{scenario.responseTimeImprovementPct}%</li>
                </ul>
                <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-xs text-slate-200">
                  <p>+{scenario.projectedLeadDelta.toLocaleString("en-GB")} leads/month</p>
                  <p>+{scenario.projectedSalesDelta.toLocaleString("en-GB")} sales/month</p>
                  <p className="font-semibold text-cyan-200">+{formatCurrency(scenario.projectedRevenueDelta)}/month</p>
                </div>
                <p className="mt-2 text-xs text-slate-400">{scenario.businessValue}</p>
                <button
                  type="button"
                  onClick={() =>
                    void postEvent("simulator_action_clicked", {
                      action: "scenario_selected",
                      scenario: scenario.key,
                      domain: domainLabel,
                    })
                  }
                  className="mt-2 text-xs font-semibold text-cyan-200 underline-offset-2 hover:underline"
                >
                  Mark this as target scenario
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Weakest stage funnel</p>
          <div className="mt-3 grid gap-2 md:grid-cols-5">
            {output.funnel.stages.map((stage) => (
              <article
                key={stage.key}
                className={cn(
                  "rounded-xl border p-3",
                  stage.key === output.funnel.weakestStage.key
                    ? "border-rose-400/45 bg-rose-500/10"
                    : "border-slate-800 bg-slate-950/72",
                )}
              >
                <p className="text-[11px] text-slate-400">{stage.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{stage.score}</p>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${ragClasses(stage.rag)}`}>{stage.rag}</span>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm font-semibold text-white">Weakest stage: {output.funnel.weakestStage.label}</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              {output.funnel.explanation.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {output.recommendedModules.slice(0, 3).map((module) => (
                <Button
                  key={module.id}
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
                >
                  <Link
                    href={module.href}
                    onClick={() =>
                      void postEvent("simulator_action_clicked", {
                        action: "funnel_module_click",
                        module: module.title,
                        href: module.href,
                        domain: domainLabel,
                      })
                    }
                  >
                    {module.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/30 bg-[linear-gradient(155deg,rgba(34,211,238,0.1),rgba(2,6,23,0.94))] p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Top 5 moves that move numbers next</p>
          <div className="mt-3 space-y-3">
            {output.topMoves.map((action, index) => (
              <article key={action.id} className="rounded-xl border border-slate-800 bg-slate-950/72 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">Move {index + 1}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{action.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{action.why}</p>
                <p className="mt-1 text-xs text-slate-400">Business impact: {action.businessImpact}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-slate-700 bg-slate-900/75 px-2 py-0.5 text-slate-200">Uplift +{action.upliftLowPct}% to +{action.upliftHighPct}%</span>
                  <span className="rounded-full border border-slate-700 bg-slate-900/75 px-2 py-0.5 text-slate-200">Effort: {action.effort}</span>
                  <span className="rounded-full border border-slate-700 bg-slate-900/75 px-2 py-0.5 text-slate-200">Impact: {action.timeToImpact}</span>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
                  >
                    <Link
                      href={action.diy.href}
                      onClick={() =>
                        void postEvent("simulator_action_clicked", {
                          action: "diy_click",
                          move: action.title,
                          href: action.diy.href,
                          domain: domainLabel,
                        })
                      }
                    >
                      DIY: {action.diy.label}
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                    <Link
                      href={`${action.doneForYou.href}&${topActionCtaQuery}`}
                      onClick={() =>
                        void postEvent("simulator_bespoke_plan_clicked", {
                          action: "bespoke_plan",
                          move: action.title,
                          href: action.doneForYou.href,
                          domain: domainLabel,
                        })
                      }
                    >
                      {action.doneForYou.label}
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Need a done-for-you rollout?</p>
              <p className="text-xs text-slate-300">We can implement this as Track 1 and own delivery with you.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                variant="outline"
                className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
              >
                <Link href="/services">View modules</Link>
              </Button>
              <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <Link
                  href={`/bespoke-plan?${topActionCtaQuery}`}
                  onClick={() =>
                    void postEvent("simulator_bespoke_plan_clicked", {
                      action: "final_cta",
                      domain: domainLabel,
                    })
                  }
                >
                  Create Bespoke Plan
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="mt-4 pl-0 text-slate-300 hover:bg-transparent hover:text-cyan-200"
            onClick={() => {
              setOutput(null);
              setStep(1);
            }}
          >
            Re-run simulator with different assumptions
          </Button>
        </section>

        <div className="fixed inset-x-0 bottom-[calc(0.65rem+env(safe-area-inset-bottom))] z-[66] px-4 md:hidden">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-950/95 p-2 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2">
              <Button asChild className="h-11 bg-cyan-300 text-sm text-slate-950 hover:bg-cyan-200">
                <Link href={`/bespoke-plan?${topActionCtaQuery}`}>Create plan</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-slate-700 bg-slate-900/75 text-sm text-slate-100 hover:bg-slate-800">
                <Link href="/services">Open modules</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-cyan-500/28 bg-[linear-gradient(160deg,rgba(56,189,248,0.16),rgba(15,23,42,0.94))] p-5 shadow-[0_30px_90px_rgba(2,6,23,0.62)] md:p-8",
        className,
      )}
    >
      <header className="mb-5 space-y-3">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
          <Sparkles className="size-3.5" />
          AI Growth Simulator
        </p>
        <h3 className="text-3xl font-semibold text-white md:text-4xl">Model your revenue system before you spend more</h3>
        <p className="max-w-3xl text-sm text-slate-300 md:text-base">
          You get a consultant-grade model: what this means, why it matters, and what to do next. Built for business owners, not analysts.
        </p>

        <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="inline-flex items-center gap-1.5"><Gauge className="size-3.5 text-cyan-300" /> Real readiness scores</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="inline-flex items-center gap-1.5"><Target className="size-3.5 text-cyan-300" /> Plain-English business impact</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="inline-flex items-center gap-1.5"><BarChart3 className="size-3.5 text-cyan-300" /> Click-through module actions</p>
          </div>
        </div>
      </header>

      {output ? renderResults() : renderWizard()}

      {mode === "preview" && !output ? (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
          <p className="font-semibold text-cyan-200">Want the full simulator workspace?</p>
          <p className="mt-1">Open the dedicated simulator page for the complete wizard, scenarios, and module routing.</p>
          <Button asChild size="sm" variant="outline" className="mt-3 border-slate-700 bg-slate-900/75 text-slate-100 hover:bg-slate-800">
            <Link href="/growth-simulator">Open full simulator</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
