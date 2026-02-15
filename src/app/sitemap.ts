import type { MetadataRoute } from "next";

import { blogPosts, caseStudies, industries, services } from "@/data";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "/",
  "/about",
  "/services",
  "/tools",
  "/tools/website-audit",
  "/tools/website-audit/start",
  "/tools/website-audit/results",
  "/website-growth-audit-free",
  "/check-website-performance-free",
  "/free-website-audit-for-small-business",
  "/free-seo-and-conversion-audit",
  "/website-health-check-free",
  "/instant-website-audit-report",
  "/pricing",
  "/login",
  "/signup",
  "/bespoke-plan",
  "/thanks",
  "/app",
  "/app/reports",
  "/app/leads",
  "/app/employees",
  "/app/simulator",
  "/app/settings",
  "/contact",
  "/book",
  "/case-studies",
  "/industries",
  "/growth-simulator",
  "/playground",
  "/blog",
  "/privacy",
  "/terms",
  "/cookies",
] as const;

function toEntry(path: string, priority = 0.6): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => toEntry(route, route === "/" ? 1 : route === "/pricing" ? 0.9 : 0.7)),
    ...services.map((service) => toEntry(`/services/${service.slug}`, 0.72)),
    ...industries.map((industry) => toEntry(`/industries/${industry.slug}`, 0.68)),
    ...caseStudies.map((caseStudy) => toEntry(`/case-studies/${caseStudy.slug}`, 0.66)),
    ...blogPosts.map((post) => toEntry(`/blog/${post.slug}`, 0.64)),
  ];
}
