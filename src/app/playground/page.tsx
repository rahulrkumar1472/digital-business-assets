import { WebsiteAuditPlayground } from "@/components/tools/website-audit-playground";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/playground" });

export default function PlaygroundPage() {
  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Playground mode</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Website Growth Audit playground</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
            Use a sample URL and instantly preview the premium Track 2 report experience.
          </p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4 pb-20">
        <WebsiteAuditPlayground />
      </SectionBlock>
    </>
  );
}
