import { buildMetadata } from "@/lib/seo";
import { getLeadVaultAnalytics } from "@/lib/admin/lead-vault";

export const metadata = buildMetadata({ path: "/admin/analytics" });

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

const kpiConfig = [
  {
    key: "leadsPerDay",
    label: "Leads / day",
    note: "Last 30 days",
    formatter: (value: number) => value.toFixed(2),
  },
  {
    key: "auditCompletionRate",
    label: "Audit completion",
    note: "audit_completed vs audit_started",
    formatter: (value: number) => formatPercent(value),
  },
  {
    key: "pdfDownloadRate",
    label: "PDF download",
    note: "pdf_downloaded vs audit_completed",
    formatter: (value: number) => formatPercent(value),
  },
  {
    key: "moduleClickRate",
    label: "Module click",
    note: "module_clicked vs audit_completed",
    formatter: (value: number) => formatPercent(value),
  },
  {
    key: "simulatorCompletionRate",
    label: "Simulator completion",
    note: "simulator_completed vs simulator_started",
    formatter: (value: number) => formatPercent(value),
  },
  {
    key: "leadCount30d",
    label: "Leads captured",
    note: "Last 30 days",
    formatter: (value: number) => formatNumber(value),
  },
] as const;

export default async function AdminAnalyticsPage() {
  const analytics = await getLeadVaultAnalytics();

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Lead Vault Analytics</h2>
        <p className="mt-2 text-sm text-slate-300">
          KPI view for lead velocity, conversion behavior, and where the funnel is currently weakest.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpiConfig.map((card) => (
          <article key={card.key} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs tracking-[0.08em] text-slate-400 uppercase">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{card.formatter(analytics[card.key])}</p>
            <p className="mt-1 text-xs text-slate-500">{card.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
          <h3 className="text-lg font-semibold text-white">Top Industries (90 days)</h3>
          <div className="mt-3 space-y-2">
            {analytics.topIndustries.length ? (
              analytics.topIndustries.map((entry) => (
                <div key={entry.label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/55 px-3 py-2 text-sm">
                  <span className="text-slate-200">{entry.label}</span>
                  <span className="font-medium text-cyan-200">{formatNumber(entry.count)}</span>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-slate-800 bg-slate-950/55 p-3 text-sm text-slate-300">
                No simulator industry data yet.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
          <h3 className="text-lg font-semibold text-white">Top Weakest Funnel Stage</h3>
          <div className="mt-3 space-y-2">
            {analytics.topWeakestStages.length ? (
              analytics.topWeakestStages.map((entry) => (
                <div key={entry.label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/55 px-3 py-2 text-sm">
                  <span className="text-slate-200">{entry.label}</span>
                  <span className="font-medium text-amber-200">{formatNumber(entry.count)}</span>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-slate-800 bg-slate-950/55 p-3 text-sm text-slate-300">
                No weakest-stage data yet.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
