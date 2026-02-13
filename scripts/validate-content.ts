import { readFile } from "node:fs/promises";
import path from "node:path";

import { blogPosts } from "../src/content/blog/posts";
import { industries } from "../src/data/industries";

type ClusterKey = "Websites" | "SEO & AEO" | "Automation & CRM" | "Chatbots & AI Receptionist" | "Case Studies & Playbooks";

function fail(message: string): never {
  console.error(`\n[content-validator] ${message}`);
  process.exit(1);
}

function warn(message: string) {
  console.warn(`[content-validator][warn] ${message}`);
}

function countWords(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/[^A-Za-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function extractStringLiterals(source: string) {
  const values: string[] = [];
  const pattern = /`([\s\S]*?)`|"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;

  for (const match of source.matchAll(pattern)) {
    values.push((match[1] || match[2] || match[3] || "").trim());
  }

  return values.filter((value) => value.length > 0);
}

async function estimatePageWordCount(filePath: string, deepSeoBonusWords: number) {
  const absolutePath = path.join(process.cwd(), filePath);
  const source = await readFile(absolutePath, "utf8");
  const literalWords = extractStringLiterals(source).reduce((sum, literal) => sum + countWords(literal), 0);
  const includesDeepSeo = source.includes("<DeepSeoContent");
  const deepSeoEstimate = includesDeepSeo ? Math.max(deepSeoBonusWords, 1900) : 0;
  const estimatedWords = literalWords + deepSeoEstimate;

  const longLiteral = extractStringLiterals(source).find((literal) => countWords(literal) > 250);
  if (longLiteral) {
    warn(`${filePath} contains a paragraph/literal over 250 words (dev warning).`);
  }

  return {
    estimatedWords,
    includesDeepSeo,
  };
}

async function main() {
  const clusterCounts = new Map<ClusterKey, number>();

  for (const post of blogPosts) {
    const cluster = post.cluster as ClusterKey;
    clusterCounts.set(cluster, (clusterCounts.get(cluster) || 0) + 1);

    const sectionWords = post.sections.reduce((sum, section) => sum + countWords(section.body), 0);
    const ctaWords = (post.ctaBlocks || []).reduce((sum, block) => sum + countWords(block.body), 0);
    const totalWords = sectionWords + ctaWords + countWords(post.excerpt) + countWords(post.summary || "");

    if (totalWords < 1800 || totalWords > 2500) {
      fail(`Blog post \"${post.slug}\" must be 1800-2500 words. Estimated: ${totalWords}.`);
    }

    if (!post.coverImage.startsWith("/media/blog/")) {
      fail(`Blog post \"${post.slug}\" must use a featured image in /public/media/blog.`);
    }

    const linksJoined = `${post.primaryServiceLink || ""} ${(post.sections || []).map((section) => section.body).join(" ")}`;
    if (!linksJoined.includes("/growth-simulator") || !linksJoined.includes("/book")) {
      fail(`Blog post \"${post.slug}\" must include internal links to /growth-simulator and /book.`);
    }
  }

  if (blogPosts.length !== 50) {
    fail(`Expected 50 blog posts, found ${blogPosts.length}.`);
  }

  const expectedClusters: ClusterKey[] = [
    "Websites",
    "SEO & AEO",
    "Automation & CRM",
    "Chatbots & AI Receptionist",
    "Case Studies & Playbooks",
  ];

  for (const cluster of expectedClusters) {
    if ((clusterCounts.get(cluster) || 0) !== 10) {
      fail(`Cluster \"${cluster}\" must have 10 posts. Found ${(clusterCounts.get(cluster) || 0)}.`);
    }
  }

  if (industries.length < 20) {
    fail(`Expected at least 20 industries, found ${industries.length}.`);
  }

  const deepSeoSource = await readFile(path.join(process.cwd(), "src/components/marketing/deep-seo-content.tsx"), "utf8");
  const deepSeoBonusWords = extractStringLiterals(deepSeoSource).reduce((sum, literal) => sum + countWords(literal), 0);

  const corePageFiles = [
    "src/app/page.tsx",
    "src/app/services/page.tsx",
    "src/app/pricing/page.tsx",
    "src/app/industries/page.tsx",
    "src/app/services/[slug]/page.tsx",
    "src/app/industries/[slug]/page.tsx",
  ];

  for (const file of corePageFiles) {
    const { estimatedWords, includesDeepSeo } = await estimatePageWordCount(file, deepSeoBonusWords);
    const minimum = includesDeepSeo ? 2000 : 2500;
    const maximum = includesDeepSeo ? 3800 : 3500;

    if (estimatedWords < minimum || estimatedWords > maximum) {
      fail(`${file} must estimate ${minimum}-${maximum} words. Estimated: ${estimatedWords}.`);
    }

    if (includesDeepSeo && estimatedWords < 2500) {
      warn(`${file} is below 2500 estimated words but includes DeepSeoContent; review copy depth before production.`);
    }

    const source = await readFile(path.join(process.cwd(), file), "utf8");
    const h1Count = (source.match(/<h1\b/g) || []).length;
    if (h1Count !== 1) {
      fail(`${file} must contain exactly one H1. Found ${h1Count}.`);
    }
  }

  console.info(`[content-validator] OK (blogs=${blogPosts.length}, industries=${industries.length})`);
}

void main();
