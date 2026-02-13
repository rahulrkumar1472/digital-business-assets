import { CtaBanner } from "@/components/shared/cta-banner";
import { IndustryCard } from "@/components/shared/industry-card";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { industries } from "@/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Industries | Digital Business Assets",
  description:
    "Industry-specific digital systems for UK SMEs across trades, clinics, estate agencies, legal, and more.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Sector-specific systems built for how your business actually runs"
        description="We adapt your website, CRM, automation, and follow-up stack to industry buying behaviour, workflow constraints, and response expectations."
      />

      <Section className="py-8 md:py-16">
        <Reveal>
          <SectionHeading
            title="Industry playbooks"
            description="Choose your industry to view common bottlenecks, recommended services, and relevant delivery examples."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry, index) => (
            <Reveal key={industry.slug} delay={index * 0.05}>
              <IndustryCard industry={industry} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Not listed here?"
        description="We can still scope your sector. Share your current flow and we will build a custom implementation roadmap."
      />
    </>
  );
}
