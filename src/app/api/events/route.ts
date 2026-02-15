import { NextResponse } from "next/server";

import { logAuditEvent } from "@/lib/scans/audit-tracking";

type EventPayload = {
  type?:
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

const allowedTypes = new Set([
  "audit_started",
  "audit_completed",
  "pdf_downloaded",
  "module_clicked",
  "simulator_opened",
  "simulator_started",
  "simulator_completed",
  "simulator_action_clicked",
  "simulator_bespoke_plan_clicked",
  "ai_follow_up_generated",
  "lead_scored",
  "auto_followup_triggered",
  "book_call_clicked",
]);

function trimSafe(value: unknown, max = 120) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EventPayload;
    const type = trimSafe(body.type, 60) as EventPayload["type"];

    if (!type || !allowedTypes.has(type)) {
      return NextResponse.json({ ok: false, message: "Invalid event type." }, { status: 400 });
    }

    const leadId = trimSafe(body.leadId);
    const auditRunId = trimSafe(body.auditRunId);
    const simulatorRunId = trimSafe(body.simulatorRunId);
    await logAuditEvent({
      type,
      payload: body.payload,
      leadId: leadId || undefined,
      auditRunId: auditRunId || undefined,
      simulatorRunId: simulatorRunId || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/events] error", error);
    return NextResponse.json({ ok: false, message: "Could not log event." }, { status: 500 });
  }
}
