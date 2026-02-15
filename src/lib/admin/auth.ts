import { createHash } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "dba_admin_session";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8;

function hashValue(value: string) {
  return createHash("sha256").update(`dba-admin-v1:${value}`).digest("hex");
}

function getConfiguredPassword() {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value && value.length > 0 ? value : null;
}

export function isAdminPasswordConfigured() {
  return Boolean(getConfiguredPassword());
}

export function verifyAdminPassword(input: string) {
  const configured = getConfiguredPassword();
  if (!configured) {
    return false;
  }
  return hashValue(input.trim()) === hashValue(configured);
}

function getSessionToken() {
  const configured = getConfiguredPassword();
  if (!configured) {
    return null;
  }
  return hashValue(configured);
}

export async function isAdminAuthenticated() {
  const token = getSessionToken();
  if (!token) {
    return false;
  }
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === token;
}

export function setAdminCookie(response: NextResponse) {
  const token = getSessionToken();
  if (!token) {
    return;
  }
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminRequestAuthorized(request: Request) {
  const token = getSessionToken();
  if (!token) {
    return false;
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const chunks = cookieHeader.split(";").map((part) => part.trim());
  const cookieToken = chunks.find((chunk) => chunk.startsWith(`${ADMIN_COOKIE_NAME}=`))?.split("=")[1];

  if (cookieToken && cookieToken === token) {
    return true;
  }

  const legacyHeaderToken = request.headers.get("x-admin-token");
  if (legacyHeaderToken && legacyHeaderToken === process.env.ADMIN_TOKEN) {
    return true;
  }

  return false;
}
