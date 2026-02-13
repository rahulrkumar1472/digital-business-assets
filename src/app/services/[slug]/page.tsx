import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Layers3, Radar, Workflow } from "lucide-react";

import { AutomationFlowDiagram } from "@/components/marketing/automation-flow-diagram";
import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { FunnelDiagram } from "@/components/marketing/funnel-diagram";
import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { ProofCard } from "@/components/marketing/proof-card";
import { SectionBlock } from "@/components/marketing/section-block";
import { SystemDiagram } from "@/components/marketing/system-diagram";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    title: "Conversion layer",
    description: "You get clear calls to action, lead capture, and objection handling that moves people to the next step.",
    icon: Layers3,
  },
  {
    title: "Execution automation",
    description: "You get timed follow-up, routing, and reminders so your team stops losing warm opportunities.",
    icon: Workflow,
  },
  {
    title: "Performance visibility",
    description: "You get practical KPI tracking so you can see what changed and what to deploy next.",
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
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <MotionReveal>
            <Badge variant="outline" className="border-cyan-500/45 bg-cyan-500/10 text-cyan-200">Service module</Badge>
            <h1 className="mt-3 text-5xl font-semibold text-white md:text-7xl">{service.title}</h1>
            <p className="mt-3 text-lg text-cyan-200">{service.strapline}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">{service.longDescription}</p>

            <ul className="mt-5 space-y-2 text-sm text-slate-200 md:text-base">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="inline-flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/book">Book your strategy call</Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800">
                <Link href="/tools/website-audit/start">Start free website scan</Link>
              </Button>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <Card className="border-slate-800/90 bg-slate-900/45 py-0">
              <CardHeader className="space-y-2 border-b border-slate-800/85 py-5">
                <CardTitle className="text-2xl text-white">What this module changes for you</CardTitle>
                <p className="text-sm text-slate-300">Problem → install → measurable result.</p>
              </CardHeader>
              <CardContent className="py-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                    <p className="text-[11px] text-slate-400 uppercase">From</p>
                    <p className="mt-1 text-lg font-semibold text-white">{service.entryPrice}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                    <p className="text-[11px] text-slate-400 uppercase">Timeline</p>
                    <p className="mt-1 text-lg font-semibold text-white">{service.timeline}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-3">
                    <p className="text-[11px] text-slate-400 uppercase">Next step</p>
                    <p className="mt-1 text-lg font-semibold text-white">Deploy + measure</p>
                  </div>
                </div>
                <Separator className="my-5 bg-slate-800" />
                <ul className="space-y-2 text-sm text-slate-300">
                  {service.problems.map((problem) => (
                    <li key={problem} className="list-disc pl-1 marker:text-cyan-300">
                      {problem}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">What you get</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">A complete checklist, not a vague deliverable list</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {service.deliverables.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.04}>
              <article className="h-full rounded-xl border border-slate-800 bg-slate-900/45 p-4 text-sm text-slate-200">{item}</article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">How fast</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">You know the timeline before we start</h2>
        </MotionReveal>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            "You share your current setup and access.",
            "We map your first sprint and acceptance criteria.",
            "We install and test the module in your stack.",
            "You track the impact and choose next modules.",
          ].map((step, index) => (
            <MotionReveal key={step} delay={index * 0.05}>
              <article className="h-full rounded-xl border border-slate-800 bg-slate-900/45 p-4">
                <p className="text-xs text-cyan-300">Step {index + 1}</p>
                <p className="mt-2 text-sm text-slate-300">{step}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-3">
          {toolCards.map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.05}>
              <Card className="h-full border-slate-800/90 bg-slate-900/45 py-0">
                <CardHeader className="space-y-2 py-5">
                  <item.icon className="size-5 text-cyan-300" />
                  <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-5 text-sm text-slate-300">{item.description}</CardContent>
              </Card>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 lg:grid-cols-3">
          <FunnelDiagram />
          <AutomationFlowDiagram />
          <SystemDiagram />
        </div>
      </SectionBlock>

      {relatedCaseStudy ? (
        <SectionBlock>
          <ProofCard
            title={relatedCaseStudy.title}
            before={relatedCaseStudy.challenge}
            after={relatedCaseStudy.snapshot}
            changed={relatedCaseStudy.approach}
            metric={`${relatedCaseStudy.clientSector} · ${relatedCaseStudy.location}`}
          />
          <div className="mt-4">
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800">
              <Link href={`/case-studies/${relatedCaseStudy.slug}`}>
                Read full case study
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </SectionBlock>
      ) : null}

      <SectionBlock>
        <MotionReveal>
          <div className="rounded-3xl border border-cyan-500/35 bg-[linear-gradient(150deg,rgba(34,211,238,0.14),rgba(15,23,42,0.94))] p-7 md:p-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">Pricing</p>
            <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">You can start this module {service.entryPrice}</h2>
            <ul className="mt-3 max-w-3xl space-y-2 text-sm text-slate-200">
              <li className="list-disc pl-1 marker:text-cyan-300">You get scoped implementation and a clear timeline.</li>
              <li className="list-disc pl-1 marker:text-cyan-300">You get measurable checkpoints, not vague updates.</li>
              <li className="list-disc pl-1 marker:text-cyan-300">You get the next-step recommendation once this is live.</li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/pricing">View all pricing</Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800">
                <Link href="/tools/website-audit/start">Start free website scan</Link>
              </Button>
            </div>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <InContextPricing
          compact
          title="Add monthly support when you want faster iteration"
          description="One-time install gets you live. Subscription support helps you optimise and deploy additional modules over time."
        />
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic={`${service.title} delivery playbook`} audience="Business owners choosing practical implementation over vague strategy" image={service.image} />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">What happens after you say yes?</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title={`Ready to install ${service.title}?`} description="You get the scope, timeline, and deployment sequence before work starts so you can decide with confidence." />
      </SectionBlock>
    </>
  );
}
