import { CtaBanner } from "@/components/shared/cta-banner";
import { CaseStudyCard } from "@/components/shared/case-study-card";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { caseStudies } from "@/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Case Studies | Digital Business Assets",
  description:
    "Read real project outcomes across UK SMEs: faster websites, stronger lead capture, automation, and CRM performance.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Delivery proof, not marketing theory"
        description="These are examples of full systems we delivered: websites, AI chatbots, CRM workflows, and follow-up automation tied to clear commercial outcomes."
      />

      <Section className="py-8 md:py-16">
        <Reveal>
          <SectionHeading
            title="Recent implementation outcomes"
            description="Browse the workflows, tools, and conversion changes behind each result."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {caseStudies.map((caseStudy, index) => (
            <Reveal key={caseStudy.slug} delay={index * 0.06}>
              <CaseStudyCard caseStudy={caseStudy} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Want similar outcomes in your business?"
        description="Share your current setup and we will map the fastest system changes to increase lead capture and booked revenue."
      />
    </>
  );
}
