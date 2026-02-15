import { Prisma } from "@prisma/client";

import { isPrismaReady, prisma } from "@/lib/db/prisma";
import type { AuditResult } from "@/lib/scans/audit-types";

type UpsertAuditRunInput = {
  reportId: string;
  url: string;
  leadId?: string;
  auditRunId?: string;
  audit: AuditResult;
};

type LogEventInput = {
  type:
    | "audit_started"
    | "audit_completed"
    | "pdf_downloaded"
    | "module_clicked"
    | "simulator_opened"
    | "simulator_started"
    | "simulator_completed"
    | "simulator_action_clicked"
    | "simulator_bespoke_plan_clicked"
    | "book_call_clicked";
  payload?: Record<string, unknown>;
  leadId?: string;
  auditRunId?: string;
  simulatorRunId?: string;
};

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (typeof value === "undefined") {
    return undefined;
  }
  return value as Prisma.InputJsonValue;
}

export async function upsertAuditRun(input: UpsertAuditRunInput) {
  if (!isPrismaReady()) {
    return null;
  }

  try {
    const now = new Date();
    const existing =
      (input.auditRunId
        ? await prisma.auditRun.findUnique({
            where: { id: input.auditRunId },
          })
        : null) ||
      (await prisma.auditRun.findFirst({
        where: {
          reportId: input.reportId,
        },
      }));

    const scoresJson = {
      overall: input.audit.scores.overall,
      performance: input.audit.dashboardScores.performance,
      seo: input.audit.dashboardScores.seo,
      accessibility: input.audit.dashboardScores.accessibility,
      bestPractices: input.audit.dashboardScores.bestPractices,
      customerExperience: input.audit.dashboardScores.customerExperience,
      contentClarity: input.audit.pillars.contentClarity,
      trustAuthority: input.audit.pillars.trustAuthority,
    };

    if (existing) {
      return prisma.auditRun.update({
        where: { id: existing.id },
        data: {
          url: input.url,
          leadId: input.leadId || existing.leadId,
          scoresJson: toJson(scoresJson),
          updatedAt: now,
        },
      });
    }

    return prisma.auditRun.create({
      data: {
        url: input.url,
        leadId: input.leadId || null,
        reportId: input.reportId,
        scoresJson: toJson(scoresJson) as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error("[audit-tracking] upsert audit run failed", error);
    return null;
  }
}

export async function logAuditEvent(input: LogEventInput) {
  if (!isPrismaReady()) {
    return null;
  }

  try {
    return await prisma.event.create({
      data: {
        type: input.type,
        payloadJson: toJson(input.payload),
        leadId: input.leadId || null,
        auditRunId: input.auditRunId || null,
        simulatorRunId: input.simulatorRunId || null,
      },
    });
  } catch (error) {
    console.error("[audit-tracking] log event failed", error);
    return null;
  }
}
