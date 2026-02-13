import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CheckCircle2, ShieldCheck, Timer } from "lucide-react";

import { AIGrowthSimulator } from "@/components/marketing/ai-growth-simulator";
import { AutomationFlowDiagram } from "@/components/marketing/automation-flow-diagram";
import { CaseStudySpotlight } from "@/components/marketing/case-study-spotlight";
import { DashboardPreviewPanel } from "@/components/marketing/dashboard-preview-panel";
import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { FunnelDiagram } from "@/components/marketing/funnel-diagram";
import { HeroTypewriter } from "@/components/marketing/hero-typewriter";
import { HowItWorksStepper } from "@/components/marketing/how-it-works-stepper";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { ProofBar } from "@/components/marketing/proof-bar";
import { SectionBlock } from "@/components/marketing/section-block";
import { VideoSection } from "@/components/marketing/video-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/data";
import { homeFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/" });

const rotatingLines = [
  "Websites Built in 72 Hours",
  "Automations That Never Miss Leads",
  "SEO + AI Search Visibility",
  "24/7 Customer Support Systems",
];

const heroBullets = [
  "Increase qualified leads",
  "Reduce missed enquiries",
  "Automate bookings",
  "Improve conversion rates",
  "Real-time performance tracking",
];

const launchStepper = [
  {
    title: "Audit & Asset Capture",
    detail: "Offer clarity, funnel gaps, and asset collection so build starts immediately.",
    timeline: "Day 0",
  },
  {
    title: "Website + Tracking + CRM",
    detail: "Conversion pages, analytics events, forms, and CRM stage architecture installed.",
    timeline: "Day 1",
  },
  {
    title: "Automation + Chatbot + Booking",
    detail: "Lead routing, reminders, chatbot qualification, and booking flows deployed.",
    timeline: "Day 2",
  },
  {
    title: "Launch + AI Optimisation",
    detail: "Go live with baseline dashboards and first optimisation checklist.",
    timeline: "Day 3",
  },
];

const serviceModules = [
  {
    title: "AI Website Build",
    href: "/services/websites-in-72-hours",
    outcome: "Launch conversion-ready web assets fast.",
    bullets: ["72-hour launch sprint", "Offer-first page architecture", "Tracked lead actions"],
  },
  {
    title: "SEO + AEO",
    href: "/services/seo-aeo",
    outcome: "Win both search rankings and AI answer visibility.",
    bullets: ["Technical SEO baseline", "AEO-ready content clusters", "Intent-driven internal linking"],
  },
  {
    title: "CRM + Workflows",
    href: "/services/crm-pipelines",
    outcome: "Move every lead through a controlled pipeline.",
    bullets: ["Pipeline stage design", "Owner/team SLA reminders", "Source-to-close reporting"],
  },
  {
    title: "WhatsApp + Chatbots",
    href: "/services/ai-chatbots",
    outcome: "Handle enquiries instantly and qualify them automatically.",
    bullets: ["Consultative chat flows", "Out-of-hours response", "CRM and booking handoff"],
  },
  {
    title: "24/7 Answering",
    href: "/services/missed-call-recovery",
    outcome: "Recover missed calls before they go cold.",
    bullets: ["Instant text-back", "Urgent lead routing", "Call outcome tracking"],
  },
  {
    title: "Booking Systems",
    href: "/services/booking-systems-reminders",
    outcome: "Reduce no-shows and increase confirmed appointments.",
    bullets: ["Smart booking funnel", "Reminder sequences", "Reschedule automation"],
  },
  {
    title: "Reporting Dashboard",
    href: "/services/reporting-dashboards",
    outcome: "Track pipeline health and ROI in one place.",
    bullets: ["Weekly KPI scorecard", "Response-to-booking tracking", "Revenue attribution"],
  },
  {
    title: "SaaS Development",
    href: "/services/automations-workflows",
    outcome: "Custom systems for workflows your tools cannot handle.",
    bullets: ["Workflow app modules", "API/webhook integrations", "Operational failover logic"],
  },
];

const faqs = homeFaqs();

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <div className="relative overflow-hidden rounded-[1.9rem] border border-slate-800/80 bg-slate-900/45 p-7 shadow-[0_36px_120px_rgba(2,6,23,0.68)] md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <MotionReveal className="space-y-7">
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Digital Business Assets</p>
              <div className="space-y-5">
                <h1 className="text-5xl font-semibold leading-[1.02] text-white md:text-7xl">AI-First Business Systems From £99/Month</h1>
                <HeroTypewriter lines={rotatingLines} />
                <ul className="space-y-2.5 text-sm text-slate-200 md:text-base">
                  {heroBullets.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryCTA label="Get Your Growth Plan" eventName="hero_cta_click" eventPayload={{ location: "home_hero" }} />
                <Button asChild variant="outline" size="lg" className="border-slate-700 bg-slate-900/45 text-slate-100 transition-all hover:-translate-y-0.5 hover:bg-slate-800">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <DashboardPreviewPanel />
            </MotionReveal>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock className="py-8 md:py-12">
        <ProofBar />
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-5 md:grid-cols-3">
          <MotionReveal>
            <article className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-5">
              <AlertTriangle className="size-5 text-amber-200" />
              <h2 className="mt-3 text-xl font-semibold text-white">Your competitors are installing this now</h2>
              <p className="mt-2 text-sm text-amber-100">If your response time is slower than category leaders, high-intent leads choose whoever follows up first.</p>
            </article>
          </MotionReveal>
          <MotionReveal delay={0.05}>
            <article className="rounded-2xl border border-cyan-500/35 bg-cyan-500/10 p-5">
              <Timer className="size-5 text-cyan-200" />
              <h2 className="mt-3 text-xl font-semibold text-white">72-hour deployment blocks</h2>
              <p className="mt-2 text-sm text-cyan-100">Build, tracking, and automation launch in staged cycles so value arrives fast without operational chaos.</p>
            </article>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <article className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-5">
              <ShieldCheck className="size-5 text-emerald-200" />
              <h2 className="mt-3 text-xl font-semibold text-white">Value stack from £99/mo</h2>
              <p className="mt-2 text-sm text-emerald-100">Entry plan delivers conversion infrastructure and measurable execution support before scaling into advanced automation.</p>
            </article>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">What we build in 72 hours</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Launch sequence designed for speed and measurable outcomes</h2>
          <p className="mt-3 text-sm text-slate-300 md:text-base">You get a practical implementation timeline with clear milestones from day zero.</p>
        </MotionReveal>
        <div className="mt-8">
          <HowItWorksStepper steps={launchStepper} />
        </div>
      </SectionBlock>

      <SectionBlock>
        <AIGrowthSimulator mode="preview" />
      </SectionBlock>

      <SectionBlock id="services">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Services Grid</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">8 product modules that make up your revenue system</h2>
          <p className="mt-3 text-sm text-slate-300 md:text-base">Each module is outcome-driven and can be deployed standalone or as a full stack.</p>
        </MotionReveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceModules.map((module, index) => (
            <MotionReveal key={module.title} delay={index * 0.04}>
              <article className="group h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-400/45 hover:shadow-[0_20px_60px_rgba(2,6,23,0.5)]">
                <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                <p className="mt-2 text-sm text-cyan-200">{module.outcome}</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                  {module.bullets.map((bullet) => (
                    <li key={bullet} className="list-disc pl-1 marker:text-cyan-300">{bullet}</li>
                  ))}
                </ul>
                <Link href={module.href} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                  View module
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="how-it-works">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">How It Works Flow</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Traffic to revenue mapped in one operating view</h2>
        </MotionReveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <FunnelDiagram />
          <AutomationFlowDiagram />
          <KPICharts />
        </div>
      </SectionBlock>

      <SectionBlock>
        <VideoSection
          title="Product demo: see the AI revenue system in action"
          description="A quick walkthrough of how lead capture, automation, booking, and reporting work as one stack."
          videoUrl="https://www.youtube.com/watch?v=jNQXAC9IVRw"
          points={["Multi-channel lead capture and routing", "Automation-driven follow-up and reminders", "Owner-level dashboard visibility"]}
        />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Case Study Spotlight</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Before and after outcomes from deployed systems</h2>
        </MotionReveal>
        <div className="mt-8">
          <CaseStudySpotlight caseStudies={caseStudies} />
        </div>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="AI Revenue System Framework" audience="UK SME owners and operators" image="/media/hero-dashboard.jpg" />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Questions before you deploy</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Stop Losing Leads. Start Building a Revenue System." />
      </SectionBlock>
    </>
  );
}
