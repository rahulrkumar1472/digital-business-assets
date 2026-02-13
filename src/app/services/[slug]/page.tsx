import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { CtaActions } from "@/components/shared/cta-actions";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { caseStudies, getServiceBySlug, industries, services } from "@/data";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return buildMetadata({
      title: "Service Not Found | Digital Business Assets",
      description: "Requested service could not be found.",
      path: "/services",
    });
  }

  return buildMetadata({
    title: `${service.title} | Digital Business Assets`,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedCaseStudies = caseStudies.filter((caseStudy) =>
    service.caseStudySlugs.includes(caseStudy.slug),
  );

  const relatedIndustries = industries.filter((industry) =>
    service.industrySlugs.includes(industry.slug),
  );

  const Icon = service.icon;

  return (
    <>
      <JsonLd
        data={
          serviceSchema({
            name: service.title,
            description: service.shortDescription,
            slug: service.slug,
            offer: service.entryPrice,
          })
        }
      />

      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.longDescription}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3">
            <Icon className="size-5 text-cyan-300" />
            <div>
              <p className="text-xs tracking-[0.1em] text-cyan-200 uppercase">Entry offer</p>
              <p className="text-sm font-semibold text-white">{service.entryPrice}</p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/45 px-4 py-3">
            <p className="text-xs tracking-[0.1em] text-slate-400 uppercase">Timeline</p>
            <p className="text-sm font-semibold text-white">{service.timeline}</p>
          </div>
        </div>
      </PageHero>

      <Section className="pt-0 pb-14">
        <Reveal>
          <div className="relative aspect-[21/8] overflow-hidden rounded-2xl border border-slate-800">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </div>
        </Reveal>
      </Section>

      <Section className="py-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Reveal>
            <Card className="h-full border-slate-800 bg-slate-900/35">
              <CardHeader>
                <CardTitle className="text-lg text-white">Problems we fix</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-300">
                  {service.problems.map((problem) => (
                    <li key={problem} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.05}>
            <Card className="h-full border-slate-800 bg-slate-900/35">
              <CardHeader>
                <CardTitle className="text-lg text-white">Business outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-300">
                  {service.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="h-full border-slate-800 bg-slate-900/35">
              <CardHeader>
                <CardTitle className="text-lg text-white">Included deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-300">
                  {service.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      <span>{deliverable}</span>
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
            <SectionHeading
              eyebrow="Proof and relevance"
              title="Related case studies"
              description="See how this service performs in real delivery contexts."
            />
            <div className="mt-6 space-y-3">
              {relatedCaseStudies.map((caseStudy) => (
                <Link
                  key={caseStudy.slug}
                  href={`/case-studies/${caseStudy.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/35 p-4 transition-colors hover:border-cyan-400/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{caseStudy.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{caseStudy.clientName}</p>
                  </div>
                  <ArrowRight className="size-4 text-cyan-300 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <SectionHeading
              eyebrow="Where it fits"
              title="Industries we deploy this for"
              description="Pre-configured for these sectors, then adapted to your exact process."
            />
            <div className="mt-6 flex flex-wrap gap-3">
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
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/35 p-5">
              <p className="text-sm text-slate-300">
                Need implementation support across multiple services? We can sequence this service with your CRM,
                booking, and follow-up flows so nothing breaks between tools.
              </p>
              <div className="mt-4">
                <CtaActions
                  primaryLabel="Get a Free Build Plan"
                  secondaryHref="/book"
                  secondaryLabel="Book a Call"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="py-14 md:py-18">
        <Reveal>
          <SectionHeading
            eyebrow="FAQs"
            title={`Questions about ${service.title}`}
            description="Clear answers on setup, ownership, integrations, and rollout expectations."
          />
          <div className="mt-8">
            <FaqAccordion items={service.faqs} />
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0 pb-20">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/35 p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">Internal links</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Keep exploring this service journey
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <Link href="/contact">Talk to our team</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/35 text-slate-100 hover:bg-slate-800">
              <Link href="/book">Book strategy session</Link>
            </Button>
            <Button asChild variant="ghost" className="text-cyan-300 hover:bg-slate-800/50 hover:text-cyan-200">
              <Link href="/case-studies">See more outcomes</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
