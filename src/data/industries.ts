import type { Industry } from "@/types/content";

export const industries: Industry[] = [
  {
    slug: "trades-home-services",
    name: "Trades",
    audience: "Roofers, plumbers, electricians, installers",
    coverImage: "/media/industries.jpg",
    summary: "Recover missed calls, quote faster, and fill calendars with qualified local demand.",
    challenges: [
      "Missed calls while teams are onsite",
      "Slow quote follow-up and low diary visibility",
      "No structured lead pipeline",
    ],
    opportunities: [
      "Missed-call text-back and urgent routing",
      "Automated quote and booking reminders",
      "Area landing pages for local lead capture",
    ],
    recommendedServiceSlugs: [
      "websites-in-72-hours",
      "missed-call-recovery",
      "automations-workflows",
      "reporting-dashboards",
    ],
    caseStudySlugs: ["roofing-co-fast-launch"],
  },
  {
    slug: "health-wellness-clinics",
    name: "Clinics",
    audience: "Physio, osteopathy, wellness clinics",
    coverImage: "/media/industries.jpg",
    summary: "Increase treatment bookings with better search visibility and no-show reduction systems.",
    challenges: [
      "Weak local discoverability",
      "Manual reminders and attendance issues",
      "No patient journey visibility",
    ],
    opportunities: [
      "SEO/AEO treatment content clusters",
      "Booking system + reminder automation",
      "Lifecycle follow-up campaigns",
    ],
    recommendedServiceSlugs: ["seo-aeo", "booking-systems-reminders", "crm-pipelines"],
    caseStudySlugs: ["physio-practice-local-seo"],
  },
  {
    slug: "gyms-fitness",
    name: "Gyms",
    audience: "Gyms, PT studios, fitness brands",
    coverImage: "/media/industries.jpg",
    summary: "Convert trial enquiries faster and automate follow-up for memberships and classes.",
    challenges: [
      "Leads drop after first enquiry",
      "Class bookings and reminders are manual",
      "No conversion tracking by campaign",
    ],
    opportunities: [
      "AI assistants for enquiry qualification",
      "Booking and attendance automations",
      "Membership funnel reporting",
    ],
    recommendedServiceSlugs: ["ai-chatbots", "booking-systems-reminders", "reporting-dashboards"],
    caseStudySlugs: ["estate-agency-chatbot"],
  },
  {
    slug: "dental-clinics",
    name: "Dentists",
    audience: "Private dental and specialist clinics",
    coverImage: "/media/industries.jpg",
    summary: "Improve treatment acceptance and reduce no-shows with structured consult funnels.",
    challenges: [
      "Generic site messaging for high-value treatments",
      "Consultation no-shows",
      "Weak pipeline tracking from enquiry to treatment",
    ],
    opportunities: [
      "Conversion pages for premium procedures",
      "Automated reminders and reactivation",
      "Treatment pipeline dashboards",
    ],
    recommendedServiceSlugs: [
      "websites-in-72-hours",
      "booking-systems-reminders",
      "crm-pipelines",
    ],
    caseStudySlugs: ["dental-clinic-rebrand"],
  },
  {
    slug: "legal-services",
    name: "Law Firms",
    audience: "Solicitors, specialist legal practices",
    coverImage: "/media/industries.jpg",
    summary: "Generate qualified consult requests and speed up legal intake without admin bottlenecks.",
    challenges: [
      "High enquiry volume with low quality",
      "Intake delays before consultations",
      "Poor practice-area search presence",
    ],
    opportunities: [
      "AI pre-qualification before booking",
      "Practice-area SEO/AEO content",
      "Intake and callback workflows",
    ],
    recommendedServiceSlugs: ["seo-aeo", "ai-chatbots", "crm-pipelines"],
    caseStudySlugs: ["estate-agency-chatbot"],
  },
  {
    slug: "estate-agents",
    name: "Real Estate",
    audience: "Estate and letting agencies",
    coverImage: "/media/industries.jpg",
    summary: "Capture out-of-hours valuation demand and route opportunities to the right negotiator.",
    challenges: [
      "Out-of-hours leads are lost",
      "Poor valuation qualification",
      "Manual admin across portals and CRM",
    ],
    opportunities: [
      "AI landlord qualification",
      "Automated valuation booking flow",
      "Branch-level KPI dashboards",
    ],
    recommendedServiceSlugs: [
      "ai-chatbots",
      "automations-workflows",
      "crm-pipelines",
      "reporting-dashboards",
    ],
    caseStudySlugs: ["estate-agency-chatbot"],
  },
  {
    slug: "ecommerce-brands",
    name: "Ecom",
    audience: "D2C and ecommerce brands",
    coverImage: "/media/industries.jpg",
    summary: "Use AI and automation to improve conversion, abandoned cart recovery, and post-purchase flows.",
    challenges: [
      "High traffic with weak conversion",
      "Manual campaign reporting",
      "Disconnected lifecycle messaging",
    ],
    opportunities: [
      "AEO-friendly product content",
      "Automated lifecycle campaigns",
      "Unified revenue and channel dashboards",
    ],
    recommendedServiceSlugs: ["seo-aeo", "automations-workflows", "reporting-dashboards"],
    caseStudySlugs: ["physio-practice-local-seo"],
  },
  {
    slug: "local-services",
    name: "Local Services",
    audience: "Any local UK SME with service-led sales",
    coverImage: "/media/industries.jpg",
    summary: "Build a reliable lead-to-booking engine for consistent local growth.",
    challenges: [
      "Inconsistent lead volume",
      "Follow-up delays and missed opportunities",
      "No clear source-to-revenue tracking",
    ],
    opportunities: [
      "Conversion-first website and forms",
      "Automated follow-up and reminders",
      "Owner-level revenue reporting",
    ],
    recommendedServiceSlugs: [
      "websites-in-72-hours",
      "automations-workflows",
      "missed-call-recovery",
      "reporting-dashboards",
    ],
    caseStudySlugs: ["roofing-co-fast-launch", "dental-clinic-rebrand"],
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
