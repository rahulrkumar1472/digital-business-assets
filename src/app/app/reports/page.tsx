import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { listRecentScans } from "@/lib/scans/repository";

export const metadata = buildMetadata({ path: "/app/reports" });

function formatDate(input: Date | string) {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function BusinessOsReportsPage() {
  const scans = await listRecentScans(30);

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Reports</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Website scan report library</h1>
        <p className="mt-3 text-sm text-slate-300">Review generated scans, open dashboard results, and download branded reports.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45">
        <div className="grid grid-cols-6 border-b border-slate-800 bg-slate-950/60 px-4 py-3 text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase md:px-6">
          <span>Business</span>
          <span>Website</span>
          <span>Status</span>
          <span>Concern</span>
          <span>Created</span>
          <span>Action</span>
        </div>

        {scans.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-300 md:px-6">No scans yet. Start one from the tools flow.</p>
        ) : null}

        {scans.map((scan) => (
          <div key={scan.id} className="grid grid-cols-6 border-b border-slate-800 px-4 py-3 text-xs text-slate-200 md:px-6 md:text-sm">
            <span>{scan.lead?.businessName || "-"}</span>
            <span className="truncate pr-2">{scan.websiteUrl}</span>
            <span>{scan.status}</span>
            <span>{scan.concern}</span>
            <span>{formatDate(scan.createdAt)}</span>
            <Link href={`/tools/website-audit/results/${scan.id}`} className="font-semibold text-cyan-300 hover:text-cyan-200">
              Open
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
