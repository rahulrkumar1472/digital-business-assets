import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { AutomationFlowDiagram } from "@/components/marketing/automation-flow-diagram";
import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { FunnelDiagram } from "@/components/marketing/funnel-diagram";
import { HowItWorksStepper } from "@/components/marketing/how-it-works-stepper";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { SectionBlock } from "@/components/marketing/section-block";
import { ServicePillars } from "@/components/marketing/service-pillars";
import { VideoSection } from "@/components/marketing/video-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { services } from "@/data";
import { servicesFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

export const metadata = buildMetadata({ path: "/services" });

const outcomes = [
  "Higher enquiry-to-booking conversion through conversion-first assets.",
  "Faster first response with automations and AI handoff.",
  "More predictable pipeline progression in CRM.",
  "Weekly visibility on revenue, response, and booking metrics.",
];

const includesChecklist = [
  "Strategy and offer positioning sprint",
  "Build and integration implementation",
  "Automation logic and QA",
  "Tracking and dashboard setup",
  "30-day optimisation playbook",
];

const proofStats = [
  { label: "Average response speed improvement", value: "35-70%" },
  { label: "Typical booking uplift", value: "+18-45%" },
  { label: "Missed call recovery", value: "40-88%" },
];

const faqs = servicesFaqs();

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Services</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">Revenue system modules you can deploy fast</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">
            Choose one pillar or combine multiple. Every service is engineered around conversion, response speed, and measurable growth outcomes.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryCTA />
            <Button asChild variant="outline" size="lg" className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <MotionReveal className="max-w-4xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Outcomes first, always</h2>
          <p className="mt-3 text-sm text-slate-300">Each service is scoped to move a measurable metric, not just ship deliverables.</p>
        </MotionReveal>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {outcomes.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200">
                <CheckCircle2 className="mb-2 size-4 text-cyan-300" />
                {item}
              </li>
            </MotionReveal>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">What&apos;s included in every implementation</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {includesChecklist.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.04}>
              <div className="rounded-xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200">{item}</div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">How it works</h2>
        </MotionReveal>
        <div className="mt-6">
          <HowItWorksStepper />
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-3">
          {proofStats.map((stat, index) => (
            <MotionReveal key={stat.label} delay={index * 0.05}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">{stat.value}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <ServicePillars services={services} />
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 lg:grid-cols-3">
          <FunnelDiagram />
          <AutomationFlowDiagram />
          <KPICharts />
        </div>
      </SectionBlock>

      <SectionBlock>
        <VideoSection
          title="30s overview: how the service stack works"
          description="A quick walkthrough of the system architecture from lead capture to follow-up and reporting."
          videoUrl="https://www.youtube.com/watch?v=jNQXAC9IVRw"
          points={["Website + conversion framework", "CRM + automation workflows", "Reporting tied to booked revenue"]}
        />
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic="AI Revenue Service Delivery" audience="UK business owners planning implementation" image="/media/services-automation.jpg" />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQs</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Before we build</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Need help choosing the first service to deploy?" description="We will map your highest-leverage move based on current lead flow, team capacity, and sales goals." />
      </SectionBlock>
    </>
  );
}
