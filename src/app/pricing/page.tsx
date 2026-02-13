import Link from "next/link";
import { CheckCircle2, Rocket, ScanSearch } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { SectionBlock } from "@/components/marketing/section-block";
import { TrackTile } from "@/components/marketing/track-tile";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { services } from "@/data";
import { pricingFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/pricing" });

const process = [
  "You choose your track and priority module.",
  "You see fixed from-pricing before implementation.",
  "You get timeline, scope, and next-step options.",
  "You add subscription support only when needed.",
];

const comparisonRows = [
  ["Best for", "You need digital basics live", "You need conversion and follow-up systems", "You need full growth operations"],
  ["Monthly tier", "£79/mo", "£355/mo", "£499/mo"],
  ["Module capacity", "Up to 2", "Up to 5", "Up to 8"],
  ["Support cadence", "Monthly", "Weekly", "Weekly + priority queue"],
  ["AI / automation depth", "Core", "Expanded", "Full stack"],
];

const faqs = pricingFaqs();

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Pricing</p>
          <h1 className="mt-3 text-5xl font-semibold text-white md:text-7xl">
            You always know what it costs before you commit.
          </h1>
          <ul className="mt-4 max-w-3xl space-y-2 text-sm text-slate-300 md:text-base">
            <li className="list-disc pl-1 marker:text-cyan-300">You can start with one install from £399-£599.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You see scope and timeline before implementation starts.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You add monthly support only when you need faster iteration.</li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/book">Book your strategy call</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800"
            >
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
            whoFor="You are starting from offline or a weak website and need momentum now."
            outcome="You launch quickly and start capturing leads with a conversion-ready setup."
            steps={["Launch", "Get leads", "Automate follow-up"]}
            href="/services/website-starter-build"
            ctaLabel="Choose Track 1"
            icon={Rocket}
            featured
          />
          <TrackTile
            label="Track 2"
            title="Start Free Website Scan"
            whoFor="You are online already, but your funnel is leaking leads or bookings."
            outcome="You get a scan report and choose only the upgrades you actually need."
            steps={["Scan", "Prioritise", "Deploy modules"]}
            href="/tools/website-audit/start"
            ctaLabel="Choose Track 2"
            icon={ScanSearch}
            compact
            delay={0.05}
          />
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">One-time installs</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Start with one high-impact module</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
            Most businesses should not buy everything at once. You start with the biggest bottleneck and expand from
            there.
          </p>
        </MotionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.slice(0, 9).map((service, index) => (
            <MotionReveal key={service.slug} delay={index * 0.035}>
              <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <p className="text-xs font-semibold tracking-[0.1em] text-cyan-200 uppercase">{service.entryPrice}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  You get {service.outcomes[0] || service.strapline} in {service.timeline}.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {service.deliverables.slice(0, 2).map((item) => (
                    <li key={item} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="mt-5 border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800"
                >
                  <Link href={`/services/${service.slug}`}>View module</Link>
                </Button>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Subscription tiers</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Add monthly support when you want faster execution</h2>
        </MotionReveal>
        <div className="mt-8">
          <PricingCards />
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45">
            <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/55 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-300 md:px-6">
              <span className="col-span-1">Plan layer</span>
              <span>Starter</span>
              <span>Growth</span>
              <span>Scale</span>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-4 border-b border-slate-800 px-4 py-3 text-sm text-slate-300 last:border-b-0 md:px-6"
              >
                <span className="col-span-1 text-slate-200">{row[0]}</span>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
                <span>{row[3]}</span>
              </div>
            ))}
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">How pricing works in real life</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
            You pay for what you install, then scale when results justify it.
          </h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {process.map((step, index) => (
              <li key={step} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
                <p className="text-xs text-cyan-300">Step {index + 1}</p>
                <p className="mt-1">{step}</p>
              </li>
            ))}
          </ul>
          <Separator className="my-5 bg-slate-800" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/services">Choose your first module</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800"
            >
              <Link href="/book">Book a call</Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <InContextPricing
          title="Transparent monthly support, no hidden stack creep"
          description="Add-ons stay separate and visible, so you always know what is included and what is optional."
        />
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent
          topic="Business OS pricing and deployment sequencing"
          audience="UK business owners who want transparent growth-system budgets"
          image="/media/services-automation.jpg"
        />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Pricing questions you probably have right now</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA
          title="Want the right plan mapped to your current bottleneck?"
          description="You get a clear recommendation on module order, timeline, and budget range before implementation starts."
        />
      </SectionBlock>
    </>
  );
}
