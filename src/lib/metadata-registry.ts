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
    title: toTitle("Business OS for UK SMEs"),
    description: toDescription(
      "Business OS for UK SMEs: choose Get Online in 72 hours or run a Free Website Scan, then deploy conversion modules with transparent pricing and measurable growth.",
      "/",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/services",
    title: toTitle("Business OS Service Modules"),
    description: toDescription(
      "Explore Business OS installs from £399 to £599 including websites, CRM, follow-up automation, booking systems, missed-call capture, SEO upgrades, and chatbot setup.",
      "/services",
    ),
    image: "/media/services-web.jpg",
  },
  {
    path: "/tools",
    title: toTitle("Business Growth Tools"),
    description: toDescription(
      "Use free growth tools for UK businesses: website scan workflow, branded reports, and simulator-led planning to prioritise fixes before committing to paid module installs.",
      "/tools",
    ),
    image: "/media/dashboard-1.jpg",
  },
  {
    path: "/tools/website-audit",
    title: toTitle("Free Website Scan Tool"),
    description: toDescription(
      "Run a free website scan for technical, speed, and conversion issues, then download a branded PDF report with fix-now priorities and transparent Business OS upgrade options.",
      "/tools/website-audit",
    ),
    image: "/media/dashboard-1.jpg",
  },
  {
    path: "/tools/website-audit/start",
    title: toTitle("Start Free Website Scan"),
    description: toDescription(
      "Start your free website scan with required lead capture fields and optional email, then track live progress, review diagnostics, and download your branded report dashboard.",
      "/tools/website-audit/start",
    ),
    image: "/media/dashboard-call-recovery.svg",
  },
  {
    path: "/growth-simulator",
    title: toTitle("AI Growth Simulator Tool"),
    description: toDescription(
      "Model industry-adjusted growth scenarios with lead, conversion, and response inputs, then export recommendations and route into booking with prefilled business context.",
      "/growth-simulator",
    ),
    image: "/media/simulator-preview.svg",
  },
  {
    path: "/industries",
    title: toTitle("Industry Growth Systems"),
    description: toDescription(
      "Industry-specific Business OS modules for restaurants, real estate, medical, retail, beauty, aviation, and other UK sectors that need faster lead response and conversion.",
      "/industries",
    ),
    image: "/media/industries.jpg",
  },
  {
    path: "/case-studies",
    title: toTitle("Case Studies and Outcomes"),
    description: toDescription(
      "Read UK case studies showing how Business OS installs improved response speed, booking rates, and recovered revenue with practical deployment timelines and clear proof metrics.",
      "/case-studies",
    ),
    image: "/media/case-1.jpg",
  },
  {
    path: "/pricing",
    title: toTitle("Business OS Pricing"),
    description: toDescription(
      "Compare Business OS tiers: Starter £79, Growth £355, and Scale £499 monthly, with transparent module installs and clear limits for UK business growth operations.",
      "/pricing",
    ),
    image: "/media/services-automation.jpg",
  },
  {
    path: "/bespoke-plan",
    title: toTitle("Create Bespoke Growth Plan"),
    description: toDescription(
      "Create your bespoke growth plan by sharing your business stage, goals, and blockers, then get routed to Track 1 or Track 2 with clear next deployment actions.",
      "/bespoke-plan",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/signup",
    title: toTitle("Sign Up to Business OS"),
    description: toDescription(
      "Create your Business OS account, choose a plan tier, and unlock dashboard access for reports, leads, and deployment workflows built for UK SME growth operations.",
      "/signup",
    ),
    image: "/media/dashboard-2.jpg",
  },
  {
    path: "/login",
    title: toTitle("Login to Business OS"),
    description: toDescription(
      "Log in to Business OS to review scan reports, monitor captured leads, and execute your next growth steps with track-aware recommendations and clear module priorities.",
      "/login",
    ),
    image: "/media/dashboard-2.jpg",
  },
  {
    path: "/thanks",
    title: toTitle("Bespoke Plan Submitted"),
    description: toDescription(
      "Your bespoke plan request has been submitted. Continue to your recommended track, run diagnostics, or book a strategy call to finalise your Business OS rollout plan.",
      "/thanks",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/about",
    title: toTitle("About Business OS Team"),
    description: toDescription(
      "Learn how Digital Business Assets builds Business OS systems for UK SMEs by combining fast website launches, free diagnostics, automation modules, and measurable growth routines.",
      "/about",
    ),
    image: "/media/hero-ai.jpg",
  },
  {
    path: "/contact",
    title: toTitle("Contact Digital Business Assets"),
    description: toDescription(
      "Contact the Business OS team for implementation support, module recommendations, and growth planning help tailored to your industry, lead flow, and operating constraints.",
      "/contact",
    ),
    image: "/media/hero-ai.jpg",
  },
  {
    path: "/book",
    title: toTitle("Book Business OS Strategy Call"),
    description: toDescription(
      "Book a strategy call to map your bottlenecks, confirm timeline, and choose Business OS modules with transparent pricing, realistic outcomes, and deployment sequencing.",
      "/book",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/book/confirmation",
    title: toTitle("Booking Confirmation"),
    description: toDescription(
      "Your strategy call is confirmed. Review your selected slot and submitted context so implementation planning can start quickly with clear priorities and measurable goals.",
      "/book/confirmation",
    ),
    image: "/media/hero-dashboard.jpg",
  },
  {
    path: "/website-audit",
    title: toTitle("Website Audit Redirect"),
    description: toDescription(
      "Legacy website audit path now routes to the Business OS tools flow where users can start free scans, generate reports, and choose paid upgrades in one system.",
      "/website-audit",
    ),
    image: "/media/dashboard-1.jpg",
  },
  {
    path: "/app",
    title: toTitle("Business OS Dashboard"),
    description: toDescription(
      "Business OS dashboard overview for reports, leads, AI employees, and simulator operations in one interface designed for ongoing growth execution and accountability.",
      "/app",
    ),
    image: "/media/dashboard-2.jpg",
  },
  {
    path: "/app/reports",
    title: toTitle("Business OS Reports"),
    description: toDescription(
      "Open scan report library, review statuses, and jump to website audit results dashboards to prioritise fixes and convert findings into paid deployment actions.",
      "/app/reports",
    ),
    image: "/media/dashboard-1.jpg",
  },
  {
    path: "/app/leads",
    title: toTitle("Business OS Leads"),
    description: toDescription(
      "View captured leads from free scan funnels with contact details, reasons, and website context so your team can move opportunities into the next conversion stage.",
      "/app/leads",
    ),
    image: "/media/dashboard-2.jpg",
  },
  {
    path: "/app/employees",
    title: toTitle("Business OS AI Employees"),
    description: toDescription(
      "Review deployable AI employee modules for reception, follow-up, call recovery, and search support to expand Business OS capability without adding headcount.",
      "/app/employees",
    ),
    image: "/media/dashboard-3.jpg",
  },
  {
    path: "/app/simulator",
    title: toTitle("Business OS Simulator"),
    description: toDescription(
      "Use the simulator inside Business OS to model growth scenarios, export recommendations, and route planning outputs into booking with prefilled context details.",
      "/app/simulator",
    ),
    image: "/media/simulator-preview.svg",
  },
  {
    path: "/app/settings",
    title: toTitle("Business OS Settings"),
    description: toDescription(
      "Configure Business OS operational settings for webhooks, report templates, lead routing defaults, and environment controls that support reliable long-term growth execution.",
      "/app/settings",
    ),
    image: "/media/dashboard-3.jpg",
  },
  {
    path: "/admin/bookings",
    title: toTitle("Bookings Admin Dashboard"),
    description: toDescription(
      "Protected admin area for viewing and exporting booked strategy sessions, including slot details and lead context captured from growth workflows.",
      "/admin/bookings",
    ),
    image: "/media/dashboard-2.jpg",
  },
  {
    path: "/blog",
    title: toTitle("AI Revenue Blog for UK SMEs"),
    description: toDescription(
      "Read practical playbooks on websites, SEO, automation, chatbots, CRM, and industry growth systems designed for UK SME owners and operators.",
      "/blog",
    ),
    image: "/media/blog/websites-01.svg",
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
    `${industry.name} Business OS for UK businesses: fix visibility, response speed, missed leads, and booking conversion with tailored modules and practical deployment support.`,
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
