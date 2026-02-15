"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, Globe, Loader2, Mail, Phone, ShieldCheck, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { setStoredTrack } from "@/lib/funnel/store";
import { storeLead } from "@/lib/leads/client";

type Step = 1 | 2 | 3;

type FieldErrors = {
  websiteUrl?: string;
  name?: string;
  email?: string;
  phone?: string;
};

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
  { step: 3, label: "Competitors" },
];

export function WebsiteAuditOnboarding() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState<"service" | "local" | "ecom">("service");
  const [goal, setGoal] = useState<"leads" | "sales">("leads");
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

  const continueLabel = step < 3 ? "Continue" : submitting ? "Generating report..." : "Run Free Scan";

  const validateStep = () => {
    const nextFieldErrors: FieldErrors = {};

    if (step === 1) {
      if (!normalizedWebsite) {
        nextFieldErrors.websiteUrl = "Enter a valid website URL.";
        setFieldErrors(nextFieldErrors);
        setError("Please correct the highlighted field.");
        return false;
      }
      setFieldErrors(nextFieldErrors);
      return true;
    }

    if (step === 2) {
      if (!name.trim()) {
        nextFieldErrors.name = "Name is required.";
      }
      if (!emailIsValid(email.trim())) {
        nextFieldErrors.email = "Enter a valid email address.";
      }
      if (!phoneLooksValid(phone)) {
        nextFieldErrors.phone = "Enter a valid phone number.";
      }
      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors);
        setError("Please correct the highlighted fields.");
        return false;
      }
      setFieldErrors(nextFieldErrors);
      return true;
    }

    setFieldErrors(nextFieldErrors);
    return true;
  };

  const submitOnboarding = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/audit/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          businessName: businessName.trim(),
          url: normalizedWebsite,
          industry,
          goal,
          competitors: competitorDomains,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        leadId?: string;
        auditRunId?: string;
        message?: string;
      };
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
      if (result.leadId) {
        query.set("leadId", result.leadId);
      }
      if (result.auditRunId) {
        query.set("auditRunId", result.auditRunId);
      }
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
    setFieldErrors({});
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
      return;
    }

    if (step === 3) {
      void submitOnboarding();
    }
  };

  return (
    <div className="space-y-5 pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-0">
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
                  <li>• Overall score + scorecards (Performance / SEO / Best Practices / Accessibility / Customer Experience)</li>
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
            {step === 1 ? "Start with your website" : step === 2 ? "Where should we send your report?" : "Optional competitor benchmark"}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {step === 1
              ? "Enter your website URL first. This takes around 30 seconds."
              : step === 2
                ? "We capture your details once so your report and follow-up actions are linked properly."
                : "Add up to three competitor domains if you want side-by-side comparison in your report."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">
                  <Globe className="size-3.5 text-cyan-300" />
                  Website URL
                </label>
                <Input
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://yourbusiness.co.uk"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100 placeholder:text-slate-500"
                />
                {fieldErrors.websiteUrl ? <p className="text-xs text-rose-300">{fieldErrors.websiteUrl}</p> : null}
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Primary goal</label>
                <select
                  value={goal}
                  onChange={(event) => setGoal(event.target.value as "leads" | "sales")}
                  className="h-12 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-base text-slate-100"
                >
                  <option value="leads">More leads</option>
                  <option value="sales">More sales</option>
                </select>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">
                    <User className="size-3.5 text-cyan-300" />
                    Name
                  </label>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                  {fieldErrors.name ? <p className="text-xs text-rose-300">{fieldErrors.name}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">
                    <Building2 className="size-3.5 text-cyan-300" />
                    Business name (recommended)
                  </label>
                  <Input
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Your business"
                    autoComplete="organization"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">
                    <Mail className="size-3.5 text-cyan-300" />
                    Email
                  </label>
                  <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="you@business.co.uk"
                    autoComplete="email"
                    inputMode="email"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                  {fieldErrors.email ? <p className="text-xs text-rose-300">{fieldErrors.email}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">
                    <Phone className="size-3.5 text-cyan-300" />
                    Phone
                  </label>
                  <Input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+44 7..."
                    autoComplete="tel"
                    inputMode="tel"
                    className="h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
                  />
                  <p className="text-[11px] text-slate-400">UK format preferred. Example: +44 7700 900123</p>
                  {fieldErrors.phone ? <p className="text-xs text-rose-300">{fieldErrors.phone}</p> : null}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-3 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">No spam. Clear next steps only.</p>
                <p className="mt-1">We send your report and one follow-up with the highest-impact actions. Unsubscribe anytime.</p>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3">
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
                <p className="text-xs text-slate-400">Only add competitors you want compared directly in this report.</p>
              </div>
              <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/10 p-4 text-sm text-slate-200">
                <p className="font-semibold text-cyan-100">What you get after submit</p>
                <ul className="mt-2 space-y-1 text-slate-200">
                  <li>• PSI-style scorecards + RAG findings.</li>
                  <li>• 14-day action plan and recommended modules.</li>
                  <li>• Premium 4-page PDF report you can share.</li>
                </ul>
              </div>
            </div>
          ) : null}

          <Separator className="bg-slate-800" />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-cyan-300" />
              No spam. One follow-up max.
            </span>
            <span>Takes 30 seconds · SSL secure submission</span>
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
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
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
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {continueLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
