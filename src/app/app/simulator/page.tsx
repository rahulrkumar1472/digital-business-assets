import { AIGrowthSimulator } from "@/components/marketing/ai-growth-simulator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/app/simulator" });

export default function BusinessOsSimulatorPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Simulator</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Business OS growth simulator</h1>
        <p className="mt-3 text-sm text-slate-300">Run scenarios, export plans, and route high-intent opportunities into booking.</p>
      </header>

      <AIGrowthSimulator mode="full" />
    </section>
  );
}
