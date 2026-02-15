import { NextResponse } from "next/server";

import { getPortalSessionPayload } from "@/lib/portal/portal-session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token")?.trim() || "";

    if (!token) {
      return NextResponse.json({ ok: false, message: "Token is required." }, { status: 400 });
    }

    const payload = await getPortalSessionPayload(token);
    if (!payload) {
      return NextResponse.json({ ok: false, message: "Session is invalid or expired." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, ...payload });
  } catch (error) {
    console.error("[api/portal/session] error", error);
    return NextResponse.json({ ok: false, message: "Could not load portal session." }, { status: 500 });
  }
}
