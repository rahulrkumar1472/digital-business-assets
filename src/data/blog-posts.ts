import type { BlogPost } from "@/types/content";

export const blogPosts: BlogPost[] = [
  {
    slug: "why-uk-smes-miss-leads-after-hours",
    title: "Why UK SMEs lose high-intent leads after hours",
    excerpt:
      "A practical breakdown of where enquiries leak and how to fix follow-up speed without adding headcount.",
    coverImage: "/media/services-automation.jpg",
    author: "Digital Business Assets Team",
    publishedAt: "2026-01-15",
    readTime: "6 min read",
    tags: ["Lead Generation", "Operations", "Automation"],
    sections: [
      {
        heading: "The hidden cost of missed calls",
        body:
          "Most service businesses underestimate the revenue impact of missed calls and late responses. Prospects contact multiple suppliers. If your team replies hours later, conversion probability drops sharply.",
      },
      {
        heading: "Build a response system, not just a website",
        body:
          "Your website should trigger actions: qualification, routing, reminders, and pipeline updates. Without this, even good traffic fails to convert reliably.",
      },
      {
        heading: "What to implement first",
        body:
          "Start with lead capture, instant confirmation, and owner-level visibility on first response time. Then add AI chat or call coverage to eliminate after-hours leakage.",
      },
    ],
  },
  {
    slug: "aeo-for-local-service-businesses",
    title: "AEO for local service businesses: what changes in 2026",
    excerpt:
      "How to structure your service pages so AI assistants can cite your business with confidence.",
    coverImage: "/media/services-seo.jpg",
    author: "Digital Business Assets Team",
    publishedAt: "2026-01-05",
    readTime: "7 min read",
    tags: ["SEO", "AEO", "Content Strategy"],
    sections: [
      {
        heading: "From ranking pages to answer entities",
        body:
          "Traditional rankings still matter, but AI systems rely on clear entities, factual consistency, and topical completeness. Your site structure must support extraction and trust.",
      },
      {
        heading: "Core AEO implementation",
        body:
          "Use clear service definitions, FAQ blocks, schema markup, and evidence-driven case studies. Keep language precise and location signals explicit.",
      },
      {
        heading: "Measure what matters",
        body:
          "Track high-intent visibility, not vanity traffic. Focus on qualified calls, booked meetings, and conversion rate by landing page intent.",
      },
    ],
  },
  {
    slug: "crm-pipeline-design-for-small-teams",
    title: "CRM pipeline design for small teams that move fast",
    excerpt:
      "A lean CRM model for owners who want clarity, accountability, and cleaner conversion reporting.",
    coverImage: "/media/services-automation.jpg",
    author: "Digital Business Assets Team",
    publishedAt: "2025-12-20",
    readTime: "5 min read",
    tags: ["CRM", "Sales Ops", "Small Business"],
    sections: [
      {
        heading: "Why most pipelines fail",
        body:
          "If stages are vague, nobody knows who owns next action. Small teams need simple stage definitions tied to concrete commitments.",
      },
      {
        heading: "A practical stage model",
        body:
          "Use stages like New Lead, Qualified, Booked, Proposal Sent, Won, Lost. Add SLA expectations and automate reminders at each stage.",
      },
      {
        heading: "Management cadence",
        body:
          "Review response time, stage aging, and win rate weekly. This exposes bottlenecks early and keeps growth predictable.",
      },
    ],
  },
  {
    slug: "website-in-72-hours-playbook",
    title: "Website in 72 hours: our sprint playbook",
    excerpt:
      "How we scope, write, build, and launch conversion-focused websites in three days.",
    coverImage: "/media/services-web.jpg",
    author: "Digital Business Assets Team",
    publishedAt: "2025-12-01",
    readTime: "8 min read",
    tags: ["Web Design", "Conversion", "Delivery"],
    sections: [
      {
        heading: "Day one: message and structure",
        body:
          "We lock the offer, audience, and conversion path before touching visuals. A clear message architecture prevents expensive rewrites later.",
      },
      {
        heading: "Day two: build and integrate",
        body:
          "We implement pages, forms, analytics events, and CRM wiring in one pass. Every page has a specific conversion goal.",
      },
      {
        heading: "Day three: QA and launch",
        body:
          "Performance checks, mobile QA, metadata, and final copy polish are completed before deployment. Teams get a clean handover and growth roadmap.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
