import { NextResponse } from "next/server";

import { isAdminPasswordConfigured, setAdminCookie, verifyAdminPassword } from "@/lib/admin/auth";

type LoginPayload = {
  password?: string;
};

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message: "ADMIN_PASSWORD is not configured.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as LoginPayload;
    const password = body.password?.trim() || "";

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ ok: false, message: "Invalid admin password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    setAdminCookie(response);
    return response;
  } catch (error) {
    console.error("[api/admin/auth/login] error", error);
    return NextResponse.json({ ok: false, message: "Could not authenticate." }, { status: 500 });
  }
}
