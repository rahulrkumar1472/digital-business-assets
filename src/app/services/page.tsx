import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/shared/service-card";
import { Button } from "@/components/ui/button";
import { services } from "@/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services | Digital Business Assets",
  description:
    "Explore conversion-first services: websites in 72 hours, SEO/AEO, AI chatbots, workflows, CRM, and 24/7 call answering.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Hub"
        title="AI-first services designed to close growth gaps fast"
        description="Every service is structured around one question: which bottleneck is losing you revenue right now? Pick the system you need most and we will build it to production standard."
      >
        <Button asChild variant="outline" className="border-slate-700 bg-slate-900/40 text-slate-100 hover:bg-slate-800">
          <Link href="/book">
            Book a strategy call
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHero>

      <Section className="py-8">
        <Reveal>
          <SectionHeading
            title="What we build"
            description="Select a service to view outcomes, deliverables, implementation timeline, related case studies, and recommended next steps."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.05}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Need help choosing the right service first?"
        description="We will assess your current funnel and show which build gives the fastest return with the least internal effort."
      />
    </>
  );
}
