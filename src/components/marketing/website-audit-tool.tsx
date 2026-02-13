"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, ExternalLink, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const concerns = ["No leads", "Low conversion", "Slow replies", "Bad SEO", "Need website", "All of it"] as const;

const industries = [
  "Trades",
  "Clinics",
  "Gyms",
  "Dentists",
  "Law Firms",
  "Real Estate",
  "Ecommerce",
  "Local Services",
  "Other",
];

type AuditResponse = {
  success?: boolean;
  error?: string;
  auditId?: string;
  scores?: {
    performance: number;
    seo: number;
    accessibility: number;
  };
  recommendations?: string[];
  downloadUrl?: string;
  templateUrl?: string;
};

export function WebsiteAuditTool() {
  const [form, setForm] = useState({
    websiteUrl: "",
    name: "",
    email: "",
    phone: "",
    industry: "Trades",
    concern: "All of it",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResponse | null>(null);

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/website-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as AuditResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not generate audit report.");
      }

      setResult(data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not generate audit report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6 md:p-7">
        <h2 className="text-2xl font-semibold text-white">Run your website audit</h2>
        <p className="mt-2 text-sm text-slate-300">Get performance, SEO, and conversion findings with screenshots and action priorities.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Website URL</label>
            <Input
              value={form.websiteUrl}
              onChange={(event) => onChange("websiteUrl", event.target.value)}
              className="border-slate-700 bg-slate-950/70 text-slate-100"
              placeholder="https://example.co.uk"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Name</label>
            <Input value={form.name} onChange={(event) => onChange("name", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Email</label>
            <Input type="email" value={form.email} onChange={(event) => onChange("email", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Phone</label>
            <Input value={form.phone} onChange={(event) => onChange("phone", event.target.value)} className="border-slate-700 bg-slate-950/70 text-slate-100" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Industry</label>
            <select
              value={form.industry}
              onChange={(event) => onChange("industry", event.target.value)}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Primary concern</label>
            <select
              value={form.concern}
              onChange={(event) => onChange("concern", event.target.value)}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100"
            >
              {concerns.map((concern) => (
                <option key={concern} value={concern}>
                  {concern}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <Button className="mt-6 w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Building your report...
            </>
          ) : (
            "Generate Website Audit"
          )}
        </Button>

        <p className="mt-3 text-xs text-slate-400">Terms apply. Growth depends on implementation and market conditions.</p>
      </form>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/45 p-6 md:p-7">
        <h3 className="text-2xl font-semibold text-white">What you get</h3>
        <ul className="space-y-2 text-sm text-slate-200">
          <li className="list-disc pl-1 marker:text-cyan-300">Lighthouse performance, SEO, and accessibility snapshot</li>
          <li className="list-disc pl-1 marker:text-cyan-300">Technical SEO checks: title, meta, H1, canonical, robots, sitemap</li>
          <li className="list-disc pl-1 marker:text-cyan-300">Desktop + mobile screenshots for visual QA</li>
          <li className="list-disc pl-1 marker:text-cyan-300">Bespoke premium PDF with practical next actions</li>
        </ul>

        <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          <p className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck className="size-4" />
            Mobile-first context
          </p>
          <p className="mt-1 text-xs text-cyan-50">80%+ users browse on mobile. A slow or unclear mobile experience leaks ready-to-buy traffic fast.</p>
        </div>

        {result?.scores ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-4">
            <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">Audit result</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"><p className="text-xs text-slate-400">Performance</p><p className="mt-1 text-xl font-semibold text-white">{result.scores.performance}</p></div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"><p className="text-xs text-slate-400">SEO</p><p className="mt-1 text-xl font-semibold text-white">{result.scores.seo}</p></div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"><p className="text-xs text-slate-400">Accessibility</p><p className="mt-1 text-xl font-semibold text-white">{result.scores.accessibility}</p></div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {result.recommendations?.map((item) => (
                <li key={item} className="list-disc pl-1 marker:text-cyan-300">{item}</li>
              ))}
            </ul>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {result.downloadUrl ? (
                <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                  <a href={result.downloadUrl}>
                    <Download className="size-4" />
                    Download PDF
                  </a>
                </Button>
              ) : null}
              {result.templateUrl ? (
                <Button asChild variant="outline" className="border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-800">
                  <Link href={result.templateUrl} target="_blank">
                    Preview report
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-4 text-sm text-slate-300">
            Your completed audit appears here with scores, recommendations, and download links.
          </div>
        )}
      </div>
    </div>
  );
}
