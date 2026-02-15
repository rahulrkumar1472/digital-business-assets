import { NextResponse } from "next/server";

import { isAdminRequestAuthorized } from "@/lib/admin/auth";
import { isPrismaReady, prisma } from "@/lib/db/prisma";

type UpdateLeadPayload = {
  notes?: string;
  intentTier?: string;
  nextAction?: string;
  status?: string;
};

const allowedIntentTier = new Set(["Hot", "Warm", "Cold"]);
const allowedStatus = new Set(["New", "Contacted", "Booked", "Won", "Lost", "hot_followup_sent"]);

function trimSafe(value: unknown, max = 600) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!isPrismaReady()) {
    return NextResponse.json({ ok: false, message: "Database is not configured." }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateLeadPayload;

    const intentTier = trimSafe(body.intentTier, 40) || "Warm";
    const status = trimSafe(body.status, 40) || "New";

    if (!allowedIntentTier.has(intentTier)) {
      return NextResponse.json({ ok: false, message: "Invalid intent tier." }, { status: 400 });
    }
    if (!allowedStatus.has(status)) {
      return NextResponse.json({ ok: false, message: "Invalid status." }, { status: 400 });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        notes: trimSafe(body.notes, 2000) || null,
        intentTier,
        nextAction: trimSafe(body.nextAction, 280) || null,
        status,
        lastSeenAt: new Date(),
      },
      select: {
        id: true,
        notes: true,
        intentTier: true,
        nextAction: true,
        status: true,
      },
    });

    return NextResponse.json({ ok: true, lead: updated });
  } catch (error) {
    console.error("[api/admin/leads/:id] patch error", error);
    return NextResponse.json({ ok: false, message: "Could not update lead." }, { status: 500 });
  }
}
