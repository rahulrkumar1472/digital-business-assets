import Link from "next/link";
import { ArrowRight, Rocket, ScanSearch } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { OutcomeCard } from "@/components/marketing/outcome-card";
import { SectionBlock } from "@/components/marketing/section-block";
import { SystemDiagram } from "@/components/marketing/system-diagram";
import { TrackTile } from "@/components/marketing/track-tile";
import { RecommendedNextStep } from "@/components/funnel/next-step";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { services } from "@/data";
import { servicesFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/services" });

const rolloutSteps = [
  "You tell us where you are leaking revenue.",
  "You get a recommended module sequence.",
  "We install, test, and launch quickly.",
  "You track what improved and what to deploy next.",
];

const faqs = servicesFaqs();

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Services</p>
          <h1 className="mt-3 text-5xl font-semibold text-white md:text-7xl">Pick the module your business needs next</h1>
          <ul className="mt-4 max-w-3xl space-y-2 text-sm text-slate-300 md:text-base">
            <li className="list-disc pl-1 marker:text-cyan-300">You can install one module from £399-£599 and move fast.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You see outcomes and timeline before work starts.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You scale only when your numbers justify the next module.</li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/services/website-starter-build">Start with 72-hour launch</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
              <Link href="/tools/website-audit/start">Start free website scan</Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <TrackTile
            label="Track 1"
            title="Get Online in 72 Hours"
            whoFor="You need a strong online presence quickly so buyers can find and trust your business."
            outcome="You launch fast with conversion routes and lead capture built in."
            steps={["Launch", "Get leads", "Automate follow-up"]}
            href="/services/website-starter-build"
            ctaLabel="Start Track 1"
            icon={Rocket}
            featured
          />
          <TrackTile
            label="Track 2"
            title="Analyse and Upgrade"
            whoFor="You are already online, but your site and follow-up process are underperforming."
            outcome="You get priority fixes and install the right modules without guesswork."
            steps={["Scan", "Fix", "Deploy"]}
            href="/tools/website-audit/start"
            ctaLabel="Start Track 2"
            icon={ScanSearch}
            delay={0.05}
          />
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Productized installs</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Every service is priced, scoped, and outcome-led</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">You always know what you get, how fast it ships, and what should be deployed next.</p>
        </MotionReveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <OutcomeCard
              key={service.slug}
              title={service.title}
              result={service.outcomes[0] || service.strapline}
              timeframe={service.timeline}
              price={service.entryPrice}
              bullets={service.deliverables.slice(0, 3)}
              href={`/services/${service.slug}`}
              delay={index * 0.035}
              priorityLabel={index < 3 ? "Most businesses need this next" : undefined}
            />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
          <MotionReveal className="max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">What happens next</p>
            <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Your rollout is simple and staged</h2>
          </MotionReveal>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {rolloutSteps.map((step, index) => (
              <MotionReveal key={step} delay={index * 0.05}>
                <article className="h-full rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs text-cyan-300">Step {index + 1}</p>
                  <p className="mt-2 text-sm text-slate-300">{step}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock>
        <SystemDiagram />
      </SectionBlock>

      <SectionBlock>
        <InContextPricing
          title="Use one-time installs + monthly operating support"
          description="Install what you need first. Add subscription support when you want ongoing optimisation and deployment continuity."
        />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Not sure where to start?</h2>
          <ul className="mt-3 max-w-3xl space-y-2 text-sm text-slate-300 md:text-base">
            <li className="list-disc pl-1 marker:text-cyan-300">If you want speed, start Track 1.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">If you want diagnosis first, start Track 2.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You can switch tracks later without losing momentum.</li>
          </ul>
          <Separator className="my-5 bg-slate-800" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <Link href="/services/website-starter-build">
                Track 1: 72-hour launch
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800">
              <Link href="/tools/website-audit/start">
                Track 2: free scan
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="Business OS service selection" audience="Business owners deciding what module to deploy first" image="/media/services-automation.jpg" />
      </SectionBlock>

      <SectionBlock className="py-6">
        <RecommendedNextStep />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQs</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Questions before you install anything</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="You can start small and still move fast" description="Pick one module, deploy it properly, and scale only when your numbers support the next step." />
      </SectionBlock>
    </>
  );
}
