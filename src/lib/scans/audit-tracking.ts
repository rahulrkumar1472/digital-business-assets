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
    | "ai_follow_up_generated"
    | "lead_scored"
    | "auto_followup_triggered"
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
    const snapshotJson = {
      generatedAt: input.audit.generatedAt,
      url: input.audit.url,
      industry: input.audit.industry,
      goal: input.audit.goal,
      topFindings: input.audit.topFindings.slice(0, 10),
      recommendedModules: input.audit.recommendedModules.slice(0, 6),
      checks: input.audit.checks.slice(0, 40),
      narrative: input.audit.narrative,
      pageExperience: input.audit.pageExperience,
      dashboardScores: input.audit.dashboardScores,
      businessSnapshot: input.audit.businessSnapshot,
      contentClarity: {
        score: input.audit.contentClarity.score,
        diagnosticSummary: input.audit.contentClarity.diagnosticSummary,
        title: input.audit.contentClarity.title,
        h1: input.audit.contentClarity.h1,
      },
    };

    const resolvedLeadId = input.leadId || existing?.leadId || null;

    if (existing) {
      const updated = await prisma.auditRun.update({
        where: { id: existing.id },
        data: {
          url: input.url,
          leadId: resolvedLeadId,
          scoresJson: toJson(scoresJson),
          snapshotJson: toJson(snapshotJson),
          updatedAt: now,
        },
      });
      if (resolvedLeadId) {
        await prisma.lead.update({
          where: { id: resolvedLeadId },
          data: { lastSeenAt: now },
        });

        try {
          await prisma.auditSnapshot.create({
            data: {
              leadId: resolvedLeadId,
              auditRunId: updated.id,
              snapshotJson: toJson(snapshotJson) as Prisma.InputJsonValue,
            },
          });
        } catch (snapshotError) {
          console.warn("[audit-tracking] snapshot create failed (update)", snapshotError);
        }
      }
      return updated;
    }

    const created = await prisma.auditRun.create({
      data: {
        url: input.url,
        leadId: resolvedLeadId,
        reportId: input.reportId,
        scoresJson: toJson(scoresJson) as Prisma.InputJsonValue,
        snapshotJson: toJson(snapshotJson),
      },
    });
    if (resolvedLeadId) {
      await prisma.lead.update({
        where: { id: resolvedLeadId },
        data: { lastSeenAt: now },
      });

      try {
        await prisma.auditSnapshot.create({
          data: {
            leadId: resolvedLeadId,
            auditRunId: created.id,
            snapshotJson: toJson(snapshotJson) as Prisma.InputJsonValue,
          },
        });
      } catch (snapshotError) {
        console.warn("[audit-tracking] snapshot create failed (create)", snapshotError);
      }
    }
    return created;
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
    const event = await prisma.event.create({
      data: {
        type: input.type,
        payloadJson: toJson(input.payload),
        leadId: input.leadId || null,
        auditRunId: input.auditRunId || null,
        simulatorRunId: input.simulatorRunId || null,
      },
    });

    if (input.leadId) {
      await prisma.lead.update({
        where: { id: input.leadId },
        data: { lastSeenAt: event.createdAt },
      });
    }

    return event;
  } catch (error) {
    console.error("[audit-tracking] log event failed", error);
    return null;
  }
}
