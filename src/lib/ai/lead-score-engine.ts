import { isPrismaReady, prisma } from "@/lib/db/prisma";

type JsonRecord = Record<string, unknown>;

type LeadScoreCategory = "hot" | "warm" | "cold";

export type LeadScoreResult = {
  score: number;
  category: LeadScoreCategory;
  reasons: string[];
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

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function parseCurrencyRangeToHigh(value: string) {
  const matches = value.match(/\d[\d,]*/g);
  if (!matches?.length) return null;
  const numbers = matches
    .map((item) => Number(item.replace(/,/g, "")))
    .filter((item) => Number.isFinite(item));
  if (!numbers.length) return null;
  return Math.max(...numbers);
}

function toCategory(score: number): LeadScoreCategory {
  if (score >= 85) return "hot";
  if (score >= 55) return "warm";
  return "cold";
}

function uniq<T>(values: T[]) {
  return [...new Set(values)];
}

export async function calculateLeadScore(leadId: string): Promise<LeadScoreResult> {
  if (!isPrismaReady()) {
    throw new Error("Database is not configured.");
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      auditRuns: {
        orderBy: { updatedAt: "desc" },
        take: 6,
      },
      simulatorRuns: {
        orderBy: { updatedAt: "desc" },
        take: 6,
      },
      generatedMessages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      events: {
        orderBy: { createdAt: "desc" },
        take: 300,
      },
    },
  });

  if (!lead) {
    throw new Error("Lead not found.");
  }

  let score = 0;
  const reasons: string[] = [];

  const auditRuns = lead.auditRuns.length;
  if (auditRuns > 0) {
    const points = clamp(16 + (auditRuns - 1) * 3, 0, 24);
    score += points;
    reasons.push(`${auditRuns} audit run${auditRuns > 1 ? "s" : ""} completed (+${points})`);
  } else {
    reasons.push("No completed audit run yet (+0)");
  }

  const simulatorRuns = lead.simulatorRuns.length;
  if (simulatorRuns > 0) {
    const points = clamp(12 + (simulatorRuns - 1) * 4, 0, 20);
    score += points;
    reasons.push(`${simulatorRuns} simulator run${simulatorRuns > 1 ? "s" : ""} completed (+${points})`);
  }

  const eventTypeCount = lead.events.reduce<Record<string, number>>((accumulator, event) => {
    accumulator[event.type] = (accumulator[event.type] || 0) + 1;
    return accumulator;
  }, {});

  const pdfDownloads = eventTypeCount.pdf_downloaded || 0;
  if (pdfDownloads > 0) {
    const points = clamp(pdfDownloads * 5, 0, 12);
    score += points;
    reasons.push(`${pdfDownloads} PDF download${pdfDownloads > 1 ? "s" : ""} (+${points})`);
  }

  const moduleClicks = eventTypeCount.module_clicked || 0;
  if (moduleClicks > 0) {
    const points = clamp(moduleClicks * 2, 0, 10);
    score += points;
    reasons.push(`${moduleClicks} module click${moduleClicks > 1 ? "s" : ""} (+${points})`);
  }

  const activityDays = uniq(
    lead.events
      .map((event) => event.createdAt.toISOString().slice(0, 10))
      .concat(lead.auditRuns.map((run) => run.createdAt.toISOString().slice(0, 10)))
      .concat(lead.simulatorRuns.map((run) => run.createdAt.toISOString().slice(0, 10))),
  ).length;
  const repeatVisits = Math.max(0, activityDays - 1);
  if (repeatVisits > 0) {
    const points = clamp(repeatVisits * 2, 0, 10);
    score += points;
    reasons.push(`${repeatVisits} repeat visit signal${repeatVisits > 1 ? "s" : ""} (+${points})`);
  }

  const latestSimulator = lead.simulatorRuns[0] || null;
  const simulatorOutputs = asRecord(latestSimulator?.outputs);
  const scenarioRevenue = Array.isArray(simulatorOutputs?.scenarios)
    ? simulatorOutputs.scenarios
        .map((scenario) => asRecord(scenario))
        .filter((scenario): scenario is JsonRecord => Boolean(scenario))
        .map((scenario) => asNumber(scenario.projectedRevenueDelta))
        .filter((value): value is number => typeof value === "number" && value > 0)
    : [];

  let estimatedRevenueGain = scenarioRevenue.length ? Math.max(...scenarioRevenue) : 0;

  const latestGenerated = lead.generatedMessages[0] || null;
  if (latestGenerated && estimatedRevenueGain === 0) {
    const parsed = parseCurrencyRangeToHigh(latestGenerated.estimatedRevenueGain);
    if (parsed) {
      estimatedRevenueGain = parsed;
    }
  }

  if (estimatedRevenueGain > 0) {
    const points =
      estimatedRevenueGain >= 12000
        ? 18
        : estimatedRevenueGain >= 7000
          ? 14
          : estimatedRevenueGain >= 3000
            ? 10
            : 6;
    score += points;
    reasons.push(`estimated revenue gain around £${Math.round(estimatedRevenueGain).toLocaleString("en-GB")} (+${points})`);
  }

  const businessSizeSignals = [
    typeof latestSimulator?.visitors === "number" && latestSimulator.visitors >= 6000 ? 6 : 0,
    typeof latestSimulator?.avgOrderValue === "number" && latestSimulator.avgOrderValue >= 400 ? 4 : 0,
    lead.businessName?.trim().length >= 3 ? 1 : 0,
    (lead.website || lead.websiteUrl || "").length > 0 ? 1 : 0,
  ].reduce((total, value) => total + value, 0);
  if (businessSizeSignals > 0) {
    const points = clamp(businessSizeSignals, 0, 10);
    score += points;
    reasons.push(`business size and data richness signals (+${points})`);
  }

  const latestAudit = lead.auditRuns[0] || null;
  const auditScores = asRecord(latestAudit?.scoresJson);
  const auditOverall = asNumber(auditScores?.overall);
  const urgencyText = (latestGenerated?.urgencyFactor || "").toLowerCase();
  let urgencyPoints = 0;

  if (urgencyText.includes("high urgency")) {
    urgencyPoints = 12;
  } else if (urgencyText.includes("medium urgency")) {
    urgencyPoints = 8;
  } else if (urgencyText.includes("focused urgency")) {
    urgencyPoints = 4;
  } else if (typeof auditOverall === "number") {
    urgencyPoints = auditOverall < 50 ? 12 : auditOverall < 75 ? 8 : 4;
  }

  if (urgencyPoints > 0) {
    score += urgencyPoints;
    reasons.push(`urgency factor indicates active buying window (+${urgencyPoints})`);
  }

  const now = Date.now();
  const lastSeen = lead.lastSeenAt?.getTime() || lead.updatedAt.getTime();
  const daysSinceSeen = Math.floor((now - lastSeen) / (1000 * 60 * 60 * 24));
  if (daysSinceSeen <= 3) {
    score += 6;
    reasons.push("recent activity in last 72 hours (+6)");
  } else if (daysSinceSeen <= 7) {
    score += 3;
    reasons.push("active in last 7 days (+3)");
  }

  const clamped = clamp(Math.round(score));
  const category = toCategory(clamped);

  return {
    score: clamped,
    category,
    reasons: reasons.slice(0, 8),
  };
}
