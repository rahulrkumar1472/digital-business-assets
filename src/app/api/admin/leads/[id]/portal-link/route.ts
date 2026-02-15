import { NextResponse } from "next/server";

import { isAdminRequestAuthorized } from "@/lib/admin/auth";
import { createPortalSessionForLeadId } from "@/lib/portal/portal-session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const session = await createPortalSessionForLeadId(id);

    if (!session) {
      return NextResponse.json({ ok: false, message: "Lead not found or database unavailable." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
      url: session.url,
    });
  } catch (error) {
    console.error("[api/admin/leads/:id/portal-link] error", error);
    return NextResponse.json({ ok: false, message: "Could not generate portal link." }, { status: 500 });
  }
}
