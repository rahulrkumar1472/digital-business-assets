import {
  Bot,
  CalendarClock,
  Gauge,
  Megaphone,
  MessageSquareReply,
  Network,
  PhoneCall,
  Search,
  Workflow,
} from "lucide-react";

import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    slug: "website-starter-build",
    title: "Website Starter Build",
    strapline: "Get online fast with a conversion-ready business website.",
    shortDescription:
      "A fast-launch website for offline or low-digital businesses that need trust, clarity, and lead capture immediately.",
    longDescription:
      "We install a premium starter website with clear service messaging, enquiry paths, and tracking so your business can start converting traffic quickly.",
    entryPrice: "From £399",
    timeline: "72-hour launch",
    image: "/media/services-web.jpg",
    icon: Gauge,
    problems: [
      "No professional website to build trust",
      "Leads cannot find clear contact paths",
      "No measurement of visits, calls, or form submissions",
    ],
    outcomes: [
      "Launch a premium online presence in 72 hours",
      "Capture enquiries from day one",
      "Move from invisible to searchable with a strong baseline",
    ],
    deliverables: [
      "Homepage + service pages + contact conversion section",
      "Lead form, click-to-call actions, and WhatsApp quick action",
      "Core analytics and event tracking",
      "Technical launch checklist and handover",
    ],
    faqs: [
      {
        question: "Can we go live in 72 hours if we have no existing assets?",
        answer:
          "Yes. We can launch with your core offer, contact routes, and trust blocks first, then expand pages after launch.",
      },
      {
        question: "Will this website be ready for SEO upgrades later?",
        answer:
          "Yes. The build includes structure and metadata foundations so the SEO Upgrade Pack can be added cleanly.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch"],
    industrySlugs: ["restaurants", "retail", "beauty", "medical", "local-services"],
  },
  {
    slug: "website-pro-build",
    title: "Website Pro Build",
    strapline: "A higher-conversion site stack for growth-focused teams.",
    shortDescription:
      "A full business website system with advanced page architecture, trust positioning, and stronger conversion paths.",
    longDescription:
      "Built for businesses already generating leads but leaking conversion, this package upgrades positioning, funnels, and decision-stage proof.",
    entryPrice: "From £549",
    timeline: "5-7 day build",
    image: "/media/services-web.jpg",
    icon: Gauge,
    problems: [
      "Website looks basic and under-converts",
      "Service pages do not answer buying objections",
      "No clear path from visitor to booked conversation",
    ],
    outcomes: [
      "Higher conversion from existing traffic",
      "Stronger authority and trust signals",
      "Cleaner lead quality before sales calls",
    ],
    deliverables: [
      "Offer architecture and conversion-first copy structure",
      "Advanced service pages with objection handling",
      "Case study and proof framework",
      "Tracked CTA events and conversion map",
    ],
    faqs: [
      {
        question: "Should we choose Starter or Pro?",
        answer:
          "Starter is for speed-to-market. Pro is for businesses with traffic that need stronger conversion and clearer buyer journeys.",
      },
      {
        question: "Can you migrate our old content?",
        answer:
          "Yes. We migrate high-value content first, then sequence the rest in priority order.",
      },
    ],
    caseStudySlugs: ["dental-clinic-rebrand"],
    industrySlugs: ["real-estate", "medical", "aviation", "law-firms", "local-services"],
  },
  {
    slug: "whatsapp-business-setup",
    title: "WhatsApp Business Setup",
    strapline: "Turn messaging into a reliable booking channel.",
    shortDescription:
      "Deploy WhatsApp for enquiry capture, pre-qualification, and quick-response workflows that reduce lead drop-off.",
    longDescription:
      "We configure a business-grade WhatsApp flow so prospects can enquire quickly and your team can route opportunities without chaos.",
    entryPrice: "From £399",
    timeline: "3-5 day setup",
    image: "/media/services-automation.jpg",
    icon: MessageSquareReply,
    problems: [
      "Prospects message but get slow replies",
      "No clear owner for incoming chats",
      "Messages are lost and never tracked",
    ],
    outcomes: [
      "Faster first response to high-intent enquiries",
      "Consistent lead handling in one channel",
      "Higher conversion from mobile-first prospects",
    ],
    deliverables: [
      "WhatsApp business channel configuration",
      "Auto-reply and triage message logic",
      "Lead handoff steps into CRM",
      "Response and conversion tracking",
    ],
    faqs: [
      {
        question: "Can this work with our existing phone process?",
        answer:
          "Yes. WhatsApp can run alongside calls and forms, with unified routing rules.",
      },
      {
        question: "Will we lose message history?",
        answer:
          "No. We design handoff and storage so key context is retained for follow-up.",
      },
    ],
    caseStudySlugs: ["estate-agency-chatbot"],
    industrySlugs: ["restaurants", "beauty", "real-estate", "retail", "local-services"],
  },
  {
    slug: "booking-system-setup",
    title: "Booking System Setup",
    strapline: "Make booking fast, simple, and trackable.",
    shortDescription:
      "Install a booking journey with confirmation and reminder controls to reduce no-shows and improve attendance.",
    longDescription:
      "We build a friction-light booking system that gets prospects from enquiry to confirmed slot with less manual admin.",
    entryPrice: "From £449",
    timeline: "3-6 day setup",
    image: "/media/services-automation.jpg",
    icon: CalendarClock,
    problems: [
      "Leads do not complete booking",
      "No-show rates stay high",
      "Team manually chases confirmations",
    ],
    outcomes: [
      "More confirmed bookings each week",
      "Reduced no-shows with automated reminders",
      "Cleaner calendar operations",
    ],
    deliverables: [
      "Booking flow and slot logic",
      "Confirmation and reminder sequence",
      "Reschedule and cancellation handling",
      "Attendance performance reporting",
    ],
    faqs: [
      {
        question: "Can we route by team member or location?",
        answer:
          "Yes. We configure booking rules based on your capacity model.",
      },
      {
        question: "Can you keep our current calendar provider?",
        answer: "Yes. We integrate with your current tools where possible.",
      },
    ],
    caseStudySlugs: ["dental-clinic-rebrand"],
    industrySlugs: ["medical", "beauty", "restaurants", "aviation", "local-services"],
  },
  {
    slug: "call-tracking-missed-call-capture",
    title: "Call Tracking + Missed Call Capture",
    strapline: "Recover lost phone demand before competitors do.",
    shortDescription:
      "Track calls, capture missed enquiries instantly, and route callbacks into a measurable process.",
    longDescription:
      "We install missed-call capture and call tracking so your business stops leaking ready-to-buy demand while your team is busy.",
    entryPrice: "From £499",
    timeline: "3-5 day setup",
    image: "/media/services-automation.jpg",
    icon: PhoneCall,
    problems: [
      "Missed calls are never recovered",
      "No call source attribution",
      "Callbacks happen too late to convert",
    ],
    outcomes: [
      "Recover missed inbound opportunities",
      "Faster callback execution",
      "Clear call-to-booking reporting",
    ],
    deliverables: [
      "Call tracking setup by source",
      "Missed-call instant text-back sequence",
      "Callback routing rules",
      "Call outcome dashboard",
    ],
    faqs: [
      {
        question: "Will this work if we have multiple phone numbers?",
        answer: "Yes. We can map tracking and routing across departments or branches.",
      },
      {
        question: "Can urgent leads bypass the queue?",
        answer: "Yes. Urgency rules can escalate directly to priority contacts.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch"],
    industrySlugs: ["restaurants", "real-estate", "medical", "beauty", "local-services"],
  },
  {
    slug: "crm-setup",
    title: "CRM Setup",
    strapline: "Give every lead a clear next step.",
    shortDescription:
      "Set up pipeline stages, ownership rules, and visibility so no lead is left unmanaged.",
    longDescription:
      "We structure your CRM around your real sales process so follow-up becomes consistent and measurable.",
    entryPrice: "From £599",
    timeline: "5-7 day setup",
    image: "/media/services-automation.jpg",
    icon: Network,
    problems: [
      "Leads are scattered across channels",
      "No stage ownership or accountability",
      "Pipeline value is unclear week to week",
    ],
    outcomes: [
      "Single source of truth for every lead",
      "Faster stage progression",
      "Reliable conversion reporting",
    ],
    deliverables: [
      "Pipeline architecture and stage definitions",
      "Lead source and quality tagging",
      "SLA and task automation triggers",
      "Team usage playbook",
    ],
    faqs: [
      {
        question: "Can we keep our existing CRM?",
        answer:
          "Usually yes. We optimise your current platform first before suggesting any migration.",
      },
      {
        question: "Will my team get onboarding?",
        answer: "Yes. We include practical setup and usage guidance for core roles.",
      },
    ],
    caseStudySlugs: ["estate-agency-chatbot", "dental-clinic-rebrand"],
    industrySlugs: ["real-estate", "medical", "retail", "aviation", "local-services"],
  },
  {
    slug: "seo-upgrade-pack",
    title: "SEO Upgrade Pack",
    strapline: "Get found by buyers ready to act.",
    shortDescription:
      "Upgrade search visibility and local discoverability with practical technical and content improvements.",
    longDescription:
      "We install a focused SEO foundation and growth plan so your business appears when high-intent buyers are searching.",
    entryPrice: "From £499",
    timeline: "7-14 day rollout",
    image: "/media/services-seo.jpg",
    icon: Search,
    problems: [
      "Low visibility for high-intent searches",
      "Pages do not match buyer intent",
      "No clear SEO measurement framework",
    ],
    outcomes: [
      "Higher qualified search traffic",
      "Better local ranking footprint",
      "Clear visibility from traffic to leads",
    ],
    deliverables: [
      "Technical SEO baseline fixes",
      "Service page intent optimisation",
      "Local SEO and map profile alignment",
      "Reporting board for rankings and leads",
    ],
    faqs: [
      {
        question: "Do you include local SEO?",
        answer: "Yes. Local intent and map visibility are core parts of this pack.",
      },
      {
        question: "How fast can we expect movement?",
        answer: "Most businesses see early movement in 4-8 weeks, then compounding gains.",
      },
    ],
    caseStudySlugs: ["physio-practice-local-seo"],
    industrySlugs: ["restaurants", "real-estate", "medical", "retail", "beauty", "aviation"],
  },
  {
    slug: "ai-chatbot-install",
    title: "AI Chatbot Install",
    strapline: "Qualify leads and answer questions 24/7.",
    shortDescription:
      "Deploy a consultative chatbot that handles common buyer questions, pre-qualifies enquiries, and routes next steps.",
    longDescription:
      "We install an AI assistant tuned for business-owner outcomes so prospects get immediate guidance and your team gets better-qualified conversations.",
    entryPrice: "From £499",
    timeline: "5-7 day setup",
    image: "/media/services-automation.jpg",
    icon: Bot,
    problems: [
      "No response outside business hours",
      "Sales team spends time answering repetitive questions",
      "Low-quality enquiries consume capacity",
    ],
    outcomes: [
      "24/7 enquiry handling",
      "Better lead qualification before human handoff",
      "Higher booking intent quality",
    ],
    deliverables: [
      "Chatbot flow design and guardrails",
      "Knowledge setup from your offers and FAQs",
      "Lead capture + handoff automation",
      "Conversation analytics and improvement loop",
    ],
    faqs: [
      {
        question: "Will it sound robotic?",
        answer: "No. We tune tone and prompts to sound natural and business appropriate.",
      },
      {
        question: "Can the chatbot escalate to a real person?",
        answer: "Yes. We add escalation triggers based on intent and urgency.",
      },
    ],
    caseStudySlugs: ["estate-agency-chatbot"],
    industrySlugs: ["restaurants", "real-estate", "retail", "beauty", "aviation", "local-services"],
  },
  {
    slug: "follow-up-automation",
    title: "Follow-up Automation",
    strapline: "Automate the chase so hot leads do not cool.",
    shortDescription:
      "Deploy automated follow-up sequences across calls, forms, and messages to increase booking completion.",
    longDescription:
      "We build workflow automations that trigger the right follow-up at the right time, reducing manual chasing and lost opportunities.",
    entryPrice: "From £549",
    timeline: "5-10 day rollout",
    image: "/media/services-automation.jpg",
    icon: Workflow,
    problems: [
      "Leads wait too long for a second touch",
      "Follow-up depends on manual reminders",
      "No consistent reactivation process",
    ],
    outcomes: [
      "Higher lead-to-booking conversion",
      "Consistent response standards",
      "More predictable monthly pipeline",
    ],
    deliverables: [
      "Lead response workflow mapping",
      "Automated follow-up sequence setup",
      "Escalation and reminder logic",
      "Workflow health dashboard",
    ],
    faqs: [
      {
        question: "Can this work across phone, email, and WhatsApp?",
        answer: "Yes. We orchestrate multi-channel follow-up from one logic layer.",
      },
      {
        question: "What if a lead replies mid-sequence?",
        answer: "Sequences can pause or reroute automatically when intent changes.",
      },
    ],
    caseStudySlugs: ["roofing-co-fast-launch", "estate-agency-chatbot"],
    industrySlugs: ["restaurants", "real-estate", "medical", "retail", "beauty", "aviation"],
  },
  {
    slug: "ads-launch-pack",
    title: "Ads Launch Pack",
    strapline: "Launch paid acquisition with conversion controls in place.",
    shortDescription:
      "Launch ads with tracking, conversion paths, and follow-up systems so ad spend drives measurable pipeline.",
    longDescription:
      "We set up ad-ready landing and tracking architecture so your first campaigns generate usable lead data and faster feedback loops.",
    entryPrice: "From £599",
    timeline: "7-day launch",
    image: "/media/services-seo.jpg",
    icon: Megaphone,
    problems: [
      "Ad spend without clear conversion tracking",
      "Leads arrive but are not followed up quickly",
      "No confidence in campaign profitability",
    ],
    outcomes: [
      "Faster campaign launch with clear tracking",
      "Improved lead quality from paid channels",
      "Stronger visibility on cost vs return",
    ],
    deliverables: [
      "Ad-ready landing flow setup",
      "Conversion event tracking and attribution",
      "Lead routing and follow-up readiness",
      "Initial campaign measurement dashboard",
    ],
    faqs: [
      {
        question: "Do you run campaigns or only setup?",
        answer: "This pack covers launch architecture; ongoing management can be added as a subscription module.",
      },
      {
        question: "Can we add this after website launch?",
        answer: "Yes. It is designed to plug into both Starter and Pro website tracks.",
      },
    ],
    caseStudySlugs: ["physio-practice-local-seo"],
    industrySlugs: ["restaurants", "real-estate", "medical", "retail", "beauty", "aviation"],
  },
];

const legacyServiceSlugMap: Record<string, string> = {
  "websites-in-72-hours": "website-starter-build",
  "seo-aeo": "seo-upgrade-pack",
  "ai-chatbots": "ai-chatbot-install",
  "automations-workflows": "follow-up-automation",
  "crm-pipelines": "crm-setup",
  "missed-call-recovery": "call-tracking-missed-call-capture",
  "booking-systems-reminders": "booking-system-setup",
  "reporting-dashboards": "crm-setup",
  "24-7-call-answering": "call-tracking-missed-call-capture",
  "crm-booking-reminders": "crm-setup",
};

export function resolveServiceSlug(slug: string) {
  return legacyServiceSlugMap[slug] ?? slug;
}

export function getServiceBySlug(slug: string) {
  const resolvedSlug = resolveServiceSlug(slug);
  return services.find((service) => service.slug === resolvedSlug);
}
