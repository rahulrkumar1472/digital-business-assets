import { randomBytes } from "node:crypto";

import { isPrismaReady, prisma } from "@/lib/db/prisma";
import { siteConfig } from "@/lib/site";

const PORTAL_SESSION_HOURS = 24;
const MAX_SNAPSHOT_HISTORY = 20;

type JsonRecord = Record<string, unknown>;

export type PortalSessionLink = {
  token: string;
  expiresAt: Date;
  leadId: string;
  url: string;
};

export type PortalAuditSnapshotSummary = {
  id: string;
  auditRunId: string | null;
  createdAt: string;
  reportId: string;
  url: string;
  overallScore: number | null;
  scores: {
    overall: number | null;
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    customerExperience: number | null;
  };
  topFindings: Array<{
    label: string;
    category: string;
    status: string;
    fix?: string;
  }>;
  recommendedModules: Array<{
    title: string;
    href: string;
    why?: string;
    priceLabel?: string;
  }>;
};

export type PortalSimulatorSnapshotSummary = {
  id: string;
  simulatorRunId: string | null;
  createdAt: string;
  summaryScore: number | null;
  industry: string;
  goal: string;
  baselineRevenue: number | null;
  scenarios: Array<{
    label: string;
    projectedRevenueDelta: number;
    conversionUpliftPct: number;
  }>;
  topMoves: Array<{
    title: string;
    upliftLowPct: number;
    upliftHighPct: number;
    timeToImpact: string;
    href?: string;
  }>;
};

export type PortalSessionPayload = {
  session: {
    token: string;
    expiresAt: string;
    createdAt: string;
  };
  lead: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    businessName: string;
    website: string;
    source: string;
    createdAt: string;
    lastSeenAt: string | null;
  };
  latestAudit: PortalAuditSnapshotSummary | null;
  latestSimulator: PortalSimulatorSnapshotSummary | null;
  auditHistory: PortalAuditSnapshotSummary[];
  simulatorHistory: PortalSimulatorSnapshotSummary[];
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as JsonRecord;
}

function asString(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function toLeadName(lead: {
  name: string | null;
  fullName: string;
  businessName: string;
}) {
  return lead.name || lead.fullName || lead.businessName || "Business owner";
}

function toAuditSnapshot(snapshot: {
  id: string;
  createdAt: Date;
  auditRunId: string | null;
  snapshotJson: unknown;
}): PortalAuditSnapshotSummary {
  const data = asRecord(snapshot.snapshotJson) || {};
  const rawScores = asRecord(data.scores) || {};
  const rawDashboard = asRecord(data.dashboardScores) || {};
  const findings = Array.isArray(data.topFindings) ? data.topFindings : [];
  const modules = Array.isArray(data.recommendedModules) ? data.recommendedModules : [];

  return {
    id: snapshot.id,
    auditRunId: snapshot.auditRunId,
    createdAt: snapshot.createdAt.toISOString(),
    reportId: asString(data.reportId) || asString(data.generatedAt) || snapshot.id,
    url: asString(data.url, ""),
    overallScore: asNumber(rawScores.overall) ?? asNumber(rawDashboard.overall),
    scores: {
      overall: asNumber(rawScores.overall) ?? asNumber(rawDashboard.overall),
      performance: asNumber(rawScores.performance) ?? asNumber(rawDashboard.performance),
      seo: asNumber(rawScores.seo) ?? asNumber(rawDashboard.seo),
      accessibility: asNumber(rawScores.accessibility) ?? asNumber(rawDashboard.accessibility),
      bestPractices: asNumber(rawScores.bestPractices) ?? asNumber(rawDashboard.bestPractices),
      customerExperience: asNumber(rawScores.customerExperience) ?? asNumber(rawDashboard.customerExperience),
    },
    topFindings: findings
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => Boolean(item))
      .slice(0, 10)
      .map((item) => ({
        label: asString(item.label, "Finding"),
        category: asString(item.category, "Audit"),
        status: asString(item.status, "amber"),
        fix: asString(item.fix) || undefined,
      })),
    recommendedModules: modules
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => Boolean(item))
      .slice(0, 6)
      .map((item) => ({
        title: asString(item.title, "Module"),
        href: asString(item.href, "/services"),
        why: asString(item.why) || undefined,
        priceLabel: asString(item.priceLabel) || undefined,
      })),
  };
}

function toSimulatorSnapshot(snapshot: {
  id: string;
  createdAt: Date;
  simulatorRunId: string | null;
  snapshotJson: unknown;
}): PortalSimulatorSnapshotSummary {
  const data = asRecord(snapshot.snapshotJson) || {};
  const inputs = asRecord(data.inputs) || {};
  const outputs = asRecord(data.outputs) || {};
  const baseline = asRecord(outputs.baseline) || {};
  const scenariosRaw = Array.isArray(outputs.scenarios) ? outputs.scenarios : [];
  const movesRaw = Array.isArray(outputs.topMoves) ? outputs.topMoves : [];

  return {
    id: snapshot.id,
    simulatorRunId: snapshot.simulatorRunId,
    createdAt: snapshot.createdAt.toISOString(),
    summaryScore: asNumber(outputs.summaryScore),
    industry: asString(inputs.industry, "service"),
    goal: asString(inputs.goal, "more-leads"),
    baselineRevenue: asNumber(baseline.revenuePerMonth),
    scenarios: scenariosRaw
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => Boolean(item))
      .slice(0, 3)
      .map((item) => ({
        label: asString(item.label, "Scenario"),
        projectedRevenueDelta: asNumber(item.projectedRevenueDelta) || 0,
        conversionUpliftPct: asNumber(item.conversionUpliftPct) || 0,
      })),
    topMoves: movesRaw
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => Boolean(item))
      .slice(0, 5)
      .map((item) => ({
        title: asString(item.title, "Recommended move"),
        upliftLowPct: asNumber(item.upliftLowPct) || 0,
        upliftHighPct: asNumber(item.upliftHighPct) || 0,
        timeToImpact: asString(item.timeToImpact, "1-2 weeks"),
        href: asRecord(item.diy)?.href ? asString(asRecord(item.diy)?.href, "") : undefined,
      })),
  };
}

async function cleanupExpiredSessions() {
  try {
    await prisma.portalSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch {
    // best effort cleanup only
  }
}

export async function createPortalSessionForLeadId(leadId: string): Promise<PortalSessionLink | null> {
  if (!isPrismaReady()) {
    return null;
  }

  const normalizedLeadId = leadId.trim();
  if (!normalizedLeadId) {
    return null;
  }

  await cleanupExpiredSessions();

  const lead = await prisma.lead.findUnique({
    where: { id: normalizedLeadId },
    select: { id: true },
  });

  if (!lead) {
    return null;
  }

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + PORTAL_SESSION_HOURS * 60 * 60 * 1000);

  const session = await prisma.portalSession.create({
    data: {
      leadId: lead.id,
      token,
      expiresAt,
    },
    select: {
      token: true,
      expiresAt: true,
      leadId: true,
    },
  });

  return {
    token: session.token,
    expiresAt: session.expiresAt,
    leadId: session.leadId,
    url: `${siteConfig.url}/portal/${session.token}`,
  };
}

export async function createPortalSessionForEmail(email: string): Promise<PortalSessionLink | null> {
  if (!isPrismaReady()) {
    return null;
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  const lead = await prisma.lead.findFirst({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (!lead) {
    return null;
  }

  return createPortalSessionForLeadId(lead.id);
}

export async function getPortalSessionPayload(token: string): Promise<PortalSessionPayload | null> {
  if (!isPrismaReady()) {
    return null;
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return null;
  }

  await cleanupExpiredSessions();

  const session = await prisma.portalSession.findUnique({
    where: { token: trimmedToken },
    include: {
      lead: {
        include: {
          auditSnapshots: {
            orderBy: { createdAt: "desc" },
            take: MAX_SNAPSHOT_HISTORY,
          },
          simulatorSnapshots: {
            orderBy: { createdAt: "desc" },
            take: MAX_SNAPSHOT_HISTORY,
          },
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    return null;
  }

  const auditHistory = session.lead.auditSnapshots.map(toAuditSnapshot);
  const simulatorHistory = session.lead.simulatorSnapshots.map(toSimulatorSnapshot);

  return {
    session: {
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
    },
    lead: {
      id: session.lead.id,
      name: toLeadName(session.lead),
      email: session.lead.email,
      phone: session.lead.phone || session.lead.mobileNumber || null,
      businessName: session.lead.businessName,
      website: session.lead.website || session.lead.websiteUrl || "",
      source: session.lead.source || "unknown",
      createdAt: session.lead.createdAt.toISOString(),
      lastSeenAt: session.lead.lastSeenAt ? session.lead.lastSeenAt.toISOString() : null,
    },
    latestAudit: auditHistory[0] || null,
    latestSimulator: simulatorHistory[0] || null,
    auditHistory,
    simulatorHistory,
  };
}
