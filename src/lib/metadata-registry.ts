import { blogPosts } from "@/content/blog/posts";
import { caseStudies, industries, services } from "@/data";

export type RouteMetadataEntry = {
  path: string;
  title: string;
  description: string;
  image?: string;
};

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function toTitle(label: string) {
  const suffix = " | Digital Business Assets";
  const cleaned = normalizeSpaces(label);
  const maxLabelLength = 60 - suffix.length;
  const short = cleaned.length > maxLabelLength ? `${cleaned.slice(0, maxLabelLength - 1).trim()}…` : cleaned;
  return `${short}${suffix}`;
}

function toDescription(base: string, path: string) {
  let value = normalizeSpaces(base);

  if (value.length > 160) {
    value = `${value.slice(0, 157).trimEnd()}...`;
  }

  if (value.length < 160) {
    const filler = ` UK SMEs ${path.replace(/\//g, " ").replace(/-/g, " ").trim()} conversion system.`;
    while (value.length < 160) {
      value = `${value}${filler}`;
    }
  }

  return value.slice(0, 160);
}

const staticRoutes: RouteMetadataEntry[] = [
  {
    path: "/",
    title: toTitle("AI Revenue Systems From £99/Month"),
    description: toDescription(
      "AI-first business systems for UK SMEs: websites, SEO/AEO, chatbots, automation, CRM, booking, and reporting with measurable growth from £99/month.",
      "/",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/services",
    title: toTitle("AI Revenue Services for UK SMEs"),
    description: toDescription(
      "Explore done-for-you service modules covering website launches, SEO/AEO visibility, chatbot sales flows, CRM automation, booking systems, and KPI dashboards.",
      "/services",
    ),
    image: "/media/services-web.jpg",
  },
  {
    path: "/industries",
    title: toTitle("Industry Growth Systems"),
    description: toDescription(
      "Industry-specific growth systems for trades, clinics, gyms, dentists, law firms, real estate, ecommerce, and local services with measurable conversion outcomes.",
      "/industries",
    ),
    image: "/media/industries.jpg",
  },
  {
    path: "/pricing",
    title: toTitle("Pricing Plans From £99/Month"),
    description: toDescription(
      "Compare starter, growth, and scale plans for AI revenue systems, including websites, automation, chatbot workflows, CRM implementation, and reporting support.",
      "/pricing",
    ),
    image: "/media/services-automation.jpg",
  },
  {
    path: "/case-studies",
    title: toTitle("Case Studies and Revenue Outcomes"),
    description: toDescription(
      "See before-and-after case studies showing how UK SMEs improved response speed, booking conversion, and recurring revenue through deployed AI growth systems.",
      "/case-studies",
    ),
    image: "/media/case-1.jpg",
  },
  {
    path: "/about",
    title: toTitle("About Digital Business Assets"),
    description: toDescription(
      "Learn how Digital Business Assets designs and deploys AI-first revenue systems for UK SMEs, combining website conversion, automation, CRM, and reporting.",
      "/about",
    ),
    image: "/media/hero-ai.jpg",
  },
  {
    path: "/contact",
    title: toTitle("Contact Our Growth Team"),
    description: toDescription(
      "Contact Digital Business Assets to map your growth bottlenecks, receive a practical implementation plan, and launch conversion systems with measurable ROI.",
      "/contact",
    ),
    image: "/media/hero-ai.jpg",
  },
  {
    path: "/book",
    title: toTitle("Book a Strategy Call"),
    description: toDescription(
      "Book a 30-minute strategy call with Digital Business Assets to review your funnel leaks, automation gaps, and next sprint for measurable revenue growth.",
      "/book",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/book/confirmation",
    title: toTitle("Booking Confirmation"),
    description: toDescription(
      "Your strategy session is confirmed. Review your slot details and get ready to map your 30-day AI revenue system implementation roadmap.",
      "/book/confirmation",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/growth-simulator",
    title: toTitle("AI Growth Simulator Tool"),
    description: toDescription(
      "Run your numbers through our AI Growth Simulator to diagnose funnel leaks, estimate revenue lift ranges, and identify the highest-impact service pack.",
      "/growth-simulator",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/blog",
    title: toTitle("AI Revenue Blog for UK SMEs"),
    description: toDescription(
      "Read practical playbooks on websites, SEO/AEO, automation, chatbots, CRM, and industry growth systems designed for UK SME owners and operators.",
      "/blog",
    ),
    image: "/media/blog-cover-placeholder.jpg",
  },
  {
    path: "/privacy",
    title: toTitle("Privacy Policy"),
    description: toDescription(
      "Read how Digital Business Assets processes personal data, enquiry details, and analytics information in line with UK privacy and compliance standards.",
      "/privacy",
    ),
  },
  {
    path: "/terms",
    title: toTitle("Terms and Conditions"),
    description: toDescription(
      "Review the terms governing service delivery, payment, usage, and responsibilities when working with Digital Business Assets on AI growth systems.",
      "/terms",
    ),
  },
  {
    path: "/cookies",
    title: toTitle("Cookies Policy"),
    description: toDescription(
      "Understand how cookies are used for analytics, performance, and conversion measurement across Digital Business Assets websites and service platforms.",
      "/cookies",
    ),
  },
];

const serviceRoutes: RouteMetadataEntry[] = services.map((service) => ({
  path: `/services/${service.slug}`,
  title: toTitle(`${service.title} Service`),
  description: toDescription(
    `${service.title} for UK SMEs: ${service.shortDescription} Includes implementation, optimisation, and measurable KPI tracking from lead to booking.`,
    `/services/${service.slug}`,
  ),
  image: service.image,
}));

const industryRoutes: RouteMetadataEntry[] = industries.map((industry) => ({
  path: `/industries/${industry.slug}`,
  title: toTitle(`${industry.name} Growth Systems`),
  description: toDescription(
    `${industry.name} revenue systems for UK businesses: fix response speed, lead qualification, booking workflows, and reporting visibility with industry-fit automations.`,
    `/industries/${industry.slug}`,
  ),
  image: industry.coverImage,
}));

const caseStudyRoutes: RouteMetadataEntry[] = caseStudies.map((caseStudy) => ({
  path: `/case-studies/${caseStudy.slug}`,
  title: toTitle(caseStudy.title),
  description: toDescription(
    `Case study: ${caseStudy.clientSector} implementation showing funnel problems, deployed systems, and measurable improvements in bookings, response time, and revenue.`,
    `/case-studies/${caseStudy.slug}`,
  ),
  image: caseStudy.coverImage,
}));

const blogRoutes: RouteMetadataEntry[] = blogPosts.map((post) => ({
  path: `/blog/${post.slug}`,
  title: toTitle(post.title),
  description: toDescription(
    `${post.title} practical guide for UK SMEs covering execution steps, KPI targets, automation leverage, and conversion improvements linked to services and booking workflow.`,
    `/blog/${post.slug}`,
  ),
  image: post.coverImage,
}));

export const metadataRegistry: RouteMetadataEntry[] = [
  ...staticRoutes,
  ...serviceRoutes,
  ...industryRoutes,
  ...caseStudyRoutes,
  ...blogRoutes,
];

const metadataMap = new Map(metadataRegistry.map((entry) => [entry.path, entry]));

export function getRouteMetadata(path: string, fallback?: Partial<RouteMetadataEntry>) {
  const entry = metadataMap.get(path);
  if (entry) {
    return entry;
  }

  const title = fallback?.title || toTitle("Digital Business Assets");
  const description = toDescription(
    fallback?.description || "AI-first revenue systems for UK SMEs with implementation-first service delivery.",
    path,
  );

  return {
    path,
    title,
    description,
    image: fallback?.image || "/media/hero-ai.jpg",
  } satisfies RouteMetadataEntry;
}
