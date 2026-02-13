import type { BlogPost } from "@/types/content";

type ClusterConfig = {
  key: string;
  label: string;
  serviceLink: string;
  industryLink: string;
  simulatorAngle: string;
  topics: string[];
  infographic: string;
};

const clusters: ClusterConfig[] = [
  {
    key: "websites",
    label: "Websites",
    serviceLink: "/services/websites-in-72-hours",
    industryLink: "/industries/local-services",
    simulatorAngle: "conversion-first website architecture",
    infographic: "/media/infographic-websites.svg",
    topics: [
      "Homepage Structures That Convert SME Traffic",
      "Service Page Frameworks for Local Intent",
      "72-Hour Website Launch Execution Checklist",
      "Landing Page Patterns for Quote Requests",
      "Trust Blocks That Increase Contact Rates",
      "Navigation Systems That Reduce Drop-Off",
      "Offer Messaging for UK Service Businesses",
      "Call-To-Action Design That Wins More Enquiries",
      "Mobile UX Fixes That Lift Form Completion",
      "Website QA Standards Before Paid Traffic",
    ],
  },
  {
    key: "seo-aeo",
    label: "SEO & AEO",
    serviceLink: "/services/seo-aeo",
    industryLink: "/industries/health-wellness-clinics",
    simulatorAngle: "search and AI answer visibility",
    infographic: "/media/infographic-seo-aeo.svg",
    topics: [
      "Local SEO Architecture for Multi-Service SMEs",
      "AEO Content Blocks for AI Answer Visibility",
      "Internal Linking Blueprints for Service Clusters",
      "Topic Clusters That Generate Qualified Traffic",
      "Schema Layers for Service Pages and FAQs",
      "Technical SEO Baseline for Lead Generation Sites",
      "Search Intent Mapping for Conversion Journeys",
      "How to Rank Treatment and Procedure Pages",
      "Citation and Authority Workflows for UK Markets",
      "Monthly SEO Review Cadence for Owners",
    ],
  },
  {
    key: "automation-crm",
    label: "Automation & CRM",
    serviceLink: "/services/automations-workflows",
    industryLink: "/industries/trades-home-services",
    simulatorAngle: "pipeline automation and follow-up speed",
    infographic: "/media/infographic-automation-crm.svg",
    topics: [
      "CRM Stage Design for Small Sales Teams",
      "Lead Routing Rules That Protect Response Time",
      "Follow-Up Sequencing for Unbooked Enquiries",
      "No-Show Reduction Through Reminder Workflows",
      "Pipeline Hygiene Metrics Owners Must Track",
      "Webhook-First Automation Patterns for Reliability",
      "Task Escalation Rules That Prevent Lead Loss",
      "Revenue Attribution From Source to Closed Deal",
      "Operational Dashboards for Weekly Decision Making",
      "Automation QA Checklist Before Going Live",
    ],
  },
  {
    key: "chatbots-ai-receptionist",
    label: "Chatbots & AI Receptionist",
    serviceLink: "/services/ai-chatbots",
    industryLink: "/industries/estate-agents",
    simulatorAngle: "24/7 AI-assisted lead capture",
    infographic: "/media/infographic-chatbots.svg",
    topics: [
      "AI Receptionist Scripts for Service Enquiries",
      "Chat Qualification Trees for High-Intent Leads",
      "Out-of-Hours Lead Recovery With Conversational AI",
      "Handoff Logic From Bot to Human Team Members",
      "Prompt Guardrails for Commercial Accuracy",
      "Chatbot KPIs That Matter to Business Owners",
      "WhatsApp and Web Chat Synchronisation Patterns",
      "Objection Handling Flows for Quote Conversations",
      "Bot Training Data Models for SME Offers",
      "Conversation Audit Framework for Weekly Optimisation",
    ],
  },
  {
    key: "playbooks",
    label: "Case Studies & Playbooks",
    serviceLink: "/case-studies",
    industryLink: "/industries/local-services",
    simulatorAngle: "industry-specific deployment playbooks",
    infographic: "/media/infographic-playbooks.svg",
    topics: [
      "Trades Growth System Playbook in 30 Days",
      "Clinic Booking Funnel Upgrade Playbook",
      "Gym Lead Nurture and Membership Automation Guide",
      "Dental No-Show Recovery System Breakdown",
      "Law Firm Intake Optimisation Roadmap",
      "Estate Agency Out-of-Hours Conversion Playbook",
      "Ecommerce Service Layer Playbook for High-Ticket",
      "Local Services Response-Time Sprint Playbook",
      "Revenue Dashboard Rollout for Owner-Led Teams",
      "Scaling from £99 Plan to Full Growth Stack",
    ],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function buildSectionBody(topic: string, cluster: ClusterConfig, sectionHeading: string) {
  const paragraphs = [
    `Business owners usually hit the same wall with ${topic.toLowerCase()}: effort increases, but growth stalls because the funnel leaks at several points. Leads arrive from search, referrals, social, and paid channels, yet response speed varies by day, qualification standards drift, and follow-up depends on memory. That means high-intent enquiries cool down while faster competitors take the sale.`,
    `The fix is not another random tactic. The fix is a system. We treat ${sectionHeading.toLowerCase()} as an operating workflow with ownership rules, timing thresholds, and escalation triggers your team can follow under pressure. We map where demand enters, how leads are tagged, how quickly they are contacted, and what happens when a response is delayed. Then we install automation, reminders, and reporting so execution stays consistent during busy periods.`,
    `Execution decides outcomes. Start with [the matching service module](${cluster.serviceLink}), benchmark bottlenecks in [the growth simulator](/growth-simulator), and compare deployment patterns on [your industry page](${cluster.industryLink}). If you want guided rollout, use [the booking page](/book) and we will map a practical 30-day sequence tied to commercial impact. The goal is simple: faster response, better booking quality, and clear visibility from lead to revenue.`,
  ];

  return paragraphs.join(" ");
}

function buildSections(topic: string, cluster: ClusterConfig) {
  const sectionHeadings = [
    "Commercial Context",
    "Funnel Leak Diagnosis",
    "System Architecture",
    "Implementation Sequence",
    "Operator Workflow",
    "Measurement Framework",
    "Risk Controls",
    "Optimisation Cycle",
    "30-Day Execution Blueprint",
  ];

  return sectionHeadings.map((heading) => ({
    heading,
    body: buildSectionBody(topic, cluster, heading),
    bullets: [
      `Align ${cluster.simulatorAngle} with lead quality goals`,
      "Set response-time thresholds and escalation conditions",
      "Track conversion from first enquiry to confirmed booking",
      "Review outcomes weekly and adjust scripts, flows, and offers",
      "Keep internal links between services, industries, and case studies active",
    ],
  }));
}

const launchAuthor = "Digital Business Assets Team";

const publishedBase = new Date("2026-01-02T09:00:00.000Z");

function buildPost(cluster: ClusterConfig, topic: string, index: number): BlogPost {
  const slug = slugify(`${cluster.key}-${topic}`);
  const sections = buildSections(topic, cluster);
  const publishedAt = new Date(publishedBase.getTime() + index * 86400000).toISOString();
  const imageIndex = String(index + 1).padStart(2, "0");

  return {
    slug,
    title: topic,
    excerpt:
      "A practical, conversion-first guide for UK SMEs that want measurable growth from websites, automation, and AI workflow systems.",
    coverImage: `/media/blog/${cluster.key}-${imageIndex}.svg`,
    author: launchAuthor,
    publishedAt,
    readTime: "12 min read",
    tags: [cluster.label, "AI Revenue System", "SME Growth", topic.split(" ")[0] || "Playbook"],
    cluster: cluster.label,
    infographicImage: cluster.infographic,
    summary:
      "This guide breaks down operational bottlenecks, implementation steps, and KPI tracking so owners can move from ad-hoc marketing to reliable revenue systems.",
    sections,
    ctaBlocks: [
      {
        headline: "Need this implemented, not just planned?",
        body: "We can deploy the same framework with your offers, tools, and team workflow so results are measurable from week one.",
        primaryLabel: "Get Your Growth Plan",
        primaryHref: "/growth-simulator",
        secondaryLabel: "Book Strategy Call",
        secondaryHref: "/book",
      },
      {
        headline: "Model your potential upside first",
        body: "Run your current numbers through the simulator, then use the output to prioritise your next 30-day implementation sprint.",
        primaryLabel: "Open Growth Simulator",
        primaryHref: "/growth-simulator",
        secondaryLabel: "Explore Services",
        secondaryHref: cluster.serviceLink,
      },
    ],
    primaryServiceLink: cluster.serviceLink,
  };
}

const generatedPosts = clusters.flatMap((cluster) =>
  cluster.topics.map((topic, index) => buildPost(cluster, topic, index)),
);

export const blogPosts: BlogPost[] = generatedPosts;

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  return blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => {
      const aSharedTags = a.tags.filter((tag) => post.tags.includes(tag)).length;
      const bSharedTags = b.tags.filter((tag) => post.tags.includes(tag)).length;
      const aScore = (a.cluster === post.cluster ? 5 : 0) + aSharedTags;
      const bScore = (b.cluster === post.cluster ? 5 : 0) + bSharedTags;

      if (bScore !== aScore) {
        return bScore - aScore;
      }

      return b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}
