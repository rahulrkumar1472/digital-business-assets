import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { CtaActions } from "@/components/shared/cta-actions";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { caseStudies, getIndustryBySlug, industries, services } from "@/data";
import { buildMetadata } from "@/lib/seo";

type IndustryDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return buildMetadata({
      title: "Industry Not Found | Digital Business Assets",
      description: "Requested industry page could not be found.",
      path: "/industries",
    });
  }

  return buildMetadata({
    title: `${industry.name} Solutions | Digital Business Assets`,
    description: industry.summary,
    path: `/industries/${industry.slug}`,
    image: industry.coverImage,
  });
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  const recommendedServices = services.filter((service) =>
    industry.recommendedServiceSlugs.includes(service.slug),
  );

  const relatedCaseStudies = caseStudies.filter((caseStudy) =>
    industry.caseStudySlugs.includes(caseStudy.slug),
  );

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={industry.name}
        description={industry.summary}
      >
        <p className="text-sm text-slate-300">{industry.audience}</p>
      </PageHero>

      <Section className="pt-0 pb-12">
        <Reveal>
          <div className="relative aspect-[21/8] overflow-hidden rounded-2xl border border-slate-800">
            <Image
              src={industry.coverImage}
              alt={industry.name}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </div>
        </Reveal>
      </Section>

      <Section className="py-8 md:py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Card className="h-full border-slate-800 bg-slate-900/35">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Common challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-300">
                  {industry.challenges.map((challenge) => (
                    <li key={challenge} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.05}>
            <Card className="h-full border-slate-800 bg-slate-900/35">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Growth opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-300">
                  {industry.opportunities.map((opportunity) => (
                    <li key={opportunity} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      <span>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section className="py-14 md:py-18">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-semibold text-white">Recommended service stack</h2>
            <div className="mt-4 space-y-3">
              {recommendedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/35 p-4 transition-colors hover:border-cyan-400/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{service.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{service.entryPrice}</p>
                  </div>
                  <ArrowRight className="size-4 text-cyan-300 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-2xl font-semibold text-white">Relevant case studies</h2>
            <div className="mt-4 space-y-3">
              {relatedCaseStudies.map((caseStudy) => (
                <Link
                  key={caseStudy.slug}
                  href={`/case-studies/${caseStudy.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/35 p-4 transition-colors hover:border-cyan-400/50"
                >
                  <span className="text-sm text-slate-200">{caseStudy.title}</span>
                  <ArrowRight className="size-4 text-cyan-300 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/35 p-5">
              <p className="text-sm text-slate-300">
                We can tailor this exact framework to your team size, service area, and sales cycle.
              </p>
              <div className="mt-4">
                <CtaActions primaryLabel="Get a Free Build Plan" secondaryLabel="Book a call" secondaryHref="/book" />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="pt-0 pb-20">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/35 p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-white">Need a sector-specific implementation map?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            We will map your current lead journey, identify high-leverage automation points, and provide a step-by-step
            build sequence to ship quickly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <Link href="/contact">Contact our team</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/35 text-slate-100 hover:bg-slate-800">
              <Link href="/services">Explore services</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
