import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cookie Policy | Digital Business Assets",
  description: "Cookie policy placeholder for Digital Business Assets.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="This placeholder outlines cookie usage categories. Replace with your CMP-configured policy before launch."
      />
      <Section className="py-8 md:py-16">
        <article className="mx-auto max-w-4xl space-y-6 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white">1. Essential cookies</h2>
            <p className="mt-2">
              Required for core site functionality such as form handling, session integrity, and security controls.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">2. Analytics cookies</h2>
            <p className="mt-2">
              Used to measure traffic sources, user behaviour, and conversion performance.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">3. Marketing cookies</h2>
            <p className="mt-2">
              Used for campaign attribution and remarketing where consent is provided.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white">4. Managing preferences</h2>
            <p className="mt-2">
              Users can manage cookie choices via your consent banner and browser settings.
            </p>
          </section>
        </article>
      </Section>
    </>
  );
}
