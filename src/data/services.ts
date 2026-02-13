import {
  Bot,
  BrainCircuit,
  CalendarClock,
  Gauge,
  MessageSquareReply,
  Workflow,
} from "lucide-react";

import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    slug: "websites-in-72-hours",
    title: "Websites in 72 Hours",
    strapline: "Launch faster than your competitors can quote.",
    shortDescription:
      "Conversion-focused websites shipped in 72 hours with clear messaging, lead capture, and booking journeys built in.",
    longDescription:
      "Most SME websites lose revenue because they are slow to launch, unclear, and disconnected from follow-up systems. We build and publish your new site in 72 hours with performance, conversion paths, and CRM-ready forms from day one.",
    entryPrice: "From £99/month",
    timeline: "72-hour sprint",
    image: "/service-websites.jpg",
    icon: Gauge,
    problems: [
      "Outdated design makes your brand look smaller than you are.",
      "No clear calls to action means visitors leave without enquiring.",
      "Build projects drag on for weeks and eat internal time.",
    ],
    outcomes: [
      "Faster go-live with no scope drift.",
      "Clear page hierarchy that drives quote requests.",
      "A website your team can confidently use in sales conversations.",
    ],
    deliverables: [
      "Homepage + key service pages + contact funnel",
      "Mobile-first UX and technical SEO baseline",
      "Lead capture forms connected to your CRM pipeline",
      "Analytics and conversion event tracking setup",
    ],
    faqs: [
      {
        question: "Can you migrate our existing content?",
        answer:
          "Yes. We migrate priority pages first so your revenue pages go live inside the 72-hour window, then complete long-tail pages in phase two.",
      },
      {
        question: "Do we own the website?",
        answer:
          "Yes. You own domain, content, and assets. We keep the build modular so another team can maintain it if needed.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch", "dental-clinic-rebrand"],
    industrySlugs: ["trades-home-services", "dental-clinics"],
  },
  {
    slug: "seo-aeo",
    title: "SEO + AEO",
    strapline: "Get found in search and AI answers.",
    shortDescription:
      "Technical SEO and answer-engine optimisation designed for Google, ChatGPT, and AI search experiences.",
    longDescription:
      "Search behaviour has changed. Your buyers still use Google, but they increasingly rely on AI assistants for recommendations. We optimise your website architecture, topical authority, and entity signals so your business appears in both traditional search and AI-generated answers.",
    entryPrice: "From £149/month",
    timeline: "First gains in 30-60 days",
    image: "/service-seo-aeo.jpg",
    icon: BrainCircuit,
    problems: [
      "You are invisible for high-intent local searches.",
      "Your pages are not structured for AI citation or extraction.",
      "SEO work lacks clear commercial priorities.",
    ],
    outcomes: [
      "Higher rankings for revenue-driven keywords.",
      "Improved visibility in AI answer surfaces.",
      "More qualified organic leads month over month.",
    ],
    deliverables: [
      "Technical SEO audit + implementation roadmap",
      "AEO content briefs and schema support",
      "Monthly authority content production",
      "Rankings, traffic, and pipeline reporting",
    ],
    faqs: [
      {
        question: "How is AEO different from SEO?",
        answer:
          "SEO targets search rankings, while AEO improves how clearly AI systems can parse, trust, and cite your content in generated answers.",
      },
      {
        question: "Do you handle local SEO for UK areas?",
        answer:
          "Yes. We build local landing pages, map optimisation, and citation consistency around your real service regions.",
      },
    ],
    caseStudySlugs: ["physio-practice-local-seo"],
    industrySlugs: ["health-wellness-clinics", "legal-services"],
  },
  {
    slug: "ai-chatbots",
    title: "AI Chatbots",
    strapline: "Turn website traffic into booked conversations 24/7.",
    shortDescription:
      "Custom AI chatbots trained on your services to qualify leads, answer objections, and route bookings instantly.",
    longDescription:
      "Most websites leak leads after hours because nobody responds. We deploy AI chatbots that handle first-contact conversations, qualify intent, capture details, and hand over to your team or calendar in real time.",
    entryPrice: "From £199/month",
    timeline: "7-day deployment",
    image: "/service-ai-chatbots.jpg",
    icon: Bot,
    problems: [
      "Leads arrive outside office hours and go cold.",
      "Prospects ask repetitive questions before booking.",
      "Sales teams waste time on low-intent enquiries.",
    ],
    outcomes: [
      "Faster first response time with no extra hires.",
      "Higher lead qualification quality.",
      "More booked calls from existing traffic.",
    ],
    deliverables: [
      "Conversation design based on your sales process",
      "Knowledge base ingestion from your website and docs",
      "CRM and calendar hand-off automation",
      "Conversation analytics and weekly optimisation",
    ],
    faqs: [
      {
        question: "Will the bot sound robotic?",
        answer:
          "No. We tune tone and prompts around your brand voice and include escalation rules for human handover.",
      },
      {
        question: "Can it integrate with our CRM?",
        answer:
          "Yes. We connect to common CRM systems and can push qualified leads with tags, summaries, and source metadata.",
      },
    ],
    caseStudySlugs: ["estate-agency-chatbot"],
    industrySlugs: ["estate-agents", "legal-services"],
  },
  {
    slug: "automations-workflows",
    title: "Automations & Workflows",
    strapline: "Remove admin bottlenecks and scale operations.",
    shortDescription:
      "Workflow automations that move leads, tasks, and client updates across your tools without manual chasing.",
    longDescription:
      "When your team copies data between tools, errors and delays pile up. We design automations that connect forms, CRM, booking, billing, and notifications so every lead and customer moves through a reliable, repeatable process.",
    entryPrice: "From £149/month",
    timeline: "10-14 day rollout",
    image: "/service-automations-workflows.jpg",
    icon: Workflow,
    problems: [
      "Leads sit in inboxes because no one owns follow-up.",
      "Manual admin steals time from delivery and sales.",
      "No visibility into where deals get stuck.",
    ],
    outcomes: [
      "Consistent lead-to-sale workflow execution.",
      "Reduced operational overhead and fewer dropped tasks.",
      "Clear pipeline data for better decisions.",
    ],
    deliverables: [
      "Workflow mapping for front-office and back-office flows",
      "Webhook-first automation architecture",
      "Retry logic and alerting for failed steps",
      "Operational dashboard setup with key SLA metrics",
    ],
    faqs: [
      {
        question: "Do automations break easily?",
        answer:
          "We build with retries, logging, and failure alerts so your team knows when to intervene before revenue is affected.",
      },
      {
        question: "Can you automate legacy tools too?",
        answer:
          "Usually yes. We combine native integrations, APIs, and middleware connectors depending on tool constraints.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch", "estate-agency-chatbot"],
    industrySlugs: ["trades-home-services", "estate-agents", "legal-services"],
  },
  {
    slug: "crm-booking-reminders",
    title: "CRM, Booking & Reminders",
    strapline: "No-show reduction and cleaner pipelines by default.",
    shortDescription:
      "Unified CRM and booking systems with automated reminders, pipeline stages, and follow-up sequences.",
    longDescription:
      "Scattered leads and missed appointments kill profit. We implement CRM structure, booking flows, and reminder automations that keep prospects engaged from first enquiry to paid job.",
    entryPrice: "From £129/month",
    timeline: "5-day setup",
    image: "/service-crm-booking-reminders.jpg",
    icon: CalendarClock,
    problems: [
      "Leads are tracked in spreadsheets and WhatsApp threads.",
      "No-shows and delayed responses reduce close rates.",
      "Owners cannot see conversion stages clearly.",
    ],
    outcomes: [
      "Centralised lead pipeline with ownership.",
      "Automated reminders that improve attendance.",
      "Faster quoting and follow-up consistency.",
    ],
    deliverables: [
      "CRM pipeline design and stage definitions",
      "Booking pages with qualification logic",
      "SMS and email reminder sequences",
      "Lead-source attribution and conversion reporting",
    ],
    faqs: [
      {
        question: "Can we keep our existing CRM?",
        answer:
          "Yes. If your current CRM is fit for purpose, we optimise it. If not, we migrate to a better-fit setup with minimal downtime.",
      },
      {
        question: "Do reminder messages stay on brand?",
        answer:
          "Yes. We write reminder templates in your tone and include branch logic for confirmations, reschedules, and no-shows.",
      },
    ],
    caseStudySlugs: ["dental-clinic-rebrand", "physio-practice-local-seo"],
    industrySlugs: ["dental-clinics", "health-wellness-clinics"],
  },
  {
    slug: "24-7-call-answering",
    title: "24/7 Call Answering",
    strapline: "Capture every enquiry, even when your team is offline.",
    shortDescription:
      "Always-on AI-assisted call handling with booking, qualification, and callback routing so no lead is missed.",
    longDescription:
      "If calls go unanswered, revenue disappears. Our 24/7 call-answering setup captures and qualifies inbound calls, books consultations, and routes urgent requests with context to the right team member.",
    entryPrice: "From £199/month",
    timeline: "1-2 week onboarding",
    image: "/service-24-7-call-answering.jpg",
    icon: MessageSquareReply,
    problems: [
      "Missed calls during jobs, meetings, or after hours.",
      "Inconsistent call notes and poor follow-up visibility.",
      "No process for routing hot leads immediately.",
    ],
    outcomes: [
      "More captured opportunities from existing demand.",
      "Structured call summaries synced to your CRM.",
      "Improved response SLAs and customer experience.",
    ],
    deliverables: [
      "AI voice flow design for qualification and triage",
      "Booking and callback routing automation",
      "Call transcription and CRM sync",
      "SLA dashboard for missed call and response rates",
    ],
    faqs: [
      {
        question: "Can urgent calls skip the AI flow?",
        answer:
          "Yes. We set intent-based routing so emergency or high-value calls are escalated immediately.",
      },
      {
        question: "Will this replace our team?",
        answer:
          "No. It handles first response and routine qualification so your team can focus on selling and fulfilment.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch", "estate-agency-chatbot"],
    industrySlugs: ["trades-home-services", "estate-agents"],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
