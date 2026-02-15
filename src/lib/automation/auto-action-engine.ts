import { generateFollowUpMessage, saveGeneratedFollowUpMessage } from "@/lib/ai/closer-engine";
import { isPrismaReady, prisma } from "@/lib/db/prisma";
import { logAuditEvent } from "@/lib/scans/audit-tracking";

export type LeadAutomationResult = {
  leadId: string;
  executed: boolean;
  reason: string;
  leadScore: number;
  lastActivityAt: Date;
  taskId?: string;
  generatedMessageId?: string;
};

export async function processLeadAutomation(leadId: string): Promise<LeadAutomationResult> {
  if (!isPrismaReady()) {
    throw new Error("Database is not configured.");
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      leadScore: true,
      lastSeenAt: true,
      updatedAt: true,
      auditRuns: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { id: true },
      },
      simulatorRuns: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const leadScore = typeof lead.leadScore === "number" ? lead.leadScore : 0;
  const lastActivityAt = lead.lastSeenAt || lead.updatedAt;

  if (leadScore < 85) {
    return {
      leadId: lead.id,
      executed: false,
      reason: "Lead score below HOT threshold.",
      leadScore,
      lastActivityAt,
    };
  }

  const generated = await generateFollowUpMessage(lead.id);
  const savedMessage = await saveGeneratedFollowUpMessage(generated);

  const task = await prisma.automationTask.create({
    data: {
      leadId: lead.id,
      type: "follow_up",
      priority: "high",
      status: "pending",
    },
  });

  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: "hot_followup_sent",
      lastSeenAt: new Date(),
    },
  });

  await logAuditEvent({
    type: "auto_followup_triggered",
    leadId: lead.id,
    auditRunId: generated.auditRunId || lead.auditRuns[0]?.id,
    simulatorRunId: generated.simulatorRunId || lead.simulatorRuns[0]?.id,
    payload: {
      leadScore,
      lastActivityAt: lastActivityAt.toISOString(),
      taskId: task.id,
      generatedMessageId: savedMessage.id,
      status: "hot_followup_sent",
    },
  });

  return {
    leadId: lead.id,
    executed: true,
    reason: "HOT threshold reached; automation triggered.",
    leadScore,
    lastActivityAt,
    taskId: task.id,
    generatedMessageId: savedMessage.id,
  };
}
