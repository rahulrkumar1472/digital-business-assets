import { isPrismaReady, prisma } from "@/lib/db/prisma";

type JsonRecord = Record<string, unknown>;

export type GeneratedFollowUpMessage = {
  leadId: string;
  auditRunId?: string;
  simulatorRunId?: string;
  domain: string;
  weakestFunnelStage: string;
  topFindings: [string, string, string];
  estimatedRevenueGain: string;
  urgencyFactor: string;
  emailVersion: string;
  whatsappVersion: string;
  smsVersion: string;
  callScriptVersion: string;
};

export type PersistedFollowUpMessage = {
  id: string;
  createdAt: Date;
  payload: GeneratedFollowUpMessage;
};

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as JsonRecord;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeUrl(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(withProtocol);
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return value;
  }
}

function toDomain(url: string) {
  const normalized = normalizeUrl(url);
  if (!normalized) return "your site";
  try {
    return new URL(normalized).hostname.replace(/^www\./i, "");
  } catch {
    return normalized;
  }
}

function formatCurrency(value: number) {
  return `£${Math.max(0, Math.round(value)).toLocaleString("en-GB")}`;
}

function padTopFindings(values: string[]): [string, string, string] {
  const cleaned = values.filter(Boolean).slice(0, 3);
  while (cleaned.length < 3) {
    cleaned.push("Speed-to-lead follow-up gap");
  }
  return [cleaned[0], cleaned[1], cleaned[2]];
}

function scoreFromContext(auditScores: JsonRecord | null, simulatorOutputs: JsonRecord | null) {
  const auditOverall = asNumber(auditScores?.overall);
  if (auditOverall !== null) return auditOverall;
  const simulatorOverall = asNumber(simulatorOutputs?.summaryScore);
  if (simulatorOverall !== null) return simulatorOverall;
  return 58;
}

function resolveUrgencyFactor(overallScore: number) {
  if (overallScore < 50) {
    return "High urgency: revenue is leaking weekly and delay compounds lost bookings.";
  }
  if (overallScore < 75) {
    return "Medium urgency: meaningful gains are available now, but delay lets competitors pull ahead.";
  }
  return "Focused urgency: performance is solid, but quick optimisation captures extra margin before demand shifts.";
}

function resolveRevenueGain(simulatorOutputs: JsonRecord | null, overallScore: number) {
  const scenarios = Array.isArray(simulatorOutputs?.scenarios) ? simulatorOutputs?.scenarios : [];
  const deltas = scenarios
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => Boolean(item))
    .map((item) => asNumber(item.projectedRevenueDelta))
    .filter((item): item is number => typeof item === "number" && item > 0);

  if (deltas.length >= 2) {
    const low = Math.min(...deltas);
    const high = Math.max(...deltas);
    return `${formatCurrency(low)}-${formatCurrency(high)} monthly upside`;
  }

  const fallbackLow = overallScore < 50 ? 2500 : overallScore < 70 ? 1500 : 800;
  const fallbackHigh = overallScore < 50 ? 7000 : overallScore < 70 ? 4200 : 2400;
  return `${formatCurrency(fallbackLow)}-${formatCurrency(fallbackHigh)} monthly upside`;
}

function resolveWeakestStage(simulatorOutputs: JsonRecord | null, topFindings: [string, string, string]) {
  const funnel = asRecord(simulatorOutputs?.funnel);
  const weakestStage = asRecord(funnel?.weakestStage);
  const label = typeof weakestStage?.label === "string" ? weakestStage.label.trim() : "";
  if (label) return label;

  const joined = topFindings.join(" ").toLowerCase();
  if (joined.includes("speed") || joined.includes("response") || joined.includes("follow-up")) {
    return "Speed to lead";
  }
  if (joined.includes("offer") || joined.includes("cta") || joined.includes("conversion")) {
    return "Conversion";
  }
  if (joined.includes("seo") || joined.includes("search")) {
    return "Acquisition";
  }
  return "Lead qualification";
}

export async function generateFollowUpMessage(leadId: string): Promise<GeneratedFollowUpMessage> {
  if (!isPrismaReady()) {
    throw new Error("Database is not configured.");
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      auditRuns: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
      simulatorRuns: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const latestAudit = lead.auditRuns[0] || null;
  const latestSimulator = lead.simulatorRuns[0] || null;

  const auditSnapshot = asRecord(latestAudit?.snapshotJson);
  const topFindingsRaw = Array.isArray(auditSnapshot?.topFindings)
    ? auditSnapshot.topFindings
        .map((finding) => asRecord(finding))
        .filter((finding): finding is JsonRecord => Boolean(finding))
        .map((finding) => {
          const label = typeof finding.label === "string" && finding.label.trim() ? finding.label.trim() : null;
          const fix = typeof finding.fix === "string" && finding.fix.trim() ? finding.fix.trim() : null;
          return label || fix;
        })
        .filter((value): value is string => Boolean(value))
    : [];

  const topFindings = padTopFindings(topFindingsRaw);
  const simulatorOutputs = asRecord(latestSimulator?.outputs);
  const auditScores = asRecord(latestAudit?.scoresJson);
  const overallScore = scoreFromContext(auditScores, simulatorOutputs);
  const estimatedRevenueGain = resolveRevenueGain(simulatorOutputs, overallScore);
  const weakestFunnelStage = resolveWeakestStage(simulatorOutputs, topFindings);
  const urgencyFactor = resolveUrgencyFactor(overallScore);

  const domain = toDomain(lead.website || lead.websiteUrl);
  const leadName = (lead.name || lead.fullName || "there").split(" ")[0];

  const findingsLine = `${topFindings[0]}; ${topFindings[1]}; ${topFindings[2]}`;
  const doneForYouUrl = `https://digitalbusinessassets.co.uk/bespoke-plan?leadId=${encodeURIComponent(lead.id)}&domain=${encodeURIComponent(domain)}`;
  const reportUrl = `https://digitalbusinessassets.co.uk/tools/website-audit/results?url=${encodeURIComponent(lead.website || lead.websiteUrl || domain)}`;

  const emailVersion = [
    `Subject: ${domain} growth follow-up: ${estimatedRevenueGain}`,
    "",
    `Hi ${leadName},`,
    "",
    `We reviewed ${domain}. The weakest funnel stage right now is ${weakestFunnelStage}.`,
    `Top 3 blockers: ${findingsLine}.`,
    `Estimated gain available: ${estimatedRevenueGain}.`,
    `${urgencyFactor}`,
    "",
    "If you want, we can deploy the fixes in priority order and track recovery week by week.",
    `Done-for-you plan: ${doneForYouUrl}`,
    `Re-open your report: ${reportUrl}`,
  ].join("\n");

  const whatsappVersion = [
    `Hi ${leadName} — quick update on ${domain}.`,
    `Weakest stage: ${weakestFunnelStage}.`,
    `Top blockers: ${findingsLine}.`,
    `Estimated upside: ${estimatedRevenueGain}.`,
    `${urgencyFactor}`,
    `Want us to implement this for you? ${doneForYouUrl}`,
  ].join("\n");

  const smsVersion = [
    `${domain}: weakest stage is ${weakestFunnelStage}.`,
    `Top issues: ${topFindings[0]}, ${topFindings[1]}, ${topFindings[2]}.`,
    `Estimated gain ${estimatedRevenueGain}.`,
    `${urgencyFactor.split(":")[0]}.`,
    `Plan: ${doneForYouUrl}`,
  ].join(" ");

  const callScriptVersion = [
    `1) Open: "Hi ${leadName}, this is Digital Business Assets. We reviewed ${domain} and found where revenue is leaking."`,
    `2) Diagnose: "Your weakest funnel stage is ${weakestFunnelStage}. We flagged 3 issues: ${findingsLine}."`,
    `3) Commercial impact: "This is likely worth ${estimatedRevenueGain} if fixed in order."`,
    `4) Urgency: "${urgencyFactor}"`,
    `5) Close: "Would you like us to deploy the fixes done-for-you this week?"`,
    `6) Link for confirmation: ${doneForYouUrl}`,
  ].join("\n");

  return {
    leadId: lead.id,
    auditRunId: latestAudit?.id,
    simulatorRunId: latestSimulator?.id,
    domain,
    weakestFunnelStage,
    topFindings,
    estimatedRevenueGain,
    urgencyFactor,
    emailVersion,
    whatsappVersion,
    smsVersion,
    callScriptVersion,
  };
}

export async function saveGeneratedFollowUpMessage(payload: GeneratedFollowUpMessage): Promise<PersistedFollowUpMessage> {
  if (!isPrismaReady()) {
    throw new Error("Database is not configured.");
  }

  const created = await prisma.generatedMessage.create({
    data: {
      leadId: payload.leadId,
      auditRunId: payload.auditRunId || null,
      simulatorRunId: payload.simulatorRunId || null,
      domain: payload.domain,
      weakestFunnelStage: payload.weakestFunnelStage,
      topFindings: payload.topFindings,
      estimatedRevenueGain: payload.estimatedRevenueGain,
      urgencyFactor: payload.urgencyFactor,
      emailVersion: payload.emailVersion,
      whatsappVersion: payload.whatsappVersion,
      smsVersion: payload.smsVersion,
      callScriptVersion: payload.callScriptVersion,
    },
  });

  return {
    id: created.id,
    createdAt: created.createdAt,
    payload,
  };
}
