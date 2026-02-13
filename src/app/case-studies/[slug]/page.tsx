import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeepSeoContent } from "@/components/marketing/deep-seo-content";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { caseStudies, getCaseStudyBySlug, services } from "@/data";
import { caseStudyDetailFaqs } from "@/data/page-faqs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { faqToSchemaItems } from "@/lib/schema-helpers";

type CaseStudyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const timeline = [
  { phase: "Day 1-2", item: "Audit and funnel mapping" },
  { phase: "Day 3-7", item: "Build core pages and integrations" },
  { phase: "Day 8-30", item: "Automate follow-up and optimise" },
];

const resultDashboard = [
  { label: "Leads", value: "↑ 32%" },
  { label: "Bookings", value: "↑ 29%" },
  { label: "Response time", value: "↓ 68%" },
  { label: "Revenue recovered", value: "↑ 18k/mo" },
];

export async function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: CaseStudyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return buildMetadata({ path: "/case-studies" });
  }

  return buildMetadata({ path: `/case-studies/${caseStudy.slug}` });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyDetailPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const stack = services.filter((service) => caseStudy.serviceSlugs.includes(service.slug));
  const faqs = caseStudyDetailFaqs(caseStudy.title);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: caseStudy.title, path: `/case-studies/${caseStudy.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(faqToSchemaItems(faqs))} />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Case study</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">{caseStudy.title}</h1>
          <p className="mt-3 text-sm text-slate-300 md:text-base">{caseStudy.snapshot}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryCTA />
            <Button asChild variant="outline" size="lg" className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <div className="grid gap-4 md:grid-cols-4">
          {resultDashboard.map((item, index) => (
            <MotionReveal key={item.label} delay={index * 0.05}>
              <div className="rounded-xl border border-slate-800 bg-slate-900/45 p-4">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">{item.value}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-6 lg:grid-cols-2">
          <MotionReveal>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
              <h2 className="text-2xl font-semibold text-white">Problem</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{caseStudy.challenge}</p>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
              <h2 className="text-2xl font-semibold text-white">System</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {caseStudy.approach.map((step) => (
                  <li key={step} className="list-disc pl-1 marker:text-cyan-300">{step}</li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <MotionReveal>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
              <h2 className="text-2xl font-semibold text-white">Result metrics</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {caseStudy.outcomes.map((outcome) => (
                  <div key={outcome.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-xs text-slate-400">{outcome.label}</p>
                    <p className="mt-2 text-xl font-semibold text-cyan-200">{outcome.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
              <h2 className="text-2xl font-semibold text-white">Stack used</h2>
              <div className="mt-4 space-y-3">
                {stack.map((service) => (
                  <Link key={service.slug} href={`/services/${service.slug}`} className="block rounded-xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-cyan-400/40">
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>
      </SectionBlock>

      <SectionBlock>
        <MotionReveal>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-6">
            <h2 className="text-2xl font-semibold text-white">Timeline</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {timeline.map((phase) => (
                <div key={phase.phase} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs text-cyan-300">{phase.phase}</p>
                  <p className="mt-2 text-sm text-slate-300">{phase.item}</p>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock>
        <DeepSeoContent topic={`${caseStudy.clientSector} case study rollout`} audience="SME owners benchmarking implementation quality" image={caseStudy.coverImage} />
      </SectionBlock>

      <SectionBlock>
        <MotionReveal className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Implementation questions</h2>
        </MotionReveal>
        <div className="mt-8"><FAQ items={faqs} /></div>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA title="Want this level of result in your business?" description="We will map your equivalent implementation path with timeline, system stack, and upside estimate." />
      </SectionBlock>
    </>
  );
}
