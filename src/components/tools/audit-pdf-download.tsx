"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getStoredLead } from "@/lib/leads/client";

function hasLeadIdentity() {
  const lead = getStoredLead();
  if (!lead) {
    return false;
  }
  return Boolean(lead.name?.trim() && lead.businessName?.trim() && lead.email?.trim());
}

function buildFilename(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, "").replace(/[^a-z0-9.-]/gi, "-");
    return `website-growth-audit-${hostname}.pdf`;
  } catch {
    return "website-growth-audit.pdf";
  }
}

type AuditPdfDownloadProps = {
  queryString: string;
  url: string;
};

export function AuditPdfDownload({ queryString, url }: AuditPdfDownloadProps) {
  const startedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const queryStringSafe = useMemo(() => queryString || `url=${encodeURIComponent(url)}`, [queryString, url]);
  const backHref = `/tools/website-audit/results?${queryStringSafe}`;
  const leadReady = hasLeadIdentity();

  const downloadPdf = useCallback(async () => {
    if (!leadReady) {
      setMessage("Please capture lead details in the report before generating PDF.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/audit/pdf?${queryStringSafe}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const fallback = await response.json().catch(() => ({} as { error?: string }));
        throw new Error(fallback.error || "Could not generate PDF.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = buildFilename(url);
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      setMessage("PDF downloaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PDF generation failed.");
    } finally {
      setLoading(false);
    }
  }, [leadReady, queryStringSafe, url]);

  useEffect(() => {
    if (!leadReady || loading || startedRef.current) {
      return;
    }
    startedRef.current = true;
    void downloadPdf();
  }, [downloadPdf, leadReady, loading]);

  return (
    <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/55 p-6 md:p-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Website Growth Audit PDF</p>
      <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Download your branded 4-page report</h1>
      <p className="mt-3 text-sm text-slate-300">
        This export includes your scorecards, top findings, implementation plan, and clickable next-step links.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={downloadPdf} disabled={loading} className="sm:min-w-52">
          {loading ? "Generating PDF..." : "Download PDF"}
        </Button>
        <Button asChild variant="outline" className="border-slate-700 bg-slate-900/65 text-slate-100 hover:bg-slate-800">
          <Link href={backHref}>Back to report</Link>
        </Button>
      </div>

      {!leadReady ? (
        <p className="mt-4 text-sm text-amber-200">
          Lead details are required before export. Return to your report and use the Email/PDF action to complete capture.
        </p>
      ) : null}

      {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}
    </section>
  );
}
