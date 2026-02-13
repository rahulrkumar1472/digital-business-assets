export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  message?: string;
  budgetRange?: string;
  timeline?: string;
  industry?: string;
  monthlyRevenue?: number;
  monthlyLeads?: number;
  source?: string;
  meta?: Record<string, string | number | boolean | null | undefined>;
};

export type LeadSubmissionResult = {
  success: boolean;
  crmForwarded: boolean;
  message: string;
};

type LeadValidationOptions = {
  requireMessage?: boolean;
  requireEmail?: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s-]{7,22}$/;

function cleanString(input: unknown, max = 240) {
  if (typeof input !== "string") {
    return "";
  }

  return input.trim().slice(0, max);
}

function cleanOptionalNumber(input: unknown) {
  if (typeof input === "number" && Number.isFinite(input)) {
    return input;
  }

  if (typeof input === "string") {
    const parsed = Number(input);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

export function normalizeLeadPayload(payload: unknown): LeadPayload {
  const data = (payload ?? {}) as Record<string, unknown>;

  return {
    name: cleanString(data.name, 120),
    email: cleanString(data.email, 180).toLowerCase(),
    phone: cleanString(data.phone, 40),
    company: cleanString(data.company, 140),
    website: cleanString(data.website, 200),
    message: cleanString(data.message, 2000),
    budgetRange: cleanString(data.budgetRange, 120),
    timeline: cleanString(data.timeline, 120),
    industry: cleanString(data.industry, 120),
    monthlyRevenue: cleanOptionalNumber(data.monthlyRevenue),
    monthlyLeads: cleanOptionalNumber(data.monthlyLeads),
    source: cleanString(data.source, 120),
    meta: typeof data.meta === "object" && data.meta !== null ? (data.meta as LeadPayload["meta"]) : undefined,
  };
}

export function validateLeadPayload(payload: LeadPayload, options: boolean | LeadValidationOptions = false) {
  const resolved: Required<LeadValidationOptions> =
    typeof options === "boolean"
      ? { requireMessage: options, requireEmail: true }
      : {
          requireMessage: options.requireMessage ?? false,
          requireEmail: options.requireEmail ?? true,
        };
  const errors: string[] = [];

  if (!payload.name) {
    errors.push("Name is required.");
  }

  if (resolved.requireEmail) {
    if (!payload.email || !emailPattern.test(payload.email)) {
      errors.push("A valid email is required.");
    }
  } else if (payload.email && !emailPattern.test(payload.email)) {
    errors.push("Please provide a valid email address or leave it blank.");
  }

  if (!payload.phone || !phonePattern.test(payload.phone)) {
    errors.push("A valid phone number is required.");
  }

  if (!payload.company) {
    errors.push("Company is required.");
  }

  if (payload.website && !/^https?:\/\//.test(payload.website)) {
    errors.push("Website must start with http:// or https://.");
  }

  if (resolved.requireMessage && (!payload.message || payload.message.length < 20)) {
    errors.push("Message must contain at least 20 characters.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function submitLead(payload: LeadPayload): Promise<LeadSubmissionResult> {
  const lead = {
    ...payload,
    source: payload.source || "website",
    submittedAt: new Date().toISOString(),
  };

  console.info("[lead] captured", lead);

  const webhook = process.env.CRM_WEBHOOK_URL;
  if (!webhook) {
    return {
      success: true,
      crmForwarded: false,
      message: "Lead captured locally. CRM webhook is not configured.",
    };
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(7000),
    });

    if (!response.ok) {
      const snippet = await response.text();
      console.error("[lead] webhook failed", response.status, snippet.slice(0, 300));
      return {
        success: false,
        crmForwarded: false,
        message: "Lead captured, but CRM forwarding failed.",
      };
    }

    return {
      success: true,
      crmForwarded: true,
      message: "Lead captured and forwarded to CRM.",
    };
  } catch (error) {
    console.error("[lead] webhook error", error);
    return {
      success: false,
      crmForwarded: false,
      message: "Lead captured, but webhook forwarding failed due to a network error.",
    };
  }
}
