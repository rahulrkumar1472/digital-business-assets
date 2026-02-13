import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { CtaActions } from "@/components/shared/cta-actions";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { caseStudies, getCaseStudyBySlug, industries, services } from "@/data";
import { buildMetadata } from "@/lib/seo";

type CaseStudyDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: CaseStudyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return buildMetadata({
      title: "Case Study Not Found | Digital Business Assets",
      description: "Requested case study could not be found.",
      path: "/case-studies",
    });
  }

  return buildMetadata({
    title: `${caseStudy.title} | Case Study`,
    description: caseStudy.snapshot,
    path: `/case-studies/${caseStudy.slug}`,
    image: caseStudy.coverImage,
  });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyDetailPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedServices = services.filter((service) =>
    caseStudy.serviceSlugs.includes(service.slug),
  );

  const relatedIndustries = industries.filter((industry) =>
    caseStudy.industrySlugs.includes(industry.slug),
  );

  return (
    <>
      <PageHero
        eyebrow="Case Study"
        title={caseStudy.title}
        description={caseStudy.snapshot}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
            {caseStudy.clientName}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/45 px-3 py-1 text-xs font-semibold text-slate-200">
            {caseStudy.location}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/45 px-3 py-1 text-xs font-semibold text-slate-200">
            {caseStudy.clientSector}
          </span>
        </div>
      </PageHero>

      <Section className="pt-0 pb-10">
        <Reveal>
          <div className="relative aspect-[21/8] overflow-hidden rounded-2xl border border-slate-800">
            <Image
              src={caseStudy.coverImage}
              alt={caseStudy.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </div>
        </Reveal>
      </Section>

      <Section className="py-8 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <Card className="border-slate-800 bg-slate-900/35">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-300">{caseStudy.challenge}</p>
              </CardContent>
            </Card>
            <Card className="mt-6 border-slate-800 bg-slate-900/35">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-slate-300">
                  {caseStudy.approach.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-xs font-semibold text-cyan-200">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.06}>
            <Card className="border-slate-800 bg-slate-900/35">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseStudy.outcomes.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <p className="text-xs tracking-[0.1em] text-slate-400 uppercase">{metric.label}</p>
                      <p className="mt-2 text-xl font-semibold text-cyan-200">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {caseStudy.testimonial ? (
                <Card className="mt-6 border-slate-800 bg-slate-900/35">
                  <CardContent className="pt-6">
                    <blockquote className="text-sm leading-relaxed text-slate-200">
                      &ldquo;{caseStudy.testimonial.quote}&rdquo;
                    </blockquote>
                  <p className="mt-4 text-xs font-semibold tracking-[0.08em] text-cyan-300 uppercase">
                    {caseStudy.testimonial.author}
                  </p>
                  <p className="text-xs text-slate-400">{caseStudy.testimonial.role}</p>
                </CardContent>
              </Card>
            ) : null}
          </Reveal>
        </div>
      </Section>

      <Section className="py-14 md:py-18">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-semibold text-white">Services used</h2>
            <div className="mt-4 space-y-3">
              {relatedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/35 p-4 transition-colors hover:border-cyan-400/50"
                >
                  <span className="text-sm text-slate-200">{service.title}</span>
                  <ArrowRight className="size-4 text-cyan-300 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-2xl font-semibold text-white">Relevant industries</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedIndustries.map((industry) => (
                <Button
                  key={industry.slug}
                  asChild
                  variant="outline"
                  className="border-slate-700 bg-slate-900/35 text-slate-100 hover:bg-slate-800"
                >
                  <Link href={`/industries/${industry.slug}`}>{industry.name}</Link>
                </Button>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/35 p-5">
              <p className="text-sm text-slate-300">
                Want this implemented in your business? We will scope the equivalent system for your team,
                tools, and sales process.
              </p>
              <div className="mt-4">
                <CtaActions primaryLabel="Get a Free Build Plan" secondaryLabel="Contact us" secondaryHref="/contact" />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
