import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service | Digital Business Assets",
  description: "Terms of service placeholder for Digital Business Assets.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="This is a production-ready placeholder. Replace with your final legal terms before launch."
      />
      <Section className="py-8 md:py-16">
        <article className="mx-auto max-w-4xl space-y-6 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white">1. Scope of services</h2>
            <p className="mt-2">
              We provide digital strategy, development, automation, and managed growth services as defined in signed
              proposals or statements of work.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">2. Fees and payment</h2>
            <p className="mt-2">
              Monthly or project fees are due according to your signed agreement. Late payment may pause service
              delivery.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">3. Client responsibilities</h2>
            <p className="mt-2">
              Clients must provide accurate information, timely approvals, and access to required systems for delivery.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">4. Liability</h2>
            <p className="mt-2">
              Liability terms, warranties, and dispute handling are governed by your signed contract and UK law.
            </p>
          </section>
        </article>
      </Section>
    </>
  );
}
