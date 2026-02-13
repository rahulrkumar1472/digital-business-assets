import Link from "next/link";
import { CheckCircle2, Rocket, ScanSearch } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { OutcomeCard } from "@/components/marketing/outcome-card";
import { SectionBlock } from "@/components/marketing/section-block";
import { SystemDiagram } from "@/components/marketing/system-diagram";
import { TrackTile } from "@/components/marketing/track-tile";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { industries, services } from "@/data";
import { industriesFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/industries" });

const painPoints = [
  {
    title: "You are visible, but buyers do not choose you",
    bullets: [
      "Your service pages do not answer trust questions.",
      "Your offer is unclear in the first 5 seconds.",
      "Your competitor looks easier to buy from.",
    ],
  },
  {
    title: "You get enquiries, but response speed is too slow",
    bullets: [
      "Your team is busy and follow-up slips.",
      "Missed calls are not recovered quickly.",
      "Leads cool down before anyone replies.",
    ],
  },
  {
    title: "You close work, but growth is not predictable",
    bullets: [
      "No dashboard showing lead-to-booking movement.",
      "No repeat follow-up system after first sale.",
      "No clear list of what to install next.",
    ],
  },
];

const rolloutSequence = [
  "You choose Track 1 (launch fast) or Track 2 (scan first).",
  "You get a tailored module stack for your industry workflow.",
  "We deploy priority installs and remove response bottlenecks.",
  "You measure outcomes and add modules in sequence.",
];

const faqs = industriesFaqs();

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Industries</p>
          <h1 className="mt-3 text-5xl font-semibold text-white md:text-7xl">
            You get an industry-specific growth system, not a generic package.
          </h1>
          <ul className="mt-4 max-w-3xl space-y-2 text-sm text-slate-300 md:text-base">
            <li className="list-disc pl-1 marker:text-cyan-300">Your market has different buyer urgency and trust triggers.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You get modules shaped around how your sector actually wins work.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You see clear priorities, timeline, and what to deploy next.</li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/services">See service modules</Link>
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
            whoFor="You are offline, or your current website is costing trust and enquiries."
            outcome="You launch quickly with a premium website and the core lead system your industry needs."
            steps={["Launch", "Get leads", "Automate follow-up"]}
            href="/services/website-starter-build"
            ctaLabel="Start Track 1"
            icon={Rocket}
            featured
          />
          <TrackTile
            label="Track 2"
            title="Start Free Website Scan"
            whoFor="You are already online, but leads and bookings are under target."
            outcome="You get a scan report, priority fixes, and a practical industry deployment sequence."
            steps={["Scan", "Fix priorities", "Deploy growth plan"]}
            href="/tools/website-audit/start"
            ctaLabel="Start Track 2"
            icon={ScanSearch}
            compact
            delay={0.05}
          />
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Where businesses get stuck</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">If you reply tomorrow, they buy today.</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
            Your competitors are installing this now. Speed, clarity, and follow-up discipline decide who wins.
          </p>
        </MotionReveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {painPoints.map((point, index) => (
            <MotionReveal key={point.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <h3 className="text-xl font-semibold text-white">{point.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {point.bullets.map((item) => (
                    <li key={item} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Industry hubs</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Choose your industry and see your path</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
            Each page maps your common failure points, the modules we install, and what you should deploy first.
          </p>
        </MotionReveal>
        <div className="mt-8">
          <IndustryGrid industries={industries} />
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Most requested installs</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">You can start with one high-impact module</h2>
        </MotionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.slice(0, 6).map((service, index) => (
            <OutcomeCard
              key={service.slug}
              title={service.title}
              result={service.outcomes[0] || service.strapline}
              timeframe={service.timeline}
              price={service.entryPrice}
              bullets={service.deliverables.slice(0, 3)}
              href={`/services/${service.slug}`}
              delay={index * 0.04}
              priorityLabel={index < 3 ? "Most businesses need this next" : undefined}
            />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
          <SystemDiagram />
          <MotionReveal>
            <div className="h-full rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-7">
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">How your rollout works</p>
              <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">You always know what happens next.</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {rolloutSequence.map((step, index) => (
                  <li key={step} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs text-cyan-300">Step {index + 1}</p>
                    <p className="mt-1">{step}</p>
                  </li>
                ))}
              </ul>
              <Separator className="my-5 bg-slate-800" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/book">Book a strategy call</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800"
                >
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <KPICharts />
      </SectionBlock>

      <SectionBlock>
        <InContextPricing
          title="You get visible pricing on every step"
          description="Start with one install from £399-£599, then add monthly support only when you want ongoing optimisation."
        />
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent
          topic="Industry-specific Business OS rollouts"
          audience="UK business owners choosing the right track for their sector"
          image="/media/industries.jpg"
        />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Industry rollout questions</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA
          title="Tell us your industry, and we will map your first deployment sprint."
          description="You get practical priorities, transparent pricing, and a system that fits how your team actually works."
        />
      </SectionBlock>
    </>
  );
}
