import Link from "next/link";
import { ArrowRight, Gauge, LayoutDashboard, Layers3 } from "lucide-react";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/app" });

const cards = [
  {
    title: "Track 1 deployments",
    detail: "Launch and manage 72-hour online setups with clear module handoff.",
    href: "/services",
    icon: Layers3,
  },
  {
    title: "Track 2 scan operations",
    detail: "Review free scans, reports, and fix-now upgrade opportunities.",
    href: "/app/reports",
    icon: Gauge,
  },
  {
    title: "Growth command center",
    detail: "Use simulator outputs and lead intelligence to prioritise action.",
    href: "/app/simulator",
    icon: LayoutDashboard,
  },
];

export default function BusinessOsOverviewPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Overview</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Business OS dashboard</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          This is your operating layer for routing leads, reviewing scans, and deploying paid modules with transparent
          pricing and accountability.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
            <card.icon className="size-5 text-cyan-300" />
            <h2 className="mt-3 text-lg font-semibold text-white">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{card.detail}</p>
            <Link href={card.href} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
              Open
              <ArrowRight className="size-3.5" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
