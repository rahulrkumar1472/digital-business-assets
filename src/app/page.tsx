import Link from "next/link";
import { ArrowRight, Rocket, ScanSearch, ShieldCheck } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { HeroTypewriter } from "@/components/marketing/hero-typewriter";
import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { OutcomeCard } from "@/components/marketing/outcome-card";
import { ProofCard } from "@/components/marketing/proof-card";
import { SectionBlock } from "@/components/marketing/section-block";
import { StepperQuiz } from "@/components/marketing/stepper-quiz";
import { SystemDiagram } from "@/components/marketing/system-diagram";
import { TrackTile } from "@/components/marketing/track-tile";
import { DashboardPreviewPanel } from "@/components/marketing/dashboard-preview-panel";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { services } from "@/data";
import { homeFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/" });

const rotatingLines = [
  "websites",
  "websites → leads",
  "websites → leads → follow-up",
  "websites → leads → follow-up → bookings",
  "websites → leads → follow-up → bookings → repeat customers",
];

const heroProofBadges = ["Conversion-first", "SEO-ready", "Automation built-in"];
const heroTrustBadges = ["UK-wide rollout", "Transparent pricing", "Done-for-you setup"];
const heroProofBar = ["72-hour launch option", "Free scan for existing sites", "Built for measurable growth"];

const trackSplit = [
  {
    label: "Track 1",
    title: "Get Online in 72 Hours",
    whoFor: "You are not online yet, or your current site looks basic and does not win trust.",
    outcome: "You get a live, premium, conversion-ready website and your first lead system fast.",
    steps: ["Launch", "Get Leads", "Automate Follow-Up"],
    href: "/services/website-starter-build",
    ctaLabel: "Start Track 1",
    icon: Rocket,
  },
  {
    label: "Track 2",
    title: "Start Free Website Scan",
    whoFor: "You are online already, but your site is underperforming and leads are leaking.",
    outcome: "You get a scan, branded PDF report, and a practical growth deployment plan.",
    steps: ["Scan", "Fix Priorities", "Deploy Growth Plan"],
    href: "/tools/website-audit/start",
    ctaLabel: "Start Track 2",
    icon: ScanSearch,
  },
] as const;

const proofFormat = [
  {
    title: "Local Services",
    before: "Missed calls sat for hours, and urgent leads bought elsewhere.",
    after: "Missed calls got instant response and survey bookings increased.",
    changed: [
      "Call tracking + missed call capture",
      "Fast website launch in 72 hours",
      "Automated callback workflow",
    ],
    metric: "Before: missed demand · After: faster recovery",
  },
  {
    title: "Clinic Funnel",
    before: "Consultation no-shows made growth unpredictable.",
    after: "Bookings became more consistent with reminders and clearer conversion pages.",
    changed: [
      "Booking system with reminders",
      "Trust-first service page rebuild",
      "CRM visibility from enquiry to booking",
    ],
    metric: "Before: no-show risk · After: better attendance",
  },
  {
    title: "Real Estate",
    before: "Out-of-hours valuation enquiries cooled before callback.",
    after: "Leads were qualified quickly and routed into booked valuation calls.",
    changed: [
      "AI assistant qualification",
      "Follow-up automation",
      "Pipeline stage routing",
    ],
    metric: "Before: delayed lead handling · After: quicker booking flow",
  },
] as const;

const toolSteps = [
  "You enter your website and biggest concern.",
  "We run technical, speed, and conversion checks.",
  "You get a branded PDF with fix-now priorities.",
  "You deploy only the modules your business needs.",
];

const faqs = homeFaqs();

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-20 md:pt-28">
        <div className="rounded-[2rem] border border-cyan-500/35 bg-[linear-gradient(155deg,rgba(56,189,248,0.17),rgba(15,23,42,0.93))] p-6 shadow-[0_42px_130px_rgba(2,6,23,0.7)] md:p-12">
          <div className="grid gap-10 xl:grid-cols-[1.03fr_0.97fr]">
            <MotionReveal className="space-y-7">
              <Badge variant="outline" className="border-cyan-500/45 bg-cyan-500/10 text-cyan-200">Business OS for UK businesses</Badge>
              <div className="space-y-5">
                <h1 className="text-6xl leading-[0.98] font-semibold text-white md:text-8xl">A complete revenue system for any business.</h1>
                <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                  {heroProofBar.map((item) => (
                    <span key={item} className="rounded-md border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[11px] font-medium text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
                <HeroTypewriter lines={rotatingLines} />
                <ul className="max-w-2xl space-y-2 text-sm text-slate-200 md:text-base">
                  <li className="inline-flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 text-cyan-300" />You pick your track based on where your business is right now.</li>
                  <li className="inline-flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 text-cyan-300" />You get clear priorities, pricing, and what happens next.</li>
                  <li className="inline-flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 text-cyan-300" />You move from website to leads to bookings with one connected system.</li>
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <p className="col-span-full text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Choose your track to start now</p>
                <Link
                  href="/services/website-starter-build"
                  className="group rounded-2xl border border-cyan-400/55 bg-[linear-gradient(150deg,rgba(34,211,238,0.22),rgba(15,23,42,0.92))] p-5 shadow-[0_0_55px_rgba(34,211,238,0.16)] transition-all hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_0_75px_rgba(34,211,238,0.24)]"
                >
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Track 1</p>
                  <p className="mt-1 text-2xl font-semibold text-white">Get Online in 72 Hours</p>
                  <p className="mt-1 text-sm text-slate-200">For businesses with weak or no online presence.</p>
                  <p className="mt-2 text-xs text-cyan-100">Outcome: You launch fast and start capturing leads.</p>
                  <p className="mt-3 text-xs font-semibold text-cyan-200">Start Track 1</p>
                </Link>
                <Link
                  href="/tools/website-audit/start"
                  className="group rounded-2xl border border-slate-600 bg-[linear-gradient(150deg,rgba(30,41,59,0.8),rgba(2,6,23,0.95))] p-5 shadow-[0_0_55px_rgba(15,23,42,0.4)] transition-all hover:-translate-y-0.5 hover:scale-[1.01] hover:border-cyan-400/40 hover:shadow-[0_0_75px_rgba(34,211,238,0.2)]"
                >
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Track 2</p>
                  <p className="mt-1 text-2xl font-semibold text-white">Start Free Website Scan</p>
                  <p className="mt-1 text-sm text-slate-200">For businesses already online but underperforming.</p>
                  <p className="mt-2 text-xs text-cyan-100">Outcome: You identify leaks and deploy only priority fixes.</p>
                  <p className="mt-3 text-xs font-semibold text-cyan-200">Start Track 2</p>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {heroTrustBadges.map((item) => (
                  <Badge key={item} variant="outline" className="border-cyan-500/35 bg-cyan-500/8 text-cyan-100">
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {heroProofBadges.map((item) => (
                  <Badge key={item} variant="outline" className="border-slate-700 bg-slate-950/70 text-slate-200">
                    {item}
                  </Badge>
                ))}
              </div>
            </MotionReveal>

            <MotionReveal delay={0.06}>
              <DashboardPreviewPanel />
            </MotionReveal>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock className="pt-8">
        <MotionReveal className="mb-6 max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Track split</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Pick your track and get moving this week</h2>
        </MotionReveal>
        <div className="grid gap-4 lg:grid-cols-2">
          {trackSplit.map((track, index) => (
            <TrackTile
              key={track.title}
              label={track.label}
              title={track.title}
              whoFor={track.whoFor}
              outcome={track.outcome}
              steps={track.steps}
              href={track.href}
              ctaLabel={track.ctaLabel}
              icon={track.icon}
              delay={index * 0.05}
              featured={index === 0}
            />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <StepperQuiz />
      </SectionBlock>

      <SectionBlock id="services">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Productized services</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">You get clear outcomes, timelines, and pricing</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">Most businesses need the same few modules next. We show you exactly where to start.</p>
        </MotionReveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.slice(0, 9).map((service, index) => (
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
        <InContextPricing
          compact
          title="Pricing is shown in context, not hidden"
          description="You can start with one module from £399-£599, then move to monthly support when you want ongoing optimisation."
        />
      </SectionBlock>

      <SectionBlock>
        <SystemDiagram />
      </SectionBlock>

      <SectionBlock id="proof">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Proof structure</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Before. After. What changed.</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">No inflated claims. Just clear format so you can compare where you are now versus where you want to be.</p>
        </MotionReveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {proofFormat.map((item, index) => (
            <ProofCard
              key={item.title}
              title={item.title}
              before={item.before}
              after={item.after}
              changed={item.changed}
              metric={item.metric}
              delay={index * 0.05}
            />
          ))}
        </div>

        <div className="mt-6">
          <Button asChild variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800">
            <Link href="/case-studies">
              View full case studies
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </SectionBlock>

      <SectionBlock id="tools">
        <div className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8 xl:grid-cols-[1fr_1fr]">
          <MotionReveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Free website scan</p>
            <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">See what your report includes before you run it</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">If your site is live but underperforming, this shows you what to fix first and what to deploy next.</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-200">
              {toolSteps.map((step) => (
                <li key={step} className="list-disc pl-1 marker:text-cyan-300">
                  {step}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <Link href="/tools/website-audit/start">Run free scan</Link>
            </Button>
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <div className="grid gap-3">
              {["Technical SEO checks", "Mobile speed findings", "H1/meta/canonical checks", "Priority upgrade cards", "Branded PDF download"].map((item) => (
                <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-cyan-300" />{item}</span>
                </div>
              ))}
              <Separator className="bg-slate-800" />
              <p className="text-xs text-slate-400">You get a clear path from diagnosis to implementation. No guessing, no report fluff.</p>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent
          topic="Business OS two-track rollout"
          audience="Business owners deciding between launching fast or scanning and fixing underperforming systems"
          image="/media/hero-dashboard.jpg"
        />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">What happens next after you pick a track?</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <MotionReveal>
          <div className="rounded-3xl border border-cyan-500/35 bg-[linear-gradient(150deg,rgba(34,211,238,0.15),rgba(15,23,42,0.94))] p-8 md:p-10">
            <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">Final step</p>
            <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Choose your track and start this week</h2>
            <ul className="mt-3 max-w-3xl space-y-2 text-sm text-slate-200 md:text-base">
              <li className="list-disc pl-1 marker:text-cyan-300">If you need to get online fast, start Track 1.</li>
              <li className="list-disc pl-1 marker:text-cyan-300">If your site is already live but leaking opportunities, start Track 2.</li>
              <li className="list-disc pl-1 marker:text-cyan-300">You get a clear next step immediately after you choose.</li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <Link href="/services/website-starter-build">Track 1: Get Online in 72 Hours</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800">
                <Link href="/tools/website-audit/start">Track 2: Start Free Website Scan</Link>
              </Button>
            </div>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-0 pb-20">
        <FinalCTA
          title="You do not need more marketing noise. You need a system that runs."
          description="We help you choose the right track, install the right modules, and keep your growth process clear and measurable."
        />
      </SectionBlock>
    </>
  );
}
