import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { ImageOrPlaceholder } from "@/components/marketing/image-or-placeholder";
import { KPICharts } from "@/components/marketing/kpi-charts";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { SectionBlock } from "@/components/marketing/section-block";
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

const metricStrip = [
  { label: "Response time", value: "↓ 35-70%" },
  { label: "Booked appointments", value: "+18-45%" },
  { label: "Missed lead recovery", value: "+40-88%" },
  { label: "Pipeline visibility", value: "100% tracked" },
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
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <MotionReveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Industry</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">For {industry.name}, we typically fix:</h1>
            <ul className="mt-4 space-y-2 text-sm text-slate-300 md:text-base">
              {industry.challenges.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-cyan-200">{industry.audience}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryCTA />
              <Button asChild variant="outline" size="lg" className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
                <Link href="/book">Book a Call</Link>
              </Button>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800">
              <ImageOrPlaceholder src={industry.coverImage} alt={industry.name} label={industry.name} className="aspect-[5/4] h-full w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock className="pt-5">
        <div className="grid gap-4 md:grid-cols-4">
          {metricStrip.map((metric, index) => (
            <MotionReveal key={metric.label} delay={index * 0.05}>
              <div className="rounded-xl border border-slate-800 bg-slate-900/45 p-4">
                <p className="text-xs text-slate-400">{metric.label}</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">{metric.value}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-5 md:grid-cols-2">
          <MotionReveal>
            <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
              <h2 className="text-2xl font-semibold text-white">Common problems</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {industry.challenges.map((item) => (
                  <li key={item} className="list-disc pl-1 marker:text-cyan-300">{item}</li>
                ))}
              </ul>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.05}>
            <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
              <h2 className="text-2xl font-semibold text-white">System we install</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {industry.opportunities.map((item) => (
                  <li key={item} className="list-disc pl-1 marker:text-cyan-300">{item}</li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <KPICharts />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal>
          <h2 className="text-3xl font-semibold text-white">Recommended services</h2>
        </MotionReveal>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendedServices.map((service, index) => (
            <MotionReveal key={service.slug} delay={index * 0.04}>
              <Link href={`/services/${service.slug}`} className="group block h-full rounded-2xl border border-slate-800 bg-slate-900/45 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-400/45">
                <p className="text-sm font-semibold text-white">{service.title}</p>
                <p className="mt-1 text-xs text-slate-400">{service.entryPrice}</p>
                <p className="mt-3 text-sm text-slate-300">{service.shortDescription}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-300">View service <ArrowRight className="size-3.5" /></span>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      {relatedCaseStudy ? (
        <SectionBlock>
          <MotionReveal>
            <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/45 p-6 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="relative overflow-hidden rounded-xl border border-slate-800">
                <ImageOrPlaceholder src={relatedCaseStudy.coverImage} alt={relatedCaseStudy.title} label={relatedCaseStudy.clientName} className="aspect-square h-full w-full" sizes="(min-width: 1024px) 30vw, 100vw" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">Industry case study</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{relatedCaseStudy.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{relatedCaseStudy.snapshot}</p>
                <p className="mt-3 text-sm text-slate-200">Result: {relatedCaseStudy.outcomes[0]?.label} {relatedCaseStudy.outcomes[0]?.value}</p>
                <Button asChild variant="outline" className="mt-5 border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
                  <Link href={`/case-studies/${relatedCaseStudy.slug}`}>Read full case study <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
            </div>
          </MotionReveal>
        </SectionBlock>
      ) : null}

      <SectionBlock>
        <DeepSeoContent topic={`${industry.name} growth deployment`} audience={`${industry.name} business owners and managers`} image={industry.coverImage} />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Industry implementation questions</h2>
        </MotionReveal>
        <div className="mt-8">
          <FAQ items={faqs} />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title={`Want a ${industry.name} system mapped in 15 minutes?`} description="Share your current process and we will define the exact setup, timeline, and expected gains for your sector." />
      </SectionBlock>
    </>
  );
}
