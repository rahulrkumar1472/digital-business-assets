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
      "A roofing company needed a fast online presence and reliable missed-call recovery before storm-season demand.",
    challenge:
      "Most inbound calls were missed while teams were onsite, and callbacks happened too late to win urgent jobs.",
    approach: [
      "Launched a conversion-focused website in 72 hours.",
      "Installed call tracking + missed-call capture with instant text-back.",
      "Added CRM follow-up automation for quotes and booking confirmation.",
    ],
    outcomes: [
      { label: "Missed calls recovered", value: "87%" },
      { label: "Survey bookings", value: "+47%" },
      { label: "Average response time", value: "Under 2 minutes" },
    ],
    testimonial: {
      quote:
        "We stopped losing urgent jobs. The system now follows up faster than any manual process we had before.",
      author: "Daniel F.",
      role: "Managing Director",
    },
    serviceSlugs: [
      "website-starter-build",
      "call-tracking-missed-call-capture",
      "crm-setup",
      "follow-up-automation",
    ],
    industrySlugs: ["trades-home-services", "local-services", "home-improvement"],
  },
  {
    slug: "dental-clinic-rebrand",
    title: "Premium treatment funnel that reduced no-shows by 41%",
    clientName: "Smilepoint Dental",
    clientSector: "Dentists",
    location: "Birmingham",
    coverImage: "/media/case-2.jpg",
    snapshot:
      "A clinic needed stronger trust positioning and a better booking journey for high-value treatment consultations.",
    challenge:
      "The old site looked outdated, consult booking flow was weak, and no-show rates were hurting treatment capacity.",
    approach: [
      "Rebuilt website messaging around treatment outcomes.",
      "Implemented booking and reminder workflows with reschedule logic.",
      "Configured CRM stages from enquiry to accepted treatment plan.",
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
    serviceSlugs: ["website-pro-build", "booking-system-setup", "crm-setup", "follow-up-automation"],
    industrySlugs: ["medical", "dental-clinics", "beauty"],
  },
  {
    slug: "estate-agency-chatbot",
    title: "AI assistant qualified valuation leads 24/7",
    clientName: "Westbridge Estates",
    clientSector: "Real Estate",
    location: "Leeds",
    coverImage: "/media/case-3.jpg",
    snapshot:
      "An estate agency wanted to qualify landlord leads outside office hours and speed up valuation bookings.",
    challenge:
      "Most valuation enquiries arrived evenings and weekends, then cooled before manual callback.",
    approach: [
      "Installed an AI chatbot for valuation qualification and handoff.",
      "Connected lead outcomes into CRM stages and booking flow.",
      "Added high-intent alerts and follow-up automation.",
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
    serviceSlugs: ["ai-chatbot-install", "whatsapp-business-setup", "crm-setup", "follow-up-automation"],
    industrySlugs: ["real-estate", "property-management"],
  },
  {
    slug: "physio-practice-local-seo",
    title: "SEO growth engine increased organic bookings",
    clientName: "Core Motion Physio",
    clientSector: "Medical",
    location: "Bristol",
    coverImage: "/media/case-2.jpg",
    snapshot:
      "A physiotherapy clinic needed stronger local visibility and cleaner conversion flow from search traffic.",
    challenge:
      "Location pages were weak, treatment-intent content was thin, and there was no attribution from search to booked consultations.",
    approach: [
      "Implemented technical SEO and service-location architecture.",
      "Optimised treatment pages for clear buyer intent.",
      "Connected booking outcomes into reporting dashboard view.",
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
    serviceSlugs: ["seo-upgrade-pack", "website-pro-build", "booking-system-setup", "ads-launch-pack"],
    industrySlugs: ["medical", "beauty"],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
