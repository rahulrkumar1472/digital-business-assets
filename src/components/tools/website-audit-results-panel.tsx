"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type ScanStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

type ScanApiResponse = {
  success?: boolean;
  error?: string;
  scan?: {
    id: string;
    status: ScanStatus;
    progress: number;
    concern: string;
    industry: string;
    websiteUrl: string;
    scores: {
      performance: number;
      seo: number;
      accessibility: number;
    } | null;
    insights: string[];
    recommendations: string[];
    upgradeCards: Array<{
      title: string;
      reason: string;
      serviceSlug: string;
      fromPrice: string;
    }>;
    errorMessage: string | null;
    downloadUrl: string;
  };
  lead?: {
    fullName: string;
    businessName: string;
  } | null;
};

type WebsiteAuditResultsPanelProps = {
  scanId: string;
};

const statusText: Record<ScanStatus, string> = {
  QUEUED: "Queued and preparing scan engine...",
  PROCESSING: "Running checks and generating your branded report...",
  COMPLETED: "Scan complete. Review your dashboard below.",
  FAILED: "Scan failed. You can retry with our team.",
};

export function WebsiteAuditResultsPanel({ scanId }: WebsiteAuditResultsPanelProps) {
  const [data, setData] = useState<ScanApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const load = async () => {
      try {
        const response = await fetch(`/api/tools/website-audit/${scanId}`, {
          cache: "no-store",
        });

        const json = (await response.json()) as ScanApiResponse;
        if (cancelled) {
          return;
        }

        if (!response.ok || !json.success || !json.scan) {
          throw new Error(json.error || "Could not load scan status.");
        }

        setData(json);
        setError(null);

        if (json.scan.status === "QUEUED" || json.scan.status === "PROCESSING") {
          timeoutId = setTimeout(load, 2200);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Could not load scan status.");
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [scanId]);

  const progress = useMemo(() => {
    if (!data?.scan) {
      return 12;
    }

    return Math.min(100, Math.max(8, data.scan.progress));
  }, [data]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/35 bg-red-500/10 p-6 text-sm text-red-100">
        <p className="inline-flex items-center gap-2 font-semibold">
          <AlertTriangle className="size-4" />
          {error}
        </p>
      </div>
    );
  }

  if (!data?.scan) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6 text-sm text-slate-200">
        <p className="inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          Loading scan status...
        </p>
      </div>
    );
  }

  const { scan } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">Scan status</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{scan.websiteUrl}</h2>
        <p className="mt-2 text-sm text-slate-300">{statusText[scan.status]}</p>
        {data.lead ? <p className="mt-1 text-xs text-slate-400">Prepared for {data.lead.fullName} · {data.lead.businessName}</p> : null}

        <div className="mt-4 h-2 rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-cyan-300 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {scan.status === "FAILED" ? (
        <div className="rounded-2xl border border-red-500/35 bg-red-500/10 p-6 text-sm text-red-100">
          <p>Scan failed: {scan.errorMessage || "Unknown failure"}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <Link href="/tools/website-audit/start">Retry scan</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800">
              <Link href="/book">Book a consultant</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {scan.status === "COMPLETED" ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <p className="text-xs text-slate-400">Performance score</p>
              <p className="mt-2 text-3xl font-semibold text-white">{scan.scores?.performance ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <p className="text-xs text-slate-400">SEO score</p>
              <p className="mt-2 text-3xl font-semibold text-white">{scan.scores?.seo ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <p className="text-xs text-slate-400">Accessibility score</p>
              <p className="mt-2 text-3xl font-semibold text-white">{scan.scores?.accessibility ?? "-"}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <h3 className="text-xl font-semibold text-white">Top insights</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {scan.insights.map((insight) => (
                  <li key={insight} className="list-disc pl-1 marker:text-cyan-300">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
              <h3 className="text-xl font-semibold text-white">Priority recommendations</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {scan.recommendations.map((item) => (
                  <li key={item} className="list-disc pl-1 marker:text-cyan-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
            <h3 className="text-2xl font-semibold text-white">Fix this now: recommended upgrades</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {scan.upgradeCards.map((card) => (
                <article key={card.serviceSlug} className="rounded-xl border border-slate-700 bg-slate-950/65 p-4">
                  <h4 className="text-base font-semibold text-white">{card.title}</h4>
                  <p className="mt-1 text-xs text-cyan-200">{card.fromPrice}</p>
                  <p className="mt-2 text-sm text-slate-300">{card.reason}</p>
                  <Link href={`/services/${card.serviceSlug}`} className="mt-3 inline-flex text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                    View service
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <a href={scan.downloadUrl}>Download PDF report</a>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800">
              <Link href="/pricing">View pricing tiers</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800">
              <Link href="/book">Book strategy call</Link>
            </Button>
          </div>

          <p className="inline-flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="size-3.5 text-cyan-300" />
            This is a diagnostic estimate. Final outcomes depend on implementation quality and market conditions.
          </p>
        </>
      ) : null}
    </div>
  );
}
