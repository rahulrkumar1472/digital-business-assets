import { services } from "@/data/services";

export type PlanPhase = "Day 1-3" | "Day 4-7" | "Day 8-14";

export type ModuleRecommendation = {
  id: string;
  title: string;
  why: string;
  action: string;
  href: string;
  phase: PlanPhase;
  priceLabel: string;
};

type ModuleMapInput = {
  speedScore: number;
  seoScore: number;
  conversionScore: number;
  trustScore: number;
  leakTypes: string[];
  industry?: string;
  goal?: string;
};

type ModuleDefinition = {
  id: string;
  title: string;
  slug?: string;
  fallbackHref?: string;
  defaultWhy: string;
  defaultAction: string;
};

const moduleDefinitions: Record<string, ModuleDefinition> = {
  websiteStarter: {
    id: "websiteStarter",
    title: "Website Starter Build",
    slug: "website-starter-build",
    defaultWhy: "Stabilises trust and conversion basics quickly.",
    defaultAction: "Launch a clean conversion-first baseline with clear CTA routing.",
  },
  websitePro: {
    id: "websitePro",
    title: "Website Pro Build",
    slug: "website-pro-build",
    defaultWhy: "Improves speed, offer hierarchy, and conversion flow.",
    defaultAction: "Rebuild key templates for faster load and stronger buyer intent.",
  },
  seoSprint: {
    id: "seoSprint",
    title: "SEO Upgrade Pack",
    slug: "seo-upgrade-pack",
    defaultWhy: "Targets qualified demand from high-intent search terms.",
    defaultAction: "Refactor metadata, intent pages, and internal links for local rankings.",
  },
  chatbot: {
    id: "chatbot",
    title: "AI Chatbot Install",
    slug: "ai-chatbot-install",
    defaultWhy: "Captures and qualifies leads 24/7 when your team is unavailable.",
    defaultAction: "Install an always-on assistant for first response and qualification.",
  },
  crm: {
    id: "crm",
    title: "CRM Setup",
    slug: "crm-setup",
    defaultWhy: "Prevents lead leakage by enforcing pipeline ownership.",
    defaultAction: "Deploy stage tracking so every enquiry has a next action.",
  },
  followUp: {
    id: "followUp",
    title: "Follow-up Automation",
    slug: "follow-up-automation",
    defaultWhy: "Stops warm leads cooling after first contact.",
    defaultAction: "Automate first touch, reminders, and reactivation sequences.",
  },
  callRecovery: {
    id: "callRecovery",
    title: "Call Tracking + Missed Call Capture",
    slug: "call-tracking-missed-call-capture",
    defaultWhy: "Recovers lost inbound demand from unanswered calls.",
    defaultAction: "Route missed calls into instant text-back and callback workflows.",
  },
  booking: {
    id: "booking",
    title: "Booking System Setup",
    slug: "booking-system-setup",
    defaultWhy: "Shortens the path from interest to confirmed booking.",
    defaultAction: "Install booking paths with reminders to reduce no-shows.",
  },
  whatsapp: {
    id: "whatsapp",
    title: "WhatsApp Business Setup",
    slug: "whatsapp-business-setup",
    defaultWhy: "Opens a fast-response channel for high-intent prospects.",
    defaultAction: "Add WhatsApp contact and response templates across high-intent pages.",
  },
  ads: {
    id: "ads",
    title: "Ads Launch Pack",
    slug: "ads-launch-pack",
    defaultWhy: "Adds controlled demand capture once conversion foundations are ready.",
    defaultAction: "Launch focused traffic campaigns tied to conversion-ready pages.",
  },
  analytics: {
    id: "analytics",
    title: "Tracking & Analytics Layer",
    fallbackHref: "/services#tracking-analytics",
    defaultWhy: "Shows exactly where revenue is leaking by source and stage.",
    defaultAction: "Instrument key events and reporting so optimisation is measurable.",
  },
};

function priorityPhase(index: number): PlanPhase {
  if (index <= 1) {
    return "Day 1-3";
  }
  if (index <= 3) {
    return "Day 4-7";
  }
  return "Day 8-14";
}

function getModuleDetails(definition: ModuleDefinition) {
  if (definition.slug) {
    const service = services.find((item) => item.slug === definition.slug);
    if (service) {
      return {
        href: `/services/${definition.slug}`,
        title: service.title,
        priceLabel: service.entryPrice || "From £399",
      };
    }
  }

  return {
    href: definition.fallbackHref || "/services",
    title: definition.title,
    priceLabel: "From £399",
  };
}

function addCandidate(
  candidates: Array<{ key: string; priority: number; why?: string; action?: string }>,
  key: string,
  priority: number,
  why?: string,
  action?: string,
) {
  candidates.push({ key, priority, why, action });
}

export function mapRecommendedModules({
  speedScore,
  seoScore,
  conversionScore,
  trustScore,
  leakTypes,
  industry,
  goal,
}: ModuleMapInput): ModuleRecommendation[] {
  const industryLower = (industry || "").toLowerCase();
  const goalLower = (goal || "").toLowerCase();
  const isEcom = /(ecom|e-commerce|shop|store|retail|d2c)/.test(industryLower);
  const isLocalOrService = /(local|service|trade|clinic|medical|dent|estate|beauty|plumb|electric)/.test(industryLower);
  const focusesLeads = /(lead|enquir|inbound|contact)/.test(goalLower);
  const focusesSales = /(sale|sales|checkout|order|revenue|pricing)/.test(goalLower);

  const candidates: Array<{ key: string; priority: number; why?: string; action?: string }> = [];

  if (speedScore < 60) {
    addCandidate(candidates, "websitePro", 98, "Raises site speed and improves first-page conversion momentum.");
  }
  if (seoScore < 62) {
    addCandidate(candidates, "seoSprint", 96, "Targets higher-intent traffic that is more likely to book.");
  }
  if (conversionScore < 60) {
    addCandidate(candidates, "websitePro", 95, "Sharpens above-the-fold offer and call-to-action clarity.");
    addCandidate(candidates, "booking", 90, "Cuts friction between enquiry and confirmed booking.");
  }
  if (trustScore < 60) {
    addCandidate(candidates, "chatbot", 88, "Maintains instant response coverage and buyer confidence.");
  }

  if (isLocalOrService) {
    addCandidate(candidates, "callRecovery", 94, "Recovers missed-call enquiries before competitors respond.");
    addCandidate(candidates, "whatsapp", 86, "Lets urgent prospects contact you in one tap.");
  }

  if (isEcom) {
    addCandidate(candidates, "ads", 90, "Scales demand after conversion and checkout improvements are in place.");
    addCandidate(candidates, "followUp", 86, "Recovers drop-offs with lifecycle and cart follow-up.");
  }

  if (focusesLeads) {
    addCandidate(candidates, "crm", 92, "Ensures every lead is assigned, tracked, and followed up.");
    addCandidate(candidates, "followUp", 89, "Protects warm leads with consistent response automation.");
  }

  if (focusesSales) {
    addCandidate(candidates, "booking", 91, "Turns interest into booked buying conversations faster.");
    addCandidate(candidates, "websitePro", 88, "Improves offer and pricing communication to lift close rate.");
  }

  if (leakTypes.some((type) => type.includes("seo"))) {
    addCandidate(candidates, "seoSprint", 84);
  }
  if (leakTypes.some((type) => type.includes("conversion"))) {
    addCandidate(candidates, "websitePro", 83);
  }
  if (leakTypes.some((type) => type.includes("speed"))) {
    addCandidate(candidates, "websitePro", 82);
  }
  if (leakTypes.some((type) => type.includes("trust"))) {
    addCandidate(candidates, "chatbot", 81);
  }

  addCandidate(candidates, "analytics", 74);
  addCandidate(candidates, "crm", 73);
  addCandidate(candidates, "websiteStarter", 70);

  const deduped = new Map<string, { key: string; priority: number; why?: string; action?: string }>();
  for (const candidate of candidates) {
    const current = deduped.get(candidate.key);
    if (!current || current.priority < candidate.priority) {
      deduped.set(candidate.key, candidate);
    }
  }

  const ordered = [...deduped.values()].sort((a, b) => b.priority - a.priority).slice(0, 6);
  while (ordered.length < 4) {
    for (const fallback of ["websitePro", "seoSprint", "crm", "followUp"]) {
      if (!ordered.some((item) => item.key === fallback)) {
        ordered.push({ key: fallback, priority: 50 });
      }
      if (ordered.length >= 4) {
        break;
      }
    }
  }

  return ordered.slice(0, 6).map((item, index) => {
    const definition = moduleDefinitions[item.key];
    const details = getModuleDetails(definition);
    return {
      id: definition.id,
      title: details.title,
      why: item.why || definition.defaultWhy,
      action: item.action || definition.defaultAction,
      href: details.href,
      phase: priorityPhase(index),
      priceLabel: details.priceLabel,
    };
  });
}
