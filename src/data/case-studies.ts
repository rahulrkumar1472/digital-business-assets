import type { CaseStudy } from "@/types/content";

export const caseStudies: CaseStudy[] = [
  {
    slug: "roofing-co-fast-launch",
    title: "From no funnel to booked surveys in 10 days",
    clientName: "Northern Shield Roofing",
    clientSector: "Trades & Home Services",
    location: "Manchester",
    coverImage: "/case-study-roofing.jpg",
    snapshot:
      "A roofing company needed a website, call routing, and lead follow-up before storm season demand.",
    challenge:
      "The business relied on referrals and missed inbound calls while crews were onsite, causing lost high-intent opportunities.",
    approach: [
      "Built a conversion-led website in 72 hours with emergency and quote flows.",
      "Implemented AI-assisted 24/7 call answering with urgent call escalation.",
      "Automated CRM lead capture, reminders, and quote follow-up sequences.",
    ],
    outcomes: [
      { label: "Lead response time", value: "Under 2 minutes" },
      { label: "Booked surveys", value: "+47% in 30 days" },
      { label: "Missed call rate", value: "Down 68%" },
    ],
    testimonial: {
      quote:
        "The system started paying for itself in week one. We stopped losing callers and our diary filled up faster than expected.",
      author: "Daniel F.",
      role: "Managing Director",
    },
    serviceSlugs: [
      "websites-in-72-hours",
      "automations-workflows",
      "24-7-call-answering",
    ],
    industrySlugs: ["trades-home-services"],
  },
  {
    slug: "dental-clinic-rebrand",
    title: "Clinic rebrand with no-show reduction and better booking flow",
    clientName: "Smilepoint Dental",
    clientSector: "Dental Clinics",
    location: "Birmingham",
    coverImage: "/case-study-dental.jpg",
    snapshot:
      "A private dental clinic needed higher quality enquiries and fewer consultation no-shows.",
    challenge:
      "Their old website was outdated and the booking process lacked reminders or qualification, leading to poor conversion quality.",
    approach: [
      "Delivered a new premium website in 72 hours focused on high-value treatments.",
      "Rolled out CRM pipeline stages for enquiry, consult, and treatment acceptance.",
      "Added SMS and email booking reminders with reschedule flows.",
    ],
    outcomes: [
      { label: "Consultation no-shows", value: "Down 41%" },
      { label: "Treatment plan acceptance", value: "+22%" },
      { label: "Form-to-booking conversion", value: "+33%" },
    ],
    testimonial: {
      quote:
        "Our front desk is no longer chasing every lead manually. The system keeps patients moving through the pipeline.",
      author: "Dr. Priya N.",
      role: "Clinic Owner",
    },
    serviceSlugs: ["websites-in-72-hours", "crm-booking-reminders"],
    industrySlugs: ["dental-clinics", "health-wellness-clinics"],
  },
  {
    slug: "estate-agency-chatbot",
    title: "AI chatbot qualified landlord leads around the clock",
    clientName: "Westbridge Estates",
    clientSector: "Estate Agents",
    location: "Leeds",
    coverImage: "/case-study-estate.jpg",
    snapshot:
      "An estate agency wanted to qualify valuation leads outside office hours and route urgent instructions quickly.",
    challenge:
      "Most inbound questions arrived during evenings and weekends, but follow-up happened Monday, by which time leads had gone elsewhere.",
    approach: [
      "Designed and deployed a valuation-focused AI chatbot with intent branching.",
      "Connected chatbot outcomes to CRM tasks and appointment booking.",
      "Added workflow alerts for high-value landlord opportunities.",
    ],
    outcomes: [
      { label: "Out-of-hours qualified leads", value: "+58%" },
      { label: "Average first response", value: "Instant" },
      { label: "Valuation bookings", value: "+29%" },
    ],
    testimonial: {
      quote:
        "We finally respond at the speed clients expect. The bot filters noise and passes our valuers only high-intent conversations.",
      author: "Charlotte M.",
      role: "Branch Director",
    },
    serviceSlugs: ["ai-chatbots", "automations-workflows", "24-7-call-answering"],
    industrySlugs: ["estate-agents"],
  },
  {
    slug: "physio-practice-local-seo",
    title: "Local SEO + AEO lifted treatment bookings from organic search",
    clientName: "Core Motion Physio",
    clientSector: "Health & Wellness Clinics",
    location: "Bristol",
    coverImage: "/case-study-physio.jpg",
    snapshot:
      "A physiotherapy practice needed stronger visibility for local injury and rehabilitation searches.",
    challenge:
      "Their website had weak location pages, no topical authority structure, and minimal schema coverage.",
    approach: [
      "Implemented technical SEO fixes and location page architecture.",
      "Published AEO-focused treatment guides and FAQ content clusters.",
      "Set up lead attribution from organic sessions to consultation bookings.",
    ],
    outcomes: [
      { label: "Organic traffic", value: "+64%" },
      { label: "Top-3 local rankings", value: "18 new terms" },
      { label: "Organic consultation bookings", value: "+37%" },
    ],
    testimonial: {
      quote:
        "We now show up for the exact problems patients search for, and bookings are much more consistent.",
      author: "Tom W.",
      role: "Practice Manager",
    },
    serviceSlugs: ["seo-aeo", "crm-booking-reminders"],
    industrySlugs: ["health-wellness-clinics"],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
