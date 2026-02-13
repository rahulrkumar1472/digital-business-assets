import {
  Bot,
  BrainCircuit,
  CalendarClock,
  ChartNoAxesCombined,
  Gauge,
  MessageSquareReply,
  Network,
  Workflow,
} from "lucide-react";

import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    slug: "websites-in-72-hours",
    title: "Website Builds in 72 Hours",
    strapline: "Launch a premium website that converts quickly.",
    shortDescription:
      "Done-for-you high-performance websites with clear offers, conversion paths, and CRM-connected lead capture.",
    longDescription:
      "We build and ship your core website stack in 72 hours, designed for lead generation and conversion from day one.",
    entryPrice: "From £99/month",
    timeline: "72-hour launch",
    image: "/media/services-web.jpg",
    icon: Gauge,
    problems: [
      "Website looks outdated and does not build trust",
      "Visitors do not know where to click or how to book",
      "No lead data flowing into CRM",
    ],
    outcomes: [
      "Premium positioning with clear CTA hierarchy",
      "Higher enquiry-to-booking conversion",
      "Trackable lead events from first click",
    ],
    deliverables: [
      "Homepage + service pages + conversion funnel",
      "Lead forms, call CTAs, and booking intent blocks",
      "Speed and technical SEO foundation",
      "CRM handoff and conversion event tracking",
    ],
    faqs: [
      {
        question: "Can you launch in 72 hours without sacrificing quality?",
        answer:
          "Yes. We run a structured sprint: offer messaging, page framework, conversion modules, QA, then deployment.",
      },
      {
        question: "Can this replace our current website?",
        answer:
          "Yes. We migrate key pages first, then phase remaining content so you do not lose momentum.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch", "dental-clinic-rebrand"],
    industrySlugs: ["trades-home-services", "dental-clinics", "local-services"],
  },
  {
    slug: "seo-aeo",
    title: "SEO + AEO",
    strapline: "Win Google search and AI answers together.",
    shortDescription:
      "Technical SEO and answer-engine optimisation so your business is discoverable where buyers research.",
    longDescription:
      "We structure your website for search intent and AI retrieval, then compound authority with conversion-aligned content.",
    entryPrice: "From £149/month",
    timeline: "30-60 day lift",
    image: "/media/services-seo.jpg",
    icon: BrainCircuit,
    problems: [
      "Low visibility for high-intent terms",
      "No AI answer presence for service queries",
      "Content is generic and unstructured",
    ],
    outcomes: [
      "Improved rankings and qualified traffic",
      "Better citation likelihood in AI assistants",
      "Clear attribution from search to pipeline",
    ],
    deliverables: [
      "Technical SEO and content architecture",
      "Service schema and AEO-ready page structures",
      "Monthly content and authority roadmap",
      "Performance reporting tied to leads",
    ],
    faqs: [
      {
        question: "Do you handle both local and national SEO?",
        answer:
          "Yes. We design location clusters and broader category coverage based on your sales footprint.",
      },
      {
        question: "How soon do we see results?",
        answer:
          "Most clients see movement in 4-8 weeks, with stronger gains as technical and content layers mature.",
      },
    ],
    caseStudySlugs: ["physio-practice-local-seo"],
    industrySlugs: ["health-wellness-clinics", "legal-services", "ecommerce-brands"],
  },
  {
    slug: "ai-chatbots",
    title: "Chatbots + AI Assistants",
    strapline: "Qualify and book leads while your team is offline.",
    shortDescription:
      "AI assistants trained on your offers to handle objections, pre-qualify leads, and route bookings.",
    longDescription:
      "We deploy bot flows that act like a top-performing SDR: instant response, qualification logic, and clean handoff to CRM.",
    entryPrice: "From £199/month",
    timeline: "7-day deployment",
    image: "/media/services-automation.jpg",
    icon: Bot,
    problems: [
      "Slow first response outside office hours",
      "Manual pre-qualification wastes team time",
      "Enquiries arrive without context",
    ],
    outcomes: [
      "24/7 response and lead capture",
      "Higher booking intent quality",
      "Faster sales handover with context",
    ],
    deliverables: [
      "Conversation architecture and guardrails",
      "Knowledge ingestion from your offers",
      "CRM and calendar handoff logic",
      "Conversation analytics and optimisation",
    ],
    faqs: [
      {
        question: "Will the assistant sound generic?",
        answer:
          "No. We tune tone, prompts, and qualification branches around your sales process.",
      },
      {
        question: "Can it route urgent enquiries?",
        answer:
          "Yes. We implement intent-based escalation for high-value or urgent requests.",
      },
    ],
    caseStudySlugs: ["estate-agency-chatbot"],
    industrySlugs: ["estate-agents", "legal-services", "gyms-fitness"],
  },
  {
    slug: "crm-pipelines",
    title: "CRM + Pipelines",
    strapline: "Move every lead through a visible, accountable pipeline.",
    shortDescription:
      "CRM architecture, stage design, and ownership workflows so no lead gets lost.",
    longDescription:
      "We build your CRM operating model with clear stages, SLAs, and automations that turn pipeline chaos into predictable growth.",
    entryPrice: "From £129/month",
    timeline: "5-day setup",
    image: "/media/services-automation.jpg",
    icon: Network,
    problems: [
      "Leads scattered across inboxes and spreadsheets",
      "No clear stage ownership",
      "No visibility into conversion bottlenecks",
    ],
    outcomes: [
      "Single source of truth for sales activity",
      "Faster follow-up and cleaner stage progression",
      "More predictable conversion reporting",
    ],
    deliverables: [
      "Pipeline architecture and stage definitions",
      "Lead source and quality tagging",
      "SLA reminders and task automation",
      "Weekly KPI reporting setup",
    ],
    faqs: [
      {
        question: "Can we keep our current CRM?",
        answer:
          "Yes. We optimise your existing stack where possible and only recommend migration when required.",
      },
      {
        question: "Will this work for small teams?",
        answer:
          "Yes. We design lean processes that improve accountability without adding admin burden.",
      },
    ],
    caseStudySlugs: ["dental-clinic-rebrand", "estate-agency-chatbot"],
    industrySlugs: ["dental-clinics", "estate-agents", "local-services"],
  },
  {
    slug: "automations-workflows",
    title: "Automations + Workflows",
    strapline: "Automate repetitive tasks across your stack.",
    shortDescription:
      "Webhook-first workflows that connect forms, CRM, notifications, and delivery tasks with reliability.",
    longDescription:
      "We map high-friction workflows and deploy automations with retries, alerts, and reporting to reduce manual bottlenecks.",
    entryPrice: "From £149/month",
    timeline: "7-14 day rollout",
    image: "/media/services-automation.jpg",
    icon: Workflow,
    problems: [
      "Manual task chasing slows response times",
      "Teams duplicate work across tools",
      "No failure alerting for critical processes",
    ],
    outcomes: [
      "Faster lead-to-booking turnaround",
      "Reduced operational overhead",
      "Reliable automation with visibility",
    ],
    deliverables: [
      "Workflow mapping and bottleneck analysis",
      "Webhook/API automation setup",
      "Failure handling and alerting",
      "Operational runbook and dashboards",
    ],
    faqs: [
      {
        question: "Can you connect mixed tool stacks?",
        answer:
          "Yes. We combine native integrations, APIs, and middleware when needed.",
      },
      {
        question: "How do we prevent automation breakage?",
        answer:
          "We include retries, error monitoring, and escalation rules to keep flows stable.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch", "estate-agency-chatbot"],
    industrySlugs: ["trades-home-services", "estate-agents", "local-services"],
  },
  {
    slug: "missed-call-recovery",
    title: "Missed-Call Text-Back + Call Handling",
    strapline: "Turn missed calls into booked jobs automatically.",
    shortDescription:
      "Capture inbound demand with instant SMS response, call logging, and qualified callback automation.",
    longDescription:
      "We deploy missed-call recovery and intelligent call handling so every inbound enquiry gets immediate follow-up.",
    entryPrice: "From £199/month",
    timeline: "1 week",
    image: "/media/services-automation.jpg",
    icon: MessageSquareReply,
    problems: [
      "Missed calls during jobs or meetings",
      "No instant response after missed calls",
      "Poor call note quality for callbacks",
    ],
    outcomes: [
      "Higher lead recovery rates",
      "Faster callback response time",
      "Improved booking conversion from phone",
    ],
    deliverables: [
      "Instant text-back automations",
      "Call tagging and qualification logic",
      "Callback booking workflow",
      "Missed-call recovery reporting",
    ],
    faqs: [
      {
        question: "Can urgent calls route directly to staff?",
        answer:
          "Yes. We add urgency rules to bypass automation where required.",
      },
      {
        question: "Will this integrate with CRM?",
        answer:
          "Yes. We sync call outcomes and contact records into your pipeline automatically.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch"],
    industrySlugs: ["trades-home-services", "local-services"],
  },
  {
    slug: "booking-systems-reminders",
    title: "Booking Systems + Reminders",
    strapline: "Cut no-shows and speed up confirmed appointments.",
    shortDescription:
      "Booking pages, reminder flows, and no-show prevention automation tailored to your sales cycle.",
    longDescription:
      "We build booking systems that qualify leads, reduce no-shows, and move people from enquiry to confirmed appointment.",
    entryPrice: "From £129/month",
    timeline: "5-day setup",
    image: "/media/services-automation.jpg",
    icon: CalendarClock,
    problems: [
      "Low attendance on booked calls",
      "Manual reminder workflows",
      "No reschedule logic in place",
    ],
    outcomes: [
      "Higher show-up rates",
      "Less admin for front-office teams",
      "More predictable calendar utilisation",
    ],
    deliverables: [
      "Booking funnel with qualification questions",
      "SMS and email reminder sequences",
      "Reschedule and cancellation logic",
      "Attendance reporting and optimisation",
    ],
    faqs: [
      {
        question: "Can reminders match our brand tone?",
        answer:
          "Yes. We customise reminder language and escalation messaging to your voice.",
      },
      {
        question: "Will this support multiple staff calendars?",
        answer:
          "Yes. We can route by service type, location, or team capacity.",
      },
    ],
    caseStudySlugs: ["dental-clinic-rebrand"],
    industrySlugs: ["dental-clinics", "health-wellness-clinics", "gyms-fitness"],
  },
  {
    slug: "reporting-dashboards",
    title: "Reporting + Dashboards",
    strapline: "See what drives revenue in one view.",
    shortDescription:
      "Executive dashboards combining lead sources, response times, bookings, and revenue outcomes.",
    longDescription:
      "We connect your growth metrics into dashboards that show where deals are won, lost, or delayed, so decisions are data-backed.",
    entryPrice: "From £149/month",
    timeline: "7-day setup",
    image: "/media/services-automation.jpg",
    icon: ChartNoAxesCombined,
    problems: [
      "No single source for performance data",
      "Reporting takes too long to prepare",
      "Hard to prove ROI by channel or campaign",
    ],
    outcomes: [
      "Clear weekly growth visibility",
      "Faster decisions on spend and process",
      "Reliable attribution from lead to revenue",
    ],
    deliverables: [
      "Dashboard architecture and KPI mapping",
      "Lead, booking, and revenue connectors",
      "Weekly executive scorecards",
      "Alerting for SLA or conversion drops",
    ],
    faqs: [
      {
        question: "Can we combine ad, CRM, and booking data?",
        answer:
          "Yes. We build unified dashboards across your core systems.",
      },
      {
        question: "Do you include dashboard training?",
        answer:
          "Yes. We provide owner-level and team-level reporting views with usage guidance.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch", "physio-practice-local-seo"],
    industrySlugs: ["trades-home-services", "ecommerce-brands", "local-services"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
