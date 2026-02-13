import { buildMetadata } from "@/lib/seo";
import { listRecentLeads } from "@/lib/scans/repository";

export const metadata = buildMetadata({ path: "/app/leads" });

function formatDate(input: Date | string) {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function BusinessOsLeadsPage() {
  const leads = await listRecentLeads(40);

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Leads</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Captured leads</h1>
        <p className="mt-3 text-sm text-slate-300">Lead records captured from free scan and growth workflows.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45">
        <div className="grid grid-cols-6 border-b border-slate-800 bg-slate-950/60 px-4 py-3 text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase md:px-6">
          <span>Name</span>
          <span>Business</span>
          <span>Mobile</span>
          <span>Website</span>
          <span>Reason</span>
          <span>Created</span>
        </div>

        {leads.length === 0 ? <p className="px-4 py-6 text-sm text-slate-300 md:px-6">No leads captured yet.</p> : null}

        {leads.map((lead) => (
          <div key={lead.id} className="grid grid-cols-6 border-b border-slate-800 px-4 py-3 text-xs text-slate-200 md:px-6 md:text-sm">
            <span>{lead.fullName}</span>
            <span>{lead.businessName}</span>
            <span>{lead.mobileNumber}</span>
            <span className="truncate pr-2">{lead.websiteUrl}</span>
            <span>{lead.reason}</span>
            <span>{formatDate(lead.createdAt)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
