import type { Industry } from "@/types/content";

export const industries: Industry[] = [
  {
    slug: "trades-home-services",
    name: "Trades & Home Services",
    audience: "Roofers, electricians, plumbers, heating engineers, builders",
    coverImage: "/industry-trades.jpg",
    summary:
      "Capture urgent enquiries, quote faster, and keep jobs flowing with fewer admin bottlenecks.",
    challenges: [
      "Missed calls while teams are onsite",
      "Slow quote follow-up and low diary visibility",
      "Inconsistent lead quality from ads and referrals",
    ],
    opportunities: [
      "24/7 lead capture for urgent callouts",
      "Automated quote reminders and booking confirmations",
      "Area-based landing pages for local demand",
    ],
    recommendedServiceSlugs: [
      "websites-in-72-hours",
      "automations-workflows",
      "24-7-call-answering",
    ],
    caseStudySlugs: ["roofing-co-fast-launch"],
  },
  {
    slug: "dental-clinics",
    name: "Dental Clinics",
    audience: "Private dental practices and specialist clinics",
    coverImage: "/industry-dental.jpg",
    summary:
      "Increase high-value treatment enquiries and reduce no-shows with stronger booking systems.",
    challenges: [
      "No-show consultations reduce chair utilisation",
      "Generic websites fail to build treatment trust",
      "Lead handover between front desk and clinicians is messy",
    ],
    opportunities: [
      "Treatment-focused landing pages with trust signals",
      "Automated reminders and pre-consult qualification",
      "Pipeline reporting from enquiry to treatment acceptance",
    ],
    recommendedServiceSlugs: ["websites-in-72-hours", "crm-booking-reminders"],
    caseStudySlugs: ["dental-clinic-rebrand"],
  },
  {
    slug: "estate-agents",
    name: "Estate Agents",
    audience: "Independent estate and letting agencies",
    coverImage: "/industry-estate.jpg",
    summary:
      "Qualify landlord and buyer intent quickly, then route opportunities to the right negotiator.",
    challenges: [
      "Out-of-hours leads disappear before callback",
      "Poor lead qualification for valuations",
      "Manual admin across property portals and CRM",
    ],
    opportunities: [
      "AI chat for instant landlord qualification",
      "Automated valuations and booking sequences",
      "Pipeline workflows tied to branch performance KPIs",
    ],
    recommendedServiceSlugs: [
      "ai-chatbots",
      "automations-workflows",
      "24-7-call-answering",
    ],
    caseStudySlugs: ["estate-agency-chatbot"],
  },
  {
    slug: "health-wellness-clinics",
    name: "Health & Wellness Clinics",
    audience: "Physio, osteopathy, sports therapy, wellbeing clinics",
    coverImage: "/industry-health.jpg",
    summary:
      "Improve local visibility, streamline patient bookings, and reduce admin overhead in patient journeys.",
    challenges: [
      "Weak local search visibility",
      "No clear patient journey from enquiry to treatment",
      "Manual reminders and poor attendance rates",
    ],
    opportunities: [
      "SEO + AEO for treatment-intent keywords",
      "Integrated booking and reminder automation",
      "Lifecycle campaigns for returning patients",
    ],
    recommendedServiceSlugs: ["seo-aeo", "crm-booking-reminders"],
    caseStudySlugs: ["physio-practice-local-seo", "dental-clinic-rebrand"],
  },
  {
    slug: "legal-services",
    name: "Legal Services",
    audience: "Local law firms and specialist legal consultants",
    coverImage: "/industry-legal.jpg",
    summary:
      "Generate more qualified consultations with clearer offer positioning and faster intake workflows.",
    challenges: [
      "High enquiry volume with low qualification",
      "Slow intake creates drop-off before consultation",
      "Practice areas are not discoverable in search",
    ],
    opportunities: [
      "Practice-area landing pages for high-intent queries",
      "AI-assisted pre-qualification before call booking",
      "Workflow automation for intake and follow-up",
    ],
    recommendedServiceSlugs: [
      "seo-aeo",
      "ai-chatbots",
      "automations-workflows",
    ],
    caseStudySlugs: ["estate-agency-chatbot", "physio-practice-local-seo"],
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
