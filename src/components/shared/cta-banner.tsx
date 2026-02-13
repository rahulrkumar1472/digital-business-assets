import { CtaActions } from "@/components/shared/cta-actions";
import { Section } from "@/components/shared/section";

type CtaBannerProps = {
  title: string;
  description: string;
  className?: string;
};

export function CtaBanner({ title, description, className }: CtaBannerProps) {
  return (
    <Section className={className}>
      <div className="rounded-3xl border border-cyan-400/30 bg-[linear-gradient(180deg,rgba(14,116,144,0.22),rgba(15,23,42,0.5))] p-8 shadow-[0_24px_60px_rgba(2,6,23,0.45)] md:p-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Next step</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="text-base leading-relaxed text-slate-200 sm:text-lg">{description}</p>
        </div>
        <CtaActions className="mt-8" />
      </div>
    </Section>
  );
}
