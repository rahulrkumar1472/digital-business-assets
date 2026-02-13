import Link from "next/link";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { ImageOrPlaceholder } from "@/components/marketing/image-or-placeholder";
import { blogPosts } from "@/content/blog/posts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/blog" });

const clusters = ["Websites", "SEO & AEO", "Automation & CRM", "Chatbots & AI Receptionist", "Case Studies & Playbooks"];

export default function BlogPage() {
  return (
    <>
      <SectionBlock className="pt-18 md:pt-24">
        <MotionReveal className="max-w-5xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Blog</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">50 launch guides for AI revenue implementation</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-lg">Clustered content designed to support search coverage, buyer education, and conversion-first internal linking.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
            {clusters.map((cluster) => (
              <span key={cluster} className="rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1">{cluster}</span>
            ))}
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-4 pb-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post, index) => (
            <MotionReveal key={post.slug} delay={index * 0.02}>
              <article className="h-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45">
                <div className="relative aspect-[16/9] border-b border-slate-800">
                  <ImageOrPlaceholder src={post.coverImage} alt={post.title} label={post.cluster || "Blog"} className="h-full w-full" sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-400">{new Date(post.publishedAt).toLocaleDateString("en-GB")} · {post.readTime}</p>
                  <p className="mt-2 text-xs font-semibold tracking-[0.08em] text-cyan-300 uppercase">{post.cluster}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{post.title}</h2>
                  <p className="mt-3 text-sm text-slate-300">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">Read article</Link>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </SectionBlock>
    </>
  );
}
