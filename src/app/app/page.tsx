import Link from "next/link";
import { ArrowRight, Gauge, LayoutDashboard, Layers3 } from "lucide-react";

import { getUserSubscription } from "@/lib/auth/repository";
import { getUserSession } from "@/lib/auth/session";
import { listBespokePlanRequestsByEmail } from "@/lib/bespoke-plan/repository";
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

export default async function BusinessOsOverviewPage() {
  const session = await getUserSession();
  const subscription = session ? await getUserSubscription(session.userId) : null;
  const planRequests = session ? await listBespokePlanRequestsByEmail(session.email, 5) : [];

  const latestTrack = planRequests[0]?.track || "unknown";
  const trackLabel = latestTrack === "track1" ? "Track 1: Get Online in 72 Hours" : latestTrack === "track2" ? "Track 2: Analyse & Improve" : "Track not set";

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Overview</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Business OS dashboard</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          This is your operating layer for routing leads, reviewing scans, and deploying paid modules with transparent
          pricing and accountability.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-3">
            <p className="text-[11px] text-slate-400">Current plan</p>
            <p className="mt-1 text-base font-semibold text-white">{subscription?.plan || "Starter"}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-3">
            <p className="text-[11px] text-slate-400">Latest funnel track</p>
            <p className="mt-1 text-base font-semibold text-white">{trackLabel}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-3">
            <p className="text-[11px] text-slate-400">Bespoke requests</p>
            <p className="mt-1 text-base font-semibold text-white">{planRequests.length}</p>
          </div>
        </div>
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

      <section className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <h2 className="text-xl font-semibold text-white">Next steps</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {latestTrack === "track1" ? (
            <>
              <li>1. Finalise your website starter build scope and timeline.</li>
              <li>2. Select modules in Services and continue to Bespoke Plan.</li>
              <li>3. Book strategy call to lock your 72-hour launch window.</li>
            </>
          ) : latestTrack === "track2" ? (
            <>
              <li>1. Run your website audit and collect your report.</li>
              <li>2. Review priority fixes in Reports.</li>
              <li>3. Deploy only the highest-leverage modules first.</li>
            </>
          ) : (
            <>
              <li>1. Pick your starting track from the homepage or tools.</li>
              <li>2. Add modules to your plan from Services.</li>
              <li>3. Submit a bespoke plan for your rollout sequence.</li>
            </>
          )}
        </ul>
      </section>
    </section>
  );
}
