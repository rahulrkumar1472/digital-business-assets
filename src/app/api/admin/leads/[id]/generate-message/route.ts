import { NextResponse } from "next/server";

import { isAdminRequestAuthorized } from "@/lib/admin/auth";
import { isPrismaReady, prisma } from "@/lib/db/prisma";
import { generateFollowUpMessage, saveGeneratedFollowUpMessage } from "@/lib/ai/closer-engine";
import { logAuditEvent } from "@/lib/scans/audit-tracking";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  if (!isPrismaReady()) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const latest = await prisma.generatedMessage.findFirst({
      where: { leadId: id },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json({ ok: true, message: null });
    }

    return NextResponse.json({
      ok: true,
      message: {
        id: latest.id,
        createdAt: latest.createdAt,
        domain: latest.domain,
        weakestFunnelStage: latest.weakestFunnelStage,
        topFindings: latest.topFindings,
        estimatedRevenueGain: latest.estimatedRevenueGain,
        urgencyFactor: latest.urgencyFactor,
        emailVersion: latest.emailVersion,
        whatsappVersion: latest.whatsappVersion,
        smsVersion: latest.smsVersion,
        callScriptVersion: latest.callScriptVersion,
      },
    });
  } catch (error) {
    console.error("[api/admin/leads/:id/generate-message] get error", error);
    return NextResponse.json({ ok: false, error: "Could not load generated message." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  if (!isPrismaReady()) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const generated = await generateFollowUpMessage(id);
    const created = await saveGeneratedFollowUpMessage(generated);

    await logAuditEvent({
      type: "ai_follow_up_generated",
      leadId: id,
      auditRunId: generated.auditRunId,
      simulatorRunId: generated.simulatorRunId,
      payload: {
        generatedMessageId: created.id,
        domain: generated.domain,
        weakestFunnelStage: generated.weakestFunnelStage,
        estimatedRevenueGain: generated.estimatedRevenueGain,
        urgencyFactor: generated.urgencyFactor,
        topFindings: generated.topFindings,
      },
    });

    return NextResponse.json({
      ok: true,
      message: {
        id: created.id,
        createdAt: created.createdAt,
        ...generated,
      },
    });
  } catch (error) {
    console.error("[api/admin/leads/:id/generate-message] post error", error);
    return NextResponse.json({ ok: false, error: "Could not generate follow-up message." }, { status: 500 });
  }
}
