"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  Wrench,
} from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Button } from "@/components/ui/button";
import { MetricRing } from "@/components/visuals/metric-ring";
import { OsMap } from "@/components/visuals/os-map";
import { ScanTimeline } from "@/components/visuals/scan-timeline";
import { buildGrowthAuditReport, type LiveAuditSignal } from "@/lib/scans/growth-audit-report";

type WebsiteGrowthReportProps = {
  url: string;
  industry?: string;
  goal?: string;
  liveSignal?: LiveAuditSignal | null;
};

const timelineSteps = ["Speed", "SEO", "Conversion", "Trust"];

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type MatrixQuadrant = "high-low" | "high-high" | "low-low" | "low-high";

type PriorityAction = {
  label: string;
  quadrant: MatrixQuadrant;
};

export function WebsiteGrowthReport({ url, industry, goal, liveSignal = null }: WebsiteGrowthReportProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const report = useMemo(() => buildGrowthAuditReport({ url, industry, goal }, { liveSignal }), [url, industry, goal, liveSignal]);

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

  const industryLower = (industry || "").toLowerCase();
  const goalLower = (goal || "").toLowerCase();
  const isEcom = /(ecom|e-commerce|shop|store|retail|d2c)/.test(industryLower);
  const isLocalOrService = /(local|service|trade|clinic|medical|dent|estate|beauty|plumb|electric)/.test(industryLower);
  const focusesLeads = /(lead|enquir|inbound|contact)/.test(goalLower);
  const focusesSales = /(sale|sales|checkout|order|pricing|revenue)/.test(goalLower);

  const categoryScores = [
    { key: "speed", label: "speed", value: report.speedScore },
    { key: "seo", label: "SEO", value: report.seoScore },
    { key: "conversion", label: "conversion", value: report.conversionScore },
    { key: "trust", label: "trust", value: report.trustScore },
  ].sort((a, b) => a.value - b.value);

  const upsideMin = Math.max(8, Math.round((100 - report.score) * 0.35));
  const upsideMax = upsideMin + Math.max(6, Math.round((100 - report.score) * 0.2));

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

  const copyShareLink = async () => {
    try {
      const shareLink = `${window.location.origin}/tools/website-audit/results?${reportQuery}`;
      await navigator.clipboard.writeText(shareLink);
      setToast("Share link copied.");
    } catch {
      setToast("Could not copy link. Please copy from your browser address bar.");
    }
  };

  const saveEmailLead = async () => {
    if (!emailIsValid(email)) {
      setEmailStatus("error");
      setToast("Please enter a valid email address.");
      return;
    }

    setEmailStatus("saving");
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: report.normalizedUrl,
          industry: industry || "General",
          goal: goal || "All of it",
          email,
          scores: {
            score: report.score,
            speedScore: report.speedScore,
            seoScore: report.seoScore,
            conversionScore: report.conversionScore,
            trustScore: report.trustScore,
          },
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("bad-response");
      }

      setEmailStatus("done");
      setToast("Report details saved. We will send export updates to your email.");
      setEmailModalOpen(false);
      setEmail("");
    } catch {
      setEmailStatus("error");
      setToast("Could not save email right now. Please try again.");
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
                      onClick={() => setToast("Export PDF is coming soon.")}
                    >
                      <FileDown className="size-3.5" />
                      Export PDF (coming soon)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-slate-700 bg-slate-950/75 text-slate-100 backdrop-blur hover:bg-slate-900"
                      onClick={() => setEmailModalOpen(true)}
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

      {emailModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-lg font-semibold text-white">Email me this report</h3>
            <p className="mt-1 text-sm text-slate-300">
              Soft gate only. You still keep full access here. We will use this only for report follow-up.
            </p>
            <label className="mt-4 block text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Email address</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.co.uk"
              className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
            <div className="mt-4 flex gap-2">
              <Button
                onClick={saveEmailLead}
                disabled={emailStatus === "saving"}
                className="flex-1 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              >
                {emailStatus === "saving" ? "Saving..." : "Save email"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                onClick={() => {
                  setEmailModalOpen(false);
                  setEmailStatus("idle");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
