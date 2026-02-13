import { BespokePlanForm } from "@/components/funnel/bespoke-plan-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/bespoke-plan" });

export default function BespokePlanPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-cyan-300 uppercase">Bespoke Plan</p>
        <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl">Create Your Bespoke Growth Plan</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Share your current setup and we will route you to the right track, modules, and next actions.
        </p>
        <BespokePlanForm />
      </div>
    </section>
  );
}

