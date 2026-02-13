import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaActions } from "@/components/shared/cta-actions";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts, getBlogPostBySlug } from "@/data";
import { buildMetadata } from "@/lib/seo";

type BlogPostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Post Not Found | Digital Business Assets",
      description: "Requested blog post could not be found.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title: `${post.title} | Digital Business Assets`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
  });
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Blog Article"
        title={post.title}
        description={post.excerpt}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>{post.author}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-GB")}</time>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-cyan-500/40 text-cyan-200">
              {tag}
            </Badge>
          ))}
        </div>
      </PageHero>

      <Section className="pt-0 pb-12">
        <Reveal>
          <div className="relative aspect-[21/8] overflow-hidden rounded-2xl border border-slate-800">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </div>
        </Reveal>
      </Section>

      <Section className="py-8 md:py-14">
        <article className="mx-auto max-w-3xl space-y-10">
          {post.sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.04}>
              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                <p className="text-base leading-relaxed text-slate-300">{section.body}</p>
              </section>
            </Reveal>
          ))}
        </article>
      </Section>

      <Section className="py-14 md:py-18">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/35 p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-white">Want this applied to your funnel?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            We can turn these frameworks into an implementation roadmap based on your current website, lead flow,
            and sales capacity.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaActions secondaryHref="/contact" secondaryLabel="Contact us" />
          </div>
          <div className="mt-6">
            <Button asChild variant="ghost" className="px-0 text-cyan-300 hover:bg-transparent hover:text-cyan-200">
              <Link href="/blog">Back to all articles</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
