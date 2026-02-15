import { isPrismaReady, prisma } from "@/lib/db/prisma";

type JsonRecord = Record<string, unknown>;

export type LeadVaultRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  url: string;
  source: string;
  overallScore: number | null;
  leadScore: number;
  leadTemperature: "hot" | "warm" | "cold";
  lastSeen: Date;
  intentTier: string;
  nextAction: string;
  reportHref: string;
};

export type LeadVaultDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  url: string;
  source: string;
  reportHref: string;
  createdAt: Date;
  lastSeen: Date;
  leadScore: number;
  leadTemperature: "hot" | "warm" | "cold";
  intentTier: string;
  nextAction: string;
  status: string;
  notes: string;
  latestAudit: {
    overallScore: number | null;
    scores: JsonRecord | null;
    topFindings: Array<{ label: string; category: string; status: string; fix?: string }>;
  } | null;
  latestSimulator: {
    summaryScore: number | null;
    scenarios: Array<{
      label: string;
      conversionUpliftPct: number;
      projectedRevenueDelta: number;
    }>;
    topMoves: Array<{ title: string; upliftLowPct: number; upliftHighPct: number; timeToImpact: string }>;
  } | null;
  timeline: Array<{
    id: string;
    type: string;
    createdAt: Date;
    payload: JsonRecord | null;
  }>;
  automationActivity: {
    lastActions: Array<{
      id: string;
      type: string;
      createdAt: Date;
      payload: JsonRecord | null;
    }>;
    pendingTasks: Array<{
      id: string;
      type: string;
      priority: string;
      status: string;
      createdAt: Date;
    }>;
    completedTasks: Array<{
      id: string;
      type: string;
      priority: string;
      status: string;
      createdAt: Date;
    }>;
  };
  latestPortalSession: {
    token: string;
    expiresAt: Date;
    href: string;
  } | null;
};

type AnalyticsSummary = {
  leadsPerDay: number;
  leadCount30d: number;
  auditCompletionRate: number;
  pdfDownloadRate: number;
  moduleClickRate: number;
  simulatorCompletionRate: number;
  topIndustries: Array<{ label: string; count: number }>;
  topWeakestStages: Array<{ label: string; count: number }>;
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

function coerceString(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
}

function toLeadName(lead: {
  fullName: string;
  name: string | null;
  businessName: string;
}) {
  return lead.name || lead.fullName || lead.businessName || "Unknown";
}

function computeOverallScore(params: {
  auditScoresJson: unknown;
  simulatorOutputs: unknown;
}) {
  const auditScores = asRecord(params.auditScoresJson);
  const simulatorOutputs = asRecord(params.simulatorOutputs);

  const auditOverall = asNumber(auditScores?.overall);
  if (auditOverall !== null) {
    return Math.round(auditOverall);
  }

  const simulatorOverall = asNumber(simulatorOutputs?.summaryScore);
  if (simulatorOverall !== null) {
    return Math.round(simulatorOverall);
  }

  return null;
}

function buildReportHref(url: string) {
  if (!url) {
    return "/tools/website-audit/start";
  }
  return `/tools/website-audit/results?url=${encodeURIComponent(url)}`;
}

function normalizeTemperature(value: string | null | undefined): "hot" | "warm" | "cold" {
  const normalized = (value || "").trim().toLowerCase();
  if (normalized === "hot") return "hot";
  if (normalized === "warm") return "warm";
  return "cold";
}

function toTemperatureFromScore(score: number): "hot" | "warm" | "cold" {
  if (score >= 85) return "hot";
  if (score >= 55) return "warm";
  return "cold";
}

function extractTopFindings(snapshotJson: unknown) {
  const snapshot = asRecord(snapshotJson);
  const findings = Array.isArray(snapshot?.topFindings) ? snapshot.topFindings : [];
  return findings
    .slice(0, 10)
    .map((finding) => asRecord(finding))
    .filter((finding): finding is JsonRecord => Boolean(finding))
    .map((finding) => ({
      label: coerceString(finding.label, "Unknown finding"),
      category: coerceString(finding.category, "Unknown"),
      status: coerceString(finding.status, "amber"),
      fix: typeof finding.fix === "string" ? finding.fix : undefined,
    }));
}

function extractLatestSimulator(outputsJson: unknown) {
  const outputs = asRecord(outputsJson);
  if (!outputs) {
    return null;
  }

  const scenariosRaw = Array.isArray(outputs.scenarios) ? outputs.scenarios : [];
  const topMovesRaw = Array.isArray(outputs.topMoves) ? outputs.topMoves : [];

  return {
    summaryScore: asNumber(outputs.summaryScore),
    scenarios: scenariosRaw
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => Boolean(item))
      .slice(0, 3)
      .map((item) => ({
        label: coerceString(item.label, "Scenario"),
        conversionUpliftPct: asNumber(item.conversionUpliftPct) || 0,
        projectedRevenueDelta: asNumber(item.projectedRevenueDelta) || 0,
      })),
    topMoves: topMovesRaw
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => Boolean(item))
      .slice(0, 5)
      .map((item) => ({
        title: coerceString(item.title, "Recommended action"),
        upliftLowPct: asNumber(item.upliftLowPct) || 0,
        upliftHighPct: asNumber(item.upliftHighPct) || 0,
        timeToImpact: coerceString(item.timeToImpact, "1-2 weeks"),
      })),
  };
}

export async function listLeadVaultRows(sortBy: "score" | "recent" = "score"): Promise<LeadVaultRow[]> {
  if (!isPrismaReady()) {
    return [];
  }

  const leads = await prisma.lead.findMany({
    orderBy:
      sortBy === "score"
        ? [{ leadScore: "desc" }, { lastSeenAt: "desc" }, { updatedAt: "desc" }]
        : [{ lastSeenAt: "desc" }, { updatedAt: "desc" }],
    include: {
      auditRuns: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
      simulatorRuns: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
      events: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    take: 250,
  });

  const rows = leads.map((lead) => {
    const latestAudit = lead.auditRuns[0];
    const latestSimulator = lead.simulatorRuns[0];
    const latestEvent = lead.events[0];
    const lastSeen =
      lead.lastSeenAt || latestEvent?.createdAt || latestSimulator?.updatedAt || latestAudit?.updatedAt || lead.updatedAt;
    const overallScore = computeOverallScore({
      auditScoresJson: latestAudit?.scoresJson,
      simulatorOutputs: latestSimulator?.outputs,
    });
    const storedLeadScore = typeof lead.leadScore === "number" ? lead.leadScore : null;
    const resolvedLeadScore = Math.max(0, Math.min(100, storedLeadScore ?? overallScore ?? 0));
    const leadTemperature = storedLeadScore === null ? toTemperatureFromScore(resolvedLeadScore) : normalizeTemperature(lead.leadTemperature);

    return {
      id: lead.id,
      name: toLeadName(lead),
      email: lead.email || "—",
      phone: lead.phone || lead.mobileNumber || "—",
      url: lead.website || lead.websiteUrl || "—",
      source: lead.source || "unknown",
      overallScore,
      leadScore: resolvedLeadScore,
      leadTemperature,
      lastSeen,
      intentTier: lead.intentTier || "Warm",
      nextAction: lead.nextAction || "Review and route to owner",
      reportHref: buildReportHref(lead.website || lead.websiteUrl),
    };
  });

  if (sortBy === "score") {
    rows.sort((a, b) => b.leadScore - a.leadScore || b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  return rows;
}

export async function getLeadVaultDetail(id: string): Promise<LeadVaultDetail | null> {
  if (!isPrismaReady()) {
    return null;
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      auditRuns: {
        orderBy: { updatedAt: "desc" },
        take: 8,
      },
      simulatorRuns: {
        orderBy: { updatedAt: "desc" },
        take: 8,
      },
      events: {
        orderBy: { createdAt: "desc" },
        take: 300,
      },
      automationTasks: {
        orderBy: { createdAt: "desc" },
        take: 120,
      },
      portalSessions: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!lead) {
    return null;
  }

  const latestAudit = lead.auditRuns[0];
  const latestSimulator = lead.simulatorRuns[0];
  const latestEvent = lead.events[0];
  const latestPortalSession = lead.portalSessions[0];
  const lastActions = lead.events
    .filter((event) => ["auto_followup_triggered", "ai_follow_up_generated", "lead_scored"].includes(event.type))
    .slice(0, 12)
    .map((event) => ({
      id: event.id,
      type: event.type,
      createdAt: event.createdAt,
      payload: asRecord(event.payloadJson),
    }));
  const pendingTasks = lead.automationTasks
    .filter((task) => !["completed", "done", "cancelled"].includes(task.status.toLowerCase()))
    .slice(0, 12)
    .map((task) => ({
      id: task.id,
      type: task.type,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
    }));
  const completedTasks = lead.automationTasks
    .filter((task) => ["completed", "done"].includes(task.status.toLowerCase()))
    .slice(0, 12)
    .map((task) => ({
      id: task.id,
      type: task.type,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
    }));

  return {
    id: lead.id,
    name: toLeadName(lead),
    email: lead.email || "",
    phone: lead.phone || lead.mobileNumber || "",
    businessName: lead.businessName || "",
    url: lead.website || lead.websiteUrl || "",
    source: lead.source || "unknown",
    reportHref: buildReportHref(lead.website || lead.websiteUrl),
    createdAt: lead.createdAt,
    lastSeen:
      lead.lastSeenAt || latestEvent?.createdAt || latestSimulator?.updatedAt || latestAudit?.updatedAt || lead.updatedAt,
    leadScore: Math.max(0, Math.min(100, lead.leadScore ?? 0)),
    leadTemperature: normalizeTemperature(lead.leadTemperature),
    intentTier: lead.intentTier || "Warm",
    nextAction: lead.nextAction || "",
    status: lead.status || "New",
    notes: lead.notes || "",
    latestAudit: latestAudit
      ? {
          overallScore: asNumber(asRecord(latestAudit.scoresJson)?.overall),
          scores: asRecord(latestAudit.scoresJson),
          topFindings: extractTopFindings(latestAudit.snapshotJson),
        }
      : null,
    latestSimulator: latestSimulator ? extractLatestSimulator(latestSimulator.outputs) : null,
    timeline: lead.events.map((event) => ({
      id: event.id,
      type: event.type,
      createdAt: event.createdAt,
      payload: asRecord(event.payloadJson),
    })),
    automationActivity: {
      lastActions,
      pendingTasks,
      completedTasks,
    },
    latestPortalSession: latestPortalSession
      ? {
          token: latestPortalSession.token,
          expiresAt: latestPortalSession.expiresAt,
          href: `/portal/${latestPortalSession.token}`,
        }
      : null,
  };
}

function percentage(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

export async function getLeadVaultAnalytics(): Promise<AnalyticsSummary> {
  if (!isPrismaReady()) {
    return {
      leadsPerDay: 0,
      leadCount30d: 0,
      auditCompletionRate: 0,
      pdfDownloadRate: 0,
      moduleClickRate: 0,
      simulatorCompletionRate: 0,
      topIndustries: [],
      topWeakestStages: [],
    };
  }

  const since30d = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const since90d = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);

  const [leadCount30d, events30d, industries, simulatorRuns] = await Promise.all([
    prisma.lead.count({
      where: { createdAt: { gte: since30d } },
    }),
    prisma.event.findMany({
      where: { createdAt: { gte: since30d } },
      select: { type: true },
    }),
    prisma.simulatorRun.groupBy({
      by: ["industry"],
      _count: { industry: true },
      where: { createdAt: { gte: since90d } },
      orderBy: { _count: { industry: "desc" } },
      take: 6,
    }),
    prisma.simulatorRun.findMany({
      where: { createdAt: { gte: since90d } },
      select: { outputs: true },
      take: 500,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const started = events30d.filter((event) => event.type === "audit_started").length;
  const completed = events30d.filter((event) => event.type === "audit_completed").length;
  const pdf = events30d.filter((event) => event.type === "pdf_downloaded").length;
  const moduleClick = events30d.filter((event) => event.type === "module_clicked").length;
  const simulatorStarted = events30d.filter((event) => event.type === "simulator_started").length;
  const simulatorCompleted = events30d.filter((event) => event.type === "simulator_completed").length;

  const weakestStageCount = new Map<string, number>();
  for (const run of simulatorRuns) {
    const outputs = asRecord(run.outputs);
    const funnel = asRecord(outputs?.funnel);
    const weakest = asRecord(funnel?.weakestStage);
    const label = coerceString(weakest?.label, "");
    if (!label) continue;
    weakestStageCount.set(label, (weakestStageCount.get(label) || 0) + 1);
  }

  return {
    leadsPerDay: Number((leadCount30d / 30).toFixed(2)),
    leadCount30d,
    auditCompletionRate: percentage(completed, started),
    pdfDownloadRate: percentage(pdf, completed),
    moduleClickRate: percentage(moduleClick, completed),
    simulatorCompletionRate: percentage(simulatorCompleted, simulatorStarted),
    topIndustries: industries.map((entry) => ({
      label: entry.industry,
      count: entry._count.industry,
    })),
    topWeakestStages: [...weakestStageCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, count]) => ({ label, count })),
  };
}
