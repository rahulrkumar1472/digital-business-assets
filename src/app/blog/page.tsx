import { BlogCard } from "@/components/shared/blog-card";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { blogPosts } from "@/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog | Digital Business Assets",
  description:
    "Practical playbooks on websites, automation, SEO/AEO, and CRM systems for UK small and medium businesses.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Operator-level insights for faster digital growth"
        description="Actionable guidance for owners and teams building lead generation, conversion, and automation systems."
      />

      <Section className="py-8 md:py-16">
        <Reveal>
          <SectionHeading
            title="Latest articles"
            description="Placeholder editorial content structure is in place and ready for your publishing workflow."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.05}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Need this turned into a full content engine?"
        description="We can map topic clusters, templates, and SEO/AEO workflows that connect directly to your lead funnel."
      />
    </>
  );
}
