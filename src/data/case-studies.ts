import type { CaseStudy } from "@/types/content";

export const caseStudies: CaseStudy[] = [
  {
    slug: "roofing-co-fast-launch",
    title: "From missed calls to fully booked surveys in 30 days",
    clientName: "Northern Shield Roofing",
    clientSector: "Trades",
    location: "Manchester",
    coverImage: "/media/case-1.jpg",
    snapshot:
      "A roofing company needed a premium website and missed-call recovery before storm-season demand.",
    challenge:
      "Most inbound calls were missed while teams were onsite, and follow-up happened too late to win urgent jobs.",
    approach: [
      "Launched a conversion-focused website in 72 hours.",
      "Implemented missed-call text-back + call qualification workflow.",
      "Connected enquiries to CRM stages with automated quote reminders.",
    ],
    outcomes: [
      { label: "Missed calls recovered", value: "87%" },
      { label: "Survey bookings", value: "+47%" },
      { label: "Avg. response time", value: "Under 2 min" },
    ],
    testimonial: {
      quote:
        "We stopped losing urgent jobs. The system now follows up faster than any manual process we had before.",
      author: "Daniel F.",
      role: "Managing Director",
    },
    serviceSlugs: [
      "websites-in-72-hours",
      "missed-call-recovery",
      "crm-pipelines",
      "automations-workflows",
    ],
    industrySlugs: ["trades-home-services", "local-services"],
  },
  {
    slug: "dental-clinic-rebrand",
    title: "Premium treatment funnel that reduced no-shows by 41%",
    clientName: "Smilepoint Dental",
    clientSector: "Dentists",
    location: "Birmingham",
    coverImage: "/media/case-2.jpg",
    snapshot:
      "A clinic needed stronger trust signals and a better booking flow for high-value treatments.",
    challenge:
      "The old site looked dated, consult bookings were inconsistent, and no-show rates were hurting capacity.",
    approach: [
      "Rebuilt website positioning around treatment outcomes.",
      "Implemented booking flow with reminders and reschedule logic.",
      "Set up CRM stages from enquiry to accepted treatment plan.",
    ],
    outcomes: [
      { label: "Consultation no-shows", value: "Down 41%" },
      { label: "Treatment acceptance", value: "+22%" },
      { label: "Form-to-booking conversion", value: "+33%" },
    ],
    testimonial: {
      quote:
        "The pipeline is finally structured. Our team has clarity and we now see exactly where growth comes from.",
      author: "Dr. Priya N.",
      role: "Clinic Owner",
    },
    serviceSlugs: [
      "websites-in-72-hours",
      "booking-systems-reminders",
      "crm-pipelines",
      "reporting-dashboards",
    ],
    industrySlugs: ["dental-clinics", "health-wellness-clinics"],
  },
  {
    slug: "estate-agency-chatbot",
    title: "AI assistant qualified valuation leads 24/7",
    clientName: "Westbridge Estates",
    clientSector: "Real Estate",
    location: "Leeds",
    coverImage: "/media/case-3.jpg",
    snapshot:
      "An estate agency wanted to qualify landlord leads outside office hours and book valuation calls faster.",
    challenge:
      "Most valuation enquiries happened evenings and weekends, then cooled before manual callback.",
    approach: [
      "Deployed an AI assistant for valuation qualification.",
      "Connected bot outcomes to CRM and booking flow.",
      "Added high-intent alerts and reporting dashboard.",
    ],
    outcomes: [
      { label: "Out-of-hours qualified leads", value: "+58%" },
      { label: "Valuation bookings", value: "+29%" },
      { label: "Average first response", value: "Instant" },
    ],
    testimonial: {
      quote:
        "Lead quality improved fast. Our negotiators now spend time on serious opportunities instead of chasing noise.",
      author: "Charlotte M.",
      role: "Branch Director",
    },
    serviceSlugs: [
      "ai-chatbots",
      "automations-workflows",
      "crm-pipelines",
      "reporting-dashboards",
    ],
    industrySlugs: ["estate-agents", "legal-services"],
  },
  {
    slug: "physio-practice-local-seo",
    title: "SEO + AEO engine that increased organic bookings",
    clientName: "Core Motion Physio",
    clientSector: "Clinics",
    location: "Bristol",
    coverImage: "/media/case-2.jpg",
    snapshot:
      "A physiotherapy clinic needed better local visibility and clearer conversion flow from search.",
    challenge:
      "Location pages were weak, treatment intent content was thin, and there was no clear attribution to bookings.",
    approach: [
      "Implemented technical SEO and location architecture.",
      "Built AEO-ready content clusters for core treatments.",
      "Deployed booking attribution dashboard.",
    ],
    outcomes: [
      { label: "Organic traffic", value: "+64%" },
      { label: "Top-3 local rankings", value: "18 terms" },
      { label: "Organic bookings", value: "+37%" },
    ],
    testimonial: {
      quote:
        "We now show up for the right searches and can prove how those visits turn into consultations.",
      author: "Tom W.",
      role: "Practice Manager",
    },
    serviceSlugs: ["seo-aeo", "booking-systems-reminders", "reporting-dashboards"],
    industrySlugs: ["health-wellness-clinics"],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
