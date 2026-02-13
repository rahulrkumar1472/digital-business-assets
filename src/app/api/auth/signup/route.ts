import { NextResponse } from "next/server";

import { createUserWithSubscription, findUserByEmail } from "@/lib/auth/repository";
import { hashPassword } from "@/lib/auth/password";
import { buildSessionToken, setSessionCookie } from "@/lib/auth/session";

const validPlans = new Set(["Starter", "Growth", "Scale"]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const password = typeof payload.password === "string" ? payload.password : "";
    const planRaw = typeof payload.plan === "string" ? payload.plan : "Starter";
    const plan = validPlans.has(planRaw) ? planRaw : "Starter";

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 409 });
    }

    const user = await createUserWithSubscription({
      email,
      passwordHash: hashPassword(password),
      plan,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      plan,
    });
    const token = buildSessionToken(user.id, user.email);
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("[api/auth/signup] error", error);
    return NextResponse.json({ success: false, message: "Could not create account." }, { status: 500 });
  }
}

