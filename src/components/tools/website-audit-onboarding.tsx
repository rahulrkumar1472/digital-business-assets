"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, Loader2, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { setStoredTrack } from "@/lib/funnel/store";
import { storeLead } from "@/lib/leads/client";

type Step = 1 | 2 | 3;

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(candidate).toString();
  } catch {
    return "";
  }
}

function normalizeDomain(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(candidate).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function emailIsValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function phoneLooksValid(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9;
}

const stepLabels: Array<{ step: Step; label: string }> = [
  { step: 1, label: "Website" },
  { step: 2, label: "Contact" },
  { step: 3, label: "Confirm" },
];

export function WebsiteAuditOnboarding() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState<"service" | "local" | "ecom">("service");
  const [goal] = useState<"leads" | "sales">("leads");
  const [competitors, setCompetitors] = useState(["", "", ""]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");

  const normalizedWebsite = useMemo(() => normalizeUrl(websiteUrl), [websiteUrl]);
  const progress = (step / 3) * 100;

  const competitorDomains = useMemo(
    () =>
      Array.from(
        new Set(
          competitors
            .map((item) => ({ raw: item, normalized: normalizeDomain(item) }))
            .filter((item) => item.raw.trim().length > 0 && item.normalized)
            .map((item) => item.normalized),
        ),
      ).slice(0, 3),
    [competitors],
  );

  const continueLabel = step < 3 ? "Continue" : submitting ? "Generating report..." : "Generate report";

  const validateStep = () => {
    if (step === 1) {
      if (!normalizedWebsite) {
        setError("Please enter a valid website URL.");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!name.trim()) {
        setError("Please enter your name.");
        return false;
      }
      if (!email.trim() || !emailIsValid(email.trim())) {
        setError("Please enter a valid email.");
        return false;
      }
      if (!phoneLooksValid(phone)) {
        setError("Please enter a valid phone number.");
        return false;
      }
      return true;
    }

    return true;
  };

  const submitOnboarding = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          businessName: businessName.trim(),
          website: normalizedWebsite,
          source: "audit_start",
          pagePath: "/tools/website-audit/start",
          auditReport: {
            onboarding: {
              industry,
              goal,
              competitors: competitorDomains,
              startedAt: new Date().toISOString(),
            },
          },
        }),
      });

      const result = (await response.json()) as { ok?: boolean; leadId?: string; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Could not start your report right now.");
      }

      storeLead({
        leadId: result.leadId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        businessName: businessName.trim(),
        website: normalizedWebsite,
      });
      setStoredTrack("track2");

      const query = new URLSearchParams({
        url: normalizedWebsite,
        industry,
        goal,
      });
      if (businessName.trim()) {
        query.set("businessName", businessName.trim());
      }
      if (competitorDomains.length) {
        query.set("competitors", competitorDomains.join(","));
      }

      router.push(`/tools/website-audit/results?${query.toString()}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not start your report right now.");
      setStep(2);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  const onContinue = () => {
    setError(null);
    const valid = validateStep();
    if (!valid) {
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      void submitOnboarding();
    }
  };

  return (
    <div className="space-y-5 pb-28 md:pb-0">
      <Card className="overflow-hidden border-slate-800 bg-slate-900/55">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline" className="border-cyan-400/40 bg-cyan-400/10 text-cyan-100">
              Step {step} of 3
            </Badge>
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" size="sm" variant="outline" className="border-slate-700 bg-slate-900/65 text-slate-100 hover:bg-slate-800">
                  What you&apos;ll get
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="border-slate-800 bg-slate-950 text-slate-100">
                <SheetHeader>
                  <SheetTitle>What your free report includes</SheetTitle>
                </SheetHeader>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>• Overall score + category scorecards (Speed / SEO / Conversion / Trust / Visibility)</li>
                  <li>• Top 10 issues with effort and business impact</li>
                  <li>• 14-day implementation plan + module recommendations</li>
                  <li>• Competitor benchmark if you add competitor domains</li>
                </ul>
              </SheetContent>
            </Sheet>
          </div>

          <div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              {stepLabels.map((item) => (
                <span key={item.step} className={item.step === step ? "text-cyan-200" : "text-slate-500"}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <CardTitle className="text-2xl text-white md:text-3xl">
            {step === 1 ? "Start with your website" : step === 2 ? "Where should we send your report?" : "Generating your consultant audit"}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {step === 1
              ? "Enter your website URL first. Add industry and competitors in Advanced only if you want deeper benchmarking."
              : step === 2
                ? "We capture your details once so your report and follow-up actions are linked properly."
                : "We are scoring your website, building top findings, and preparing your 14-day plan."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Website URL</label>
                <Input
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://yourbusiness.co.uk"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Industry (optional)</label>
                <select
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value as "service" | "local" | "ecom")}
                  className="h-12 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-base text-slate-100"
                >
                  <option value="service">Service</option>
                  <option value="local">Local</option>
                  <option value="ecom">Ecommerce</option>
                </select>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase"
                  onClick={() => setAdvancedOpen((previous) => !previous)}
                >
                  <ChevronDown className={`size-3.5 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                  Advanced benchmark (optional)
                </button>

                {advancedOpen ? (
                  <div className="grid gap-2 rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                    {[0, 1, 2].map((index) => (
                      <Input
                        key={`competitor-${index + 1}`}
                        value={competitors[index] || ""}
                        onChange={(event) =>
                          setCompetitors((previous) =>
                            previous.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
                          )
                        }
                        placeholder={`Competitor ${index + 1} domain (optional)`}
                        inputMode="url"
                        autoComplete="off"
                        className="h-11 border-slate-700 bg-slate-900 text-slate-100"
                      />
                    ))}
                    <p className="text-xs text-slate-400">Add up to 3 competitor domains for side-by-side benchmarking.</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Name</label>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Business name (recommended)</label>
                  <Input
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Your business"
                    autoComplete="organization"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Email</label>
                  <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="you@business.co.uk"
                    autoComplete="email"
                    inputMode="email"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Phone</label>
                  <Input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+44 7..."
                    autoComplete="tel"
                    inputMode="tel"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                  <p className="text-[11px] text-slate-400">UK format preferred. Example: +44 7700 900123</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-3 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">No spam. Clear next steps only.</p>
                <p className="mt-1">We send your report and one follow-up with the highest-impact actions. Unsubscribe anytime.</p>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-500/10 p-4 text-sm text-slate-200">
              <p className="inline-flex items-center gap-2 font-semibold text-cyan-100">
                <Loader2 className="size-4 animate-spin" />
                Generating your report
              </p>
              <ul className="space-y-1 text-slate-200">
                <li>• Building your overall score + category scorecards.</li>
                <li>• Ranking top issues with effort and estimated business impact.</li>
                <li>• Creating a practical 14-day implementation plan.</li>
                <li>• Adding competitor benchmark if competitor domains were supplied.</li>
              </ul>
              <p className="text-xs text-slate-300">You will be redirected automatically in a few seconds.</p>
            </div>
          ) : null}

          <Separator className="bg-slate-800" />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-cyan-300" />
              No spam. One follow-up max.
            </span>
            <span>SSL secure submission</span>
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <div className="hidden md:flex md:justify-between md:gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-slate-700 bg-slate-900/65 text-slate-100 hover:bg-slate-800"
              onClick={() => setStep((previous) => (previous > 1 ? ((previous - 1) as Step) : previous))}
              disabled={step === 1 || submitting}
            >
              Back
            </Button>
            <Button
              type="button"
              className="min-w-52 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              onClick={onContinue}
              disabled={submitting}
            >
              {submitting && step === 3 ? <Loader2 className="size-4 animate-spin" /> : null}
              {continueLabel}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-4 text-xs text-slate-300">
        <p className="inline-flex items-center gap-2 font-semibold text-cyan-200">
          <CheckCircle2 className="size-4" />
          Trust note
        </p>
        <p className="mt-1">No spam. We send the report + one follow-up with next steps. Unsubscribe anytime.</p>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(0.6rem+env(safe-area-inset-bottom))] z-[74] px-4 md:hidden">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-950/95 p-2 backdrop-blur-xl">
          <Button type="button" className="h-12 w-full bg-cyan-300 text-base text-slate-950 hover:bg-cyan-200" onClick={onContinue} disabled={submitting}>
            {submitting && step === 3 ? <Loader2 className="size-4 animate-spin" /> : null}
            {continueLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
