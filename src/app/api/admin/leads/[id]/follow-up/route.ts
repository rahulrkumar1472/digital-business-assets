import { NextResponse } from "next/server";

import { isAdminRequestAuthorized } from "@/lib/admin/auth";
import { isPrismaReady, prisma } from "@/lib/db/prisma";

function scoreLine(score: number | null) {
  if (typeof score !== "number") {
    return "We reviewed your current baseline and found practical growth opportunities you can act on now.";
  }
  if (score >= 90) {
    return `Your current score is ${score}/100, so this is mainly about tightening high-impact gaps and scaling confidently.`;
  }
  if (score >= 50) {
    return `Your current score is ${score}/100, and there is clear headroom for faster lead-to-sale performance.`;
  }
  return `Your current score is ${score}/100, which suggests avoidable leakage across conversion and follow-up.`;
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return null;
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
      return NextResponse.json({ ok: false, message: "Lead not found." }, { status: 404 });
    }

    const latestAudit = lead.auditRuns[0];
    const latestSimulator = lead.simulatorRuns[0];
    const auditScore = asNumber(asRecord(latestAudit?.scoresJson)?.overall);
    const simulatorScore = asNumber(asRecord(latestSimulator?.outputs)?.summaryScore);
    const score = auditScore ?? simulatorScore ?? null;

    const subject = `${lead.businessName || "Your business"} growth next steps`;
    const body = [
      `Hi ${lead.fullName || lead.name || "there"},`,
      "",
      scoreLine(score),
      "",
      "From your latest report, the fastest next step is to fix the highest-impact conversion and speed-to-lead gaps first.",
      "",
      "Recommended next actions:",
      "1) Run the highest-priority module fix",
      "2) Confirm implementation timeline",
      "3) Book a strategy slot to finalise rollout",
      "",
      "Quick links:",
      "- Services: https://digitalbusinessassets.co.uk/services",
      "- Bespoke plan: https://digitalbusinessassets.co.uk/bespoke-plan",
      "- Audit tools: https://digitalbusinessassets.co.uk/tools",
      "",
      "Reply if you want us to map the exact 14-day implementation plan for your business.",
      "",
      "Digital Business Assets",
    ].join("\n");

    return NextResponse.json({ ok: true, subject, body });
  } catch (error) {
    console.error("[api/admin/leads/:id/follow-up] error", error);
    return NextResponse.json({ ok: false, message: "Could not generate follow-up email." }, { status: 500 });
  }
}
