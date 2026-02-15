import { NextResponse } from "next/server";

import { createPortalSessionForEmail } from "@/lib/portal/portal-session";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimSafe(value: unknown, max = 180) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}

type RequestLinkPayload = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestLinkPayload;
    const email = trimSafe(body.email).toLowerCase();

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json({ ok: false, message: "Please provide a valid email." }, { status: 400 });
    }

    const session = await createPortalSessionForEmail(email);

    if (session && process.env.NODE_ENV !== "production") {
      console.info(`[portal] dashboard token for ${email}: ${session.token}`);
      console.info(`[portal] dashboard url: ${session.url}`);
    }

    return NextResponse.json({
      ok: true,
      token: session?.token,
      expiresAt: session?.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("[api/portal/request-link] error", error);
    return NextResponse.json({ ok: false, message: "Could not create portal link." }, { status: 500 });
  }
}
