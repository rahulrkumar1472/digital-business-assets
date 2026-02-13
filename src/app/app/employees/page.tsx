import Link from "next/link";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/app/employees" });

const modules = [
  {
    name: "AI Receptionist",
    description: "Handles first response, qualification, and handoff from web and chat channels.",
    status: "Deployable",
    href: "/services/ai-chatbot-install",
  },
  {
    name: "Follow-up Operator",
    description: "Runs timed reminders and conversion-chase sequences across channels.",
    status: "Deployable",
    href: "/services/follow-up-automation",
  },
  {
    name: "Call Recovery Agent",
    description: "Recovers missed calls and routes urgent prospects quickly.",
    status: "Deployable",
    href: "/services/call-tracking-missed-call-capture",
  },
  {
    name: "Search Growth Analyst",
    description: "Prioritises visibility and content actions from technical and conversion data.",
    status: "Deployable",
    href: "/services/seo-upgrade-pack",
  },
];

export default function BusinessOsEmployeesPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">AI employees</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">AI employee modules</h1>
        <p className="mt-3 text-sm text-slate-300">Deploy purpose-built AI modules as part of your Business OS operating stack.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.name} className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
            <p className="text-xs font-semibold tracking-[0.08em] text-cyan-300 uppercase">{module.status}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{module.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{module.description}</p>
            <Link href={module.href} className="mt-4 inline-flex text-xs font-semibold text-cyan-300 hover:text-cyan-200">
              View deployment module
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
