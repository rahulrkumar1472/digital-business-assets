import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Layers3, Radar, Workflow } from "lucide-react";

import { AutomationFlowDiagram } from "@/components/marketing/automation-flow-diagram";
import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { FunnelDiagram } from "@/components/marketing/funnel-diagram";
import { ImageOrPlaceholder } from "@/components/marketing/image-or-placeholder";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { caseStudies, getServiceBySlug, services } from "@/data";
import { serviceDetailFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const toolCards = [
  {
    title: "Offer + Conversion Layer",
    description: "Pages, CTAs, forms, and conversion prompts aligned to buying intent.",
    icon: Layers3,
  },
  {
    title: "Automation Engine",
    description: "Lead routing, reminders, and response logic built around your workflow.",
    icon: Workflow,
  },
  {
    title: "Reporting + Optimisation",
    description: "KPI tracking for response speed, bookings, and revenue growth.",
    icon: Radar,
  },
];

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return buildMetadata({ path: "/services" });
  }

  return buildMetadata({ path: `/services/${service.slug}` });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedCaseStudy = caseStudies.find((caseStudy) => service.caseStudySlugs.includes(caseStudy.slug));
  const faqs = serviceDetailFaqs(service.title, service.slug);

  return (
    <>
      <JsonLd data={serviceSchema({ name: service.title, description: service.shortDescription, slug: service.slug, offer: service.entryPrice })} />
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />

      <SectionBlock className="pt-18 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionReveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Service</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">{service.title}</h1>
            <p className="mt-3 text-base font-medium text-cyan-200 md:text-lg">{service.strapline}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300 md:text-base">
              {service.outcomes.slice(0, 3).map((outcome) => (
                <li key={outcome} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                  {outcome}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryCTA />
              <Button asChild variant="outline" size="lg" className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
                <Link href="/book">Book a Call</Link>
              </Button>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-800">
                <ImageOrPlaceholder src={service.image} alt={service.title} label={service.title} className="h-full w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-[11px] text-slate-400 uppercase">Launch speed</p>
                  <p className="mt-1 text-sm font-semibold text-white">{service.timeline}</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-[11px] text-slate-400 uppercase">Entry investment</p>
                  <p className="mt-1 text-sm font-semibold text-white">{service.entryPrice}</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-[11px] text-slate-400 uppercase">Typical uplift</p>
                  <p className="mt-1 text-sm font-semibold text-white">+12-38%</p>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock className="pt-5">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">What we implement</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Done-for-you build checklist</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {service.deliverables.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.05}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <p className="text-sm text-slate-200">{item}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">From setup to measurable improvement</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            "Business context and conversion audit",
            "Core implementation sprint",
            "Automation + CRM handoff",
            "30-day optimisation cycle",
          ].map((step, index) => (
            <MotionReveal key={step} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <p className="text-xs text-cyan-300">Step {index + 1}</p>
                <p className="mt-2 text-sm text-slate-300">{step}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Tools included</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">System components inside this service</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {toolCards.map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <item.icon className="size-5 text-cyan-300" />
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 lg:grid-cols-3">
          <FunnelDiagram />
          <AutomationFlowDiagram />
          <KPICharts />
        </div>
      </SectionBlock>

      {relatedCaseStudy ? (
        <SectionBlock>
          <MotionReveal>
            <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/45 p-6 lg:grid-cols-[0.6fr_1.4fr]">
              <div className="relative overflow-hidden rounded-xl border border-slate-800">
                <ImageOrPlaceholder src={relatedCaseStudy.coverImage} alt={relatedCaseStudy.title} label={relatedCaseStudy.clientName} className="aspect-square h-full w-full" sizes="(min-width: 1024px) 25vw, 100vw" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Case study spotlight</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{relatedCaseStudy.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{relatedCaseStudy.snapshot}</p>
                <p className="mt-3 text-sm text-slate-200">Result: {relatedCaseStudy.outcomes[0]?.label} {relatedCaseStudy.outcomes[0]?.value}</p>
                <Button asChild variant="outline" className="mt-5 border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
                  <Link href={`/case-studies/${relatedCaseStudy.slug}`}>
                    Read full case study
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </MotionReveal>
        </SectionBlock>
      ) : null}

      <SectionBlock>
        <DeepSeoContent topic={`${service.title} deployment playbook`} audience="UK SME operators seeking measurable outcomes" image={service.image} />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal>
          <div className="rounded-2xl border border-cyan-500/30 bg-[linear-gradient(150deg,rgba(34,211,238,0.14),rgba(15,23,42,0.92))] p-7">
            <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Start this service from {service.entryPrice}</h2>
            <p className="mt-3 text-sm text-slate-200">Need exact scope and timeline? We will map a practical rollout based on your current stack.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <PrimaryCTA label="Get a Growth Plan" />
              <Button asChild variant="outline" size="lg" className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
                <Link href="/pricing">View pricing tiers</Link>
              </Button>
            </div>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Service questions</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title={`Want ${service.title} live this month?`} description="Tell us your current setup and we will provide timeline, deliverables, and measurable upside before we start." />
      </SectionBlock>
    </>
  );
}
