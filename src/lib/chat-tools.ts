import { industries, services } from "@/data";
import { findIndustryByName } from "@/lib/knowledge";
import { normalizeLeadPayload, submitLead, validateLeadPayload } from "@/lib/lead";

export type AssetProfile = {
  industry?: string;
  monthlyRevenue?: number;
  monthlyLeads?: number;
  blocker?: string;
};

export type ConsultationSlot = {
  preferredDate?: string;
  preferredTime?: string;
  channel?: "phone" | "google-meet" | "zoom" | "whatsapp";
  notes?: string;
};

export type SaveLeadInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  budgetRange?: string;
  timeline?: string;
  message?: string;
  industry?: string;
  monthlyRevenue?: number;
  monthlyLeads?: number;
};

export async function saveLead(details: SaveLeadInput) {
  const normalised = normalizeLeadPayload({
    ...details,
    source: "chatbot",
  });

  const validation = validateLeadPayload(normalised, false);
  if (!validation.valid) {
    return {
      ok: false,
      leadCaptured: false,
      errors: validation.errors,
      message: "I still need valid name, email, phone, and company details before I can save your plan request.",
    };
  }

  const result = await submitLead(normalised);

  return {
    ok: result.success,
    leadCaptured: result.success,
    crmForwarded: result.crmForwarded,
    message:
      "Thanks, your details are saved. I can now map your 30-day action plan and route you to booking.",
  };
}

function scoreServiceMatch(serviceSlug: string, profile: AssetProfile, industryServiceSlugs: string[]) {
  let score = 0;

  if (industryServiceSlugs.includes(serviceSlug)) {
    score += 4;
  }

  const blocker = (profile.blocker || "").toLowerCase();

  if (blocker.includes("lead") && ["websites-in-72-hours", "seo-aeo", "ai-chatbots"].includes(serviceSlug)) {
    score += 3;
  }

  if (blocker.includes("follow") && ["automations-workflows", "crm-pipelines", "missed-call-recovery"].includes(serviceSlug)) {
    score += 3;
  }

  if (blocker.includes("booking") && ["booking-systems-reminders", "crm-pipelines"].includes(serviceSlug)) {
    score += 3;
  }

  if ((profile.monthlyLeads || 0) > 120 && ["crm-pipelines", "reporting-dashboards"].includes(serviceSlug)) {
    score += 2;
  }

  if ((profile.monthlyRevenue || 0) > 50000 && ["reporting-dashboards", "automations-workflows"].includes(serviceSlug)) {
    score += 2;
  }

  return score;
}

export function recommendAssets(profile: AssetProfile) {
  const industry = profile.industry ? findIndustryByName(profile.industry) : null;
  const preferredSlugs = industry?.recommendedServiceSlugs ?? [];

  const ranked = services
    .map((service) => ({
      slug: service.slug,
      title: service.title,
      reason: service.shortDescription,
      score: scoreServiceMatch(service.slug, profile, preferredSlugs),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => ({
      ...item,
      href: `/services/${item.slug}`,
    }));

  const keyLeaks = [
    "Slow first response and missed enquiry follow-up",
    "No structured conversion path from enquiry to booking",
    "Limited visibility on where revenue is leaking",
  ];

  if (profile.blocker?.toLowerCase().includes("traffic")) {
    keyLeaks[0] = "Traffic quality and intent mismatch at landing pages";
  }

  return {
    industry: industry?.name ?? profile.industry ?? "General SME",
    topLeaks: keyLeaks,
    recommendations: ranked,
  };
}

export function bookConsultation(slot: ConsultationSlot) {
  const params = new URLSearchParams();
  if (slot.preferredDate) {
    params.set("date", slot.preferredDate);
  }
  if (slot.preferredTime) {
    params.set("time", slot.preferredTime);
  }
  if (slot.channel) {
    params.set("channel", slot.channel);
  }

  return {
    ok: true,
    message: "Perfect. I have prepared your booking handoff. Please confirm your slot on the booking page.",
    bookingUrl: `/book${params.toString() ? `?${params.toString()}` : ""}`,
    nextStep: "Confirm slot and we will send your 30-day implementation plan.",
  };
}

export const chatToolDefinitions = [
  {
    type: "function" as const,
    name: "save_lead",
    description:
      "Save qualified lead details after collecting name, email, phone, company, website, budget, and timeline.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        company: { type: "string" },
        website: { type: "string" },
        budgetRange: { type: "string" },
        timeline: { type: "string" },
        message: { type: "string" },
        industry: { type: "string" },
        monthlyRevenue: { type: "number" },
        monthlyLeads: { type: "number" },
      },
      required: ["name", "email", "phone", "company"],
    },
  },
  {
    type: "function" as const,
    name: "recommend_assets",
    description:
      "Recommend the best digital assets/services based on industry profile, lead volume, revenue, and blocker.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        industry: { type: "string" },
        monthlyRevenue: { type: "number" },
        monthlyLeads: { type: "number" },
        blocker: { type: "string" },
      },
    },
  },
  {
    type: "function" as const,
    name: "book_consultation",
    description: "Create a booking handoff link when the user agrees to a strategy call.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredDate: { type: "string" },
        preferredTime: { type: "string" },
        channel: {
          type: "string",
          enum: ["phone", "google-meet", "zoom", "whatsapp"],
        },
        notes: { type: "string" },
      },
    },
  },
];

export async function runChatTool(name: string, args: Record<string, unknown>) {
  if (name === "save_lead") {
    return saveLead(args as SaveLeadInput);
  }

  if (name === "recommend_assets") {
    return recommendAssets(args as AssetProfile);
  }

  if (name === "book_consultation") {
    return bookConsultation(args as ConsultationSlot);
  }

  return {
    ok: false,
    message: `Unknown tool: ${name}`,
  };
}

export function listIndustryNames() {
  return industries.map((industry) => industry.name);
}
