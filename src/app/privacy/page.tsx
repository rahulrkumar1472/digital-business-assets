import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy | Digital Business Assets",
  description: "Privacy policy placeholder for Digital Business Assets.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This is a production-ready placeholder. Replace with your solicitor-approved policy before go-live."
      />
      <Section className="py-8 md:py-16">
        <article className="mx-auto max-w-4xl space-y-6 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white">1. Data we collect</h2>
            <p className="mt-2">
              We collect contact details, enquiry information, website analytics, and project communications required
              to deliver our services.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">2. How we use data</h2>
            <p className="mt-2">
              Data is used to respond to enquiries, provide services, improve product performance, and meet legal
              obligations.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">3. Data retention</h2>
            <p className="mt-2">
              We retain data for as long as required to provide services, maintain records, and comply with
              regulation.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">4. Your rights</h2>
            <p className="mt-2">
              You may request access, correction, deletion, or portability of your personal data in line with UK GDPR.
            </p>
          </section>
        </article>
      </Section>
    </>
  );
}
