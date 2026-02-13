import { NextResponse } from "next/server";

import { findUserByEmail, getUserSubscription } from "@/lib/auth/repository";
import { verifyPassword } from "@/lib/auth/password";
import { buildSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const password = typeof payload.password === "string" ? payload.password : "";

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    const subscription = await getUserSubscription(user.id);
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
          }
        : null,
    });

    const token = buildSessionToken(user.id, user.email);
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("[api/auth/login] error", error);
    return NextResponse.json({ success: false, message: "Could not log in." }, { status: 500 });
  }
}

