import { NextResponse } from "next/server";

import { calculateLeadScore } from "@/lib/ai/lead-score-engine";
import { processLeadAutomation } from "@/lib/automation/auto-action-engine";
import { isAdminRequestAuthorized } from "@/lib/admin/auth";
import { isPrismaReady, prisma } from "@/lib/db/prisma";
import { logAuditEvent } from "@/lib/scans/audit-tracking";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function normalizeCategory(value: string) {
  const normalized = value.toLowerCase();
  if (normalized === "hot" || normalized === "warm" || normalized === "cold") {
    return normalized;
  }
  return "cold";
}

export async function GET(request: Request, context: RouteContext) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!isPrismaReady()) {
    return NextResponse.json({ ok: false, message: "Database is not configured." }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        leadScore: true,
        leadTemperature: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ ok: false, message: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      score: lead.leadScore,
      category: normalizeCategory(lead.leadTemperature),
      reasons: [],
    });
  } catch (error) {
    console.error("[api/admin/leads/:id/score] get error", error);
    return NextResponse.json({ ok: false, message: "Could not load lead score." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!isPrismaReady()) {
    return NextResponse.json({ ok: false, message: "Database is not configured." }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const result = await calculateLeadScore(id);

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        leadScore: result.score,
        leadTemperature: result.category,
        lastSeenAt: new Date(),
      },
      select: {
        id: true,
        leadScore: true,
        leadTemperature: true,
      },
    });

    await logAuditEvent({
      type: "lead_scored",
      leadId: id,
      payload: {
        score: result.score,
        category: result.category,
        reasons: result.reasons,
      },
    });

    const automation = await processLeadAutomation(id);

    return NextResponse.json({
      ok: true,
      score: updated.leadScore,
      category: normalizeCategory(updated.leadTemperature),
      reasons: result.reasons,
      automation,
    });
  } catch (error) {
    console.error("[api/admin/leads/:id/score] post error", error);
    return NextResponse.json({ ok: false, message: "Could not calculate lead score." }, { status: 500 });
  }
}
