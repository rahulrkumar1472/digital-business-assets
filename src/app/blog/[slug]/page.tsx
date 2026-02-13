import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { ImageOrPlaceholder } from "@/components/marketing/image-or-placeholder";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { JsonLd } from "@/components/shared/json-ld";
import { blogPosts, getBlogPostBySlug, getRelatedBlogPosts } from "@/content/blog/posts";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

type BlogPostDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const markdownLinkPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;

function renderBodyWithLinks(body: string): ReactNode {
  const matches = [...body.matchAll(markdownLinkPattern)];
  if (!matches.length) {
    return body;
  }

  const fragments: ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const [full, label, href] = match;
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      fragments.push(body.slice(lastIndex, matchIndex));
    }

    fragments.push(
      <Link key={`${href}-${index}`} href={href} className="text-cyan-300 hover:text-cyan-200">
        {label}
      </Link>,
    );

    lastIndex = matchIndex + full.length;
  });

  if (lastIndex < body.length) {
    fragments.push(body.slice(lastIndex));
  }

  return <>{fragments}</>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return buildMetadata({ path: "/blog" });
  }

  return buildMetadata({ path: `/blog/${post.slug}` });
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedBlogPosts(post, 3);

  return (
    <>
      <JsonLd data={articleSchema({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, publishedAt: post.publishedAt, image: post.coverImage, author: post.author })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Blog article</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">{post.title}</h1>
          <p className="mt-3 text-sm text-slate-400">{new Date(post.publishedAt).toLocaleDateString("en-GB")} · {post.readTime} · {post.cluster}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{post.excerpt}</p>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-800">
          <ImageOrPlaceholder src={post.infographicImage || "/media/blog-cover-placeholder.jpg"} alt={`${post.title} infographic`} label={post.cluster || "Infographic"} className="aspect-[16/9] h-full w-full" sizes="(min-width: 1024px) 70vw, 100vw" />
        </div>
      </SectionBlock>

      <SectionBlock className="pt-4 pb-20">
        <article className="mx-auto max-w-4xl space-y-8 rounded-3xl border border-slate-800 bg-slate-900/45 p-7 md:p-10">
          {post.sections.map((section, index) => (
            <MotionReveal key={section.heading} delay={index * 0.03}>
              <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                <p className="text-sm leading-relaxed text-slate-300">{renderBodyWithLinks(section.body)}</p>
                {section.bullets?.length ? (
                  <ul className="space-y-1.5 text-sm text-slate-200">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="list-disc pl-1 marker:text-cyan-300">{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>

              {index === 1 && post.ctaBlocks?.[0] ? (
                <aside className="mt-6 rounded-2xl border border-cyan-500/35 bg-cyan-500/10 p-5">
                  <h3 className="text-xl font-semibold text-white">{post.ctaBlocks[0].headline}</h3>
                  <p className="mt-2 text-sm text-cyan-100">{post.ctaBlocks[0].body}</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link href={post.ctaBlocks[0].primaryHref} className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">{post.ctaBlocks[0].primaryLabel}</Link>
                    {post.ctaBlocks[0].secondaryHref ? (
                      <Link href={post.ctaBlocks[0].secondaryHref} className="rounded-md border border-slate-700 bg-slate-900/55 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800">{post.ctaBlocks[0].secondaryLabel}</Link>
                    ) : null}
                  </div>
                </aside>
              ) : null}

              {index === 4 && post.ctaBlocks?.[1] ? (
                <aside className="mt-6 rounded-2xl border border-cyan-500/35 bg-cyan-500/10 p-5">
                  <h3 className="text-xl font-semibold text-white">{post.ctaBlocks[1].headline}</h3>
                  <p className="mt-2 text-sm text-cyan-100">{post.ctaBlocks[1].body}</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link href={post.ctaBlocks[1].primaryHref} className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">{post.ctaBlocks[1].primaryLabel}</Link>
                    {post.ctaBlocks[1].secondaryHref ? (
                      <Link href={post.ctaBlocks[1].secondaryHref} className="rounded-md border border-slate-700 bg-slate-900/55 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800">{post.ctaBlocks[1].secondaryLabel}</Link>
                    ) : null}
                  </div>
                </aside>
              ) : null}
            </MotionReveal>
          ))}

          <div className="rounded-2xl border border-slate-800 bg-slate-950/55 p-5">
            <h2 className="text-2xl font-semibold text-white">Related posts</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-xl border border-slate-800 bg-slate-900/55 p-3 text-sm text-slate-200 hover:border-cyan-400/45">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href={post.primaryServiceLink || "/services"} className="text-cyan-300 hover:text-cyan-200">Explore related service</Link>
            <Link href="/growth-simulator" className="text-cyan-300 hover:text-cyan-200">Run growth simulator</Link>
            <Link href="/book" className="text-cyan-300 hover:text-cyan-200">Book strategy call</Link>
          </div>

          <Link href="/blog" className="inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">Back to all articles</Link>
        </article>
      </SectionBlock>
    </>
  );
}
