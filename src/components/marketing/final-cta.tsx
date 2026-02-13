import { PrimaryCTA } from "@/components/marketing/primary-cta";

type FinalCTAProps = {
  title?: string;
  description?: string;
};

export function FinalCTA({
  title = "Ready to stop leaking revenue?",
  description = "Get a done-for-you growth system built for your business model, not a generic marketing package.",
}: FinalCTAProps) {
  return (
    <div className="rounded-3xl border border-cyan-500/35 bg-[linear-gradient(155deg,rgba(56,189,248,0.15),rgba(15,23,42,0.9))] p-8 shadow-[0_0_70px_rgba(34,211,238,0.24)] md:p-12">
      <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Final step</p>
      <h3 className="mt-3 text-4xl font-semibold text-white md:text-6xl">{title}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-base">{description}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <PrimaryCTA label="Get a Growth Plan" />
        <PrimaryCTA
          href="/book"
          label="Book a Call"
          secondary
          eventName="book_call_click"
          eventPayload={{ source: "final_cta" }}
          className="group"
          size="lg"
        />
      </div>
    </div>
  );
}
