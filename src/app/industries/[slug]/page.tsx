import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { FunnelDiagram } from "@/components/marketing/funnel-diagram";
import { InContextPricing } from "@/components/marketing/in-context-pricing";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { ProofCard } from "@/components/marketing/proof-card";
import { SectionBlock } from "@/components/marketing/section-block";
import { SystemDiagram } from "@/components/marketing/system-diagram";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { caseStudies, getIndustryBySlug, industries, services } from "@/data";
import { industryDetailFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

type IndustryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const metrics = [
  { label: "Lead response speed", value: "Usually faster in 7 days" },
  { label: "Booking consistency", value: "Improves with reminders + follow-up" },
  { label: "Missed demand recovery", value: "Improves when call loss is automated" },
  { label: "Owner visibility", value: "Clear pipeline and KPI view" },
];

const rollout = [
  {
    title: "Phase 1: Fix what is leaking now",
    bullets: [
      "You remove the biggest conversion blocker first.",
      "You tighten lead capture across call, form, and WhatsApp.",
      "You launch a clear contact path buyers can trust.",
    ],
  },
  {
    title: "Phase 2: Speed up follow-up",
    bullets: [
      "You add CRM stages with clear ownership.",
      "You automate first replies, reminders, and task routing.",
      "You reduce delay between enquiry and booking.",
    ],
  },
  {
    title: "Phase 3: Scale what is already working",
    bullets: [
      "You track where bookings are coming from.",
      "You add modules based on real bottlenecks.",
      "You improve repeat business and referral flow.",
    ],
  },
];

export async function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return buildMetadata({ path: "/industries" });
  }

  return buildMetadata({ path: `/industries/${industry.slug}` });
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  const recommendedServices = services.filter((service) => industry.recommendedServiceSlugs.includes(service.slug));
  const relatedCaseStudy = caseStudies.find((caseStudy) => industry.caseStudySlugs.includes(caseStudy.slug));
  const faqs = industryDetailFaqs(industry.name, industry.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">{industry.name}</p>
          <h1 className="mt-3 text-5xl font-semibold text-white md:text-7xl">
            If you run a {industry.name.toLowerCase()} business, this is what you should fix first.
          </h1>
          <ul className="mt-4 max-w-3xl space-y-2 text-sm text-slate-300 md:text-base">
            <li className="list-disc pl-1 marker:text-cyan-300">You need faster response so warm demand does not cool down.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You need clearer trust signals so buyers choose you sooner.</li>
            <li className="list-disc pl-1 marker:text-cyan-300">You need follow-up discipline so leads become booked work.</li>
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
        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <MotionReveal key={metric.label} delay={index * 0.05}>
              <div className="h-full rounded-xl border border-slate-800 bg-slate-900/45 p-4">
                <p className="text-xs text-slate-400">{metric.label}</p>
                <p className="mt-2 text-sm font-semibold text-cyan-200">{metric.value}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-4 md:grid-cols-2">
          <MotionReveal>
            <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
              <h2 className="text-2xl font-semibold text-white">What is probably hurting your growth now</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {industry.challenges.map((challenge) => (
                  <li key={challenge} className="inline-flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </article>
          </MotionReveal>

          <MotionReveal delay={0.05}>
            <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
              <h2 className="text-2xl font-semibold text-white">What we install for your team</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {industry.opportunities.map((opportunity) => (
                  <li key={opportunity} className="inline-flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </article>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Recommended modules</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">Start with the stack that fits your current bottleneck</h2>
        </MotionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendedServices.map((service, index) => (
            <MotionReveal key={service.slug} delay={index * 0.04}>
              <Link
                href={`/services/${service.slug}`}
                className="group block h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-400/45"
              >
                <p className="text-xs font-semibold tracking-[0.1em] text-cyan-200 uppercase">{service.entryPrice}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{service.outcomes[0] || service.strapline}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                  {service.deliverables.slice(0, 2).map((item) => (
                    <li key={item} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 text-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-300">
                  View service
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">How your rollout works</p>
          <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">You install in sequence, not chaos.</h2>
        </MotionReveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {rollout.map((phase, index) => (
            <MotionReveal key={phase.title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <h3 className="text-lg font-semibold text-white">{phase.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {phase.bullets.map((item) => (
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
        <div className="grid gap-4 lg:grid-cols-2">
          <FunnelDiagram />
          <SystemDiagram />
        </div>
      </SectionBlock>

      <SectionBlock>
        <KPICharts />
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
          <div className="mt-5">
            <Button
              asChild
              variant="outline"
              className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800"
            >
              <Link href={`/case-studies/${relatedCaseStudy.slug}`}>
                Read the case study
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </SectionBlock>
      ) : null}

      <SectionBlock>
        <InContextPricing
          compact
          title={`Pricing for ${industry.name.toLowerCase()} installs`}
          description="You can begin with one high-priority service from £399-£599 and add subscription support when you are ready to scale."
        />
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent
          topic={`${industry.name} Business OS implementation`}
          audience={`${industry.name} owners and operators who want predictable growth systems`}
          image="/media/industry-solutions-grid.svg"
        />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Industry implementation questions</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA
          title={`Ready to deploy your ${industry.name} growth stack?`}
          description="You get a practical rollout plan, transparent pricing, and clear next actions for this month."
        />
      </SectionBlock>
    </>
  );
}
