import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/app/settings" });

const items = [
  "CRM webhook URL and retry policy",
  "Lead routing defaults by module",
  "Audit report branding and PDF templates",
  "Team notification channels",
  "Environment health and API keys",
];

export default function BusinessOsSettingsPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Settings</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Business OS settings</h1>
        <p className="mt-3 text-sm text-slate-300">Configuration placeholders for production handoff and module operations.</p>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <h2 className="text-2xl font-semibold text-white">Configuration checklist</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {items.map((item) => (
            <li key={item} className="list-disc pl-1 marker:text-cyan-300">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
