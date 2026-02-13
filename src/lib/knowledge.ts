import { caseStudies, industries, services } from "@/data";
import { blogPosts } from "@/content/blog/posts";

export type KnowledgeDocumentType = "service" | "industry" | "case-study" | "blog";

export type KnowledgeDocument = {
  id: string;
  type: KnowledgeDocumentType;
  slug: string;
  title: string;
  content: string;
  tags: string[];
};

function compactLines(lines: string[]) {
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export const knowledgeDocuments: KnowledgeDocument[] = [
  ...services.map((service) => ({
    id: `service:${service.slug}`,
    type: "service" as const,
    slug: service.slug,
    title: service.title,
    tags: ["service", service.slug, ...service.industrySlugs],
    content: compactLines([
      `Service: ${service.title}`,
      `Strapline: ${service.strapline}`,
      `Summary: ${service.shortDescription}`,
      `Problems solved: ${service.problems.join("; ")}`,
      `Outcomes: ${service.outcomes.join("; ")}`,
      `Deliverables: ${service.deliverables.join("; ")}`,
      `Entry price: ${service.entryPrice}`,
      `Timeline: ${service.timeline}`,
    ]),
  })),
  ...industries.map((industry) => ({
    id: `industry:${industry.slug}`,
    type: "industry" as const,
    slug: industry.slug,
    title: industry.name,
    tags: ["industry", industry.slug],
    content: compactLines([
      `Industry: ${industry.name}`,
      `Audience: ${industry.audience}`,
      `Summary: ${industry.summary}`,
      `Typical challenges: ${industry.challenges.join("; ")}`,
      `Opportunities: ${industry.opportunities.join("; ")}`,
      `Recommended services: ${industry.recommendedServiceSlugs.join(", ")}`,
    ]),
  })),
  ...caseStudies.map((caseStudy) => ({
    id: `case-study:${caseStudy.slug}`,
    type: "case-study" as const,
    slug: caseStudy.slug,
    title: caseStudy.title,
    tags: ["case-study", caseStudy.slug, caseStudy.clientSector.toLowerCase()],
    content: compactLines([
      `Case study: ${caseStudy.title}`,
      `Client sector: ${caseStudy.clientSector}`,
      `Challenge: ${caseStudy.challenge}`,
      `Approach: ${caseStudy.approach.join("; ")}`,
      `Outcomes: ${caseStudy.outcomes.map((item) => `${item.label} ${item.value}`).join("; ")}`,
    ]),
  })),
  ...blogPosts.map((post) => ({
    id: `blog:${post.slug}`,
    type: "blog" as const,
    slug: post.slug,
    title: post.title,
    tags: ["blog", post.slug, post.cluster || "general"],
    content: compactLines([
      `Blog: ${post.title}`,
      `Cluster: ${post.cluster || "General"}`,
      `Summary: ${post.summary || post.excerpt}`,
      `Primary service link: ${post.primaryServiceLink || "/services"}`,
      `Published: ${post.publishedAt}`,
    ]),
  })),
];

export function getKnowledgeChunks(limit = 24) {
  return knowledgeDocuments.slice(0, limit).map((doc) => ({
    id: doc.id,
    metadata: {
      type: doc.type,
      slug: doc.slug,
      title: doc.title,
      tags: doc.tags,
    },
    text: doc.content,
  }));
}

export function buildKnowledgeDigest(limit = 18) {
  return getKnowledgeChunks(limit)
    .map((chunk) => `- [${chunk.metadata.type}] ${chunk.metadata.title}: ${chunk.text}`)
    .join("\n");
}

export function findIndustryByName(query: string) {
  const normalised = query.toLowerCase().trim();
  if (!normalised) {
    return null;
  }

  return (
    industries.find((industry) =>
      industry.name.toLowerCase() === normalised || industry.slug.toLowerCase().includes(normalised),
    ) ?? null
  );
}
