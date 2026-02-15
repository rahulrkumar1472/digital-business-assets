import Link from "next/link";

import { FollowUpEmailButton } from "@/components/admin/follow-up-email-button";
import { listLeadVaultRows } from "@/lib/admin/lead-vault";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/admin/leads" });

function scoreBadge(score: number | null) {
  if (typeof score !== "number") {
    return "border-slate-700 bg-slate-900/70 text-slate-300";
  }
  if (score >= 90) return "border-emerald-400/35 bg-emerald-500/15 text-emerald-200";
  if (score >= 50) return "border-amber-400/35 bg-amber-500/15 text-amber-200";
  return "border-rose-400/35 bg-rose-500/15 text-rose-200";
}

function leadScoreBadge(temperature: "hot" | "warm" | "cold", score: number) {
  if (temperature === "hot") {
    return {
      label: `🔥 HOT (${score})`,
      className: "border-rose-400/35 bg-rose-500/15 text-rose-200",
    };
  }
  if (temperature === "warm") {
    return {
      label: `🟡 WARM (${score})`,
      className: "border-amber-400/35 bg-amber-500/15 text-amber-200",
    };
  }
  return {
    label: `⚪ COLD (${score})`,
    className: "border-slate-700 bg-slate-900/70 text-slate-300",
  };
}

type LeadListPageContext = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function AdminLeadsPage({ searchParams }: LeadListPageContext) {
  const params = await searchParams;
  const sortBy = params.sort === "recent" ? "recent" : "score";
  const rows = await listLeadVaultRows(sortBy);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">Lead Vault</h2>
        <p className="mt-2 text-sm text-slate-300">
          Captured leads with latest score context, intent signals, and operator action routing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/admin/leads?sort=score"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              sortBy === "score"
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
                : "border-slate-700 bg-slate-900/75 text-slate-200 hover:bg-slate-800"
            }`}
          >
            Sort: Lead score
          </Link>
          <Link
            href="/admin/leads?sort=recent"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              sortBy === "recent"
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
                : "border-slate-700 bg-slate-900/75 text-slate-200 hover:bg-slate-800"
            }`}
          >
            Sort: Last seen
          </Link>
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/45 md:block">
        {rows.length ? (
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-950/80 text-xs tracking-[0.08em] text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Overall score</th>
                <th className="px-4 py-3">Lead score</th>
                <th className="px-4 py-3">Last seen</th>
                <th className="px-4 py-3">Intent</th>
                <th className="px-4 py-3">Next action</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const leadBadge = leadScoreBadge(row.leadTemperature, row.leadScore);

                return (
                  <tr key={row.id} className="border-t border-slate-800/80 align-top">
                    <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.phone}</td>
                    <td className="px-4 py-3 max-w-[220px] truncate">
                      <a href={row.reportHref} className="text-cyan-200 hover:text-cyan-100">
                        {row.url}
                      </a>
                    </td>
                    <td className="px-4 py-3">{row.source}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreBadge(row.overallScore)}`}>
                        {typeof row.overallScore === "number" ? row.overallScore : "n/a"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${leadBadge.className}`}>
                        {leadBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                      {row.lastSeen.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">{row.intentTier}</td>
                    <td className="px-4 py-3 max-w-[220px] text-slate-300">{row.nextAction}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <Link href={row.reportHref} className="text-cyan-200 hover:text-cyan-100">
                          View Report
                        </Link>
                        <Link href={`/admin/leads/${row.id}#timeline`} className="text-cyan-200 hover:text-cyan-100">
                          View Timeline
                        </Link>
                        <FollowUpEmailButton leadId={row.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-sm text-slate-300">No leads captured yet.</p>
        )}
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.length ? (
          rows.map((row) => {
            const leadBadge = leadScoreBadge(row.leadTemperature, row.leadScore);

            return (
              <article key={`mobile-${row.id}`} className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-white">{row.name}</p>
                    <p className="text-xs text-slate-400">{row.email}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreBadge(row.overallScore)}`}>
                    {typeof row.overallScore === "number" ? row.overallScore : "n/a"}
                  </span>
                </div>

                <p className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${leadBadge.className}`}>
                  {leadBadge.label}
                </p>

                <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                  <li>Phone: {row.phone}</li>
                  <li>URL: {row.url}</li>
                  <li>Source: {row.source}</li>
                  <li>Intent: {row.intentTier}</li>
                  <li>Last seen: {row.lastSeen.toLocaleString("en-GB")}</li>
                </ul>

                <p className="mt-2 text-sm text-slate-300">Next action: {row.nextAction}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={row.reportHref}
                    className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-cyan-200"
                  >
                    View Report
                  </Link>
                  <Link
                    href={`/admin/leads/${row.id}#timeline`}
                    className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-cyan-200"
                  >
                    View Timeline
                  </Link>
                  <FollowUpEmailButton leadId={row.id} />
                </div>
              </article>
            );
          })
        ) : (
          <p className="rounded-xl border border-slate-800 bg-slate-900/55 p-4 text-sm text-slate-300">No leads captured yet.</p>
        )}
      </div>
    </section>
  );
}
