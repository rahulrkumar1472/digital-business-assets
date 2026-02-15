import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";

type AuditPayload = {
  url?: string;
  industry?: string;
  goal?: string;
  email?: string;
  scores?: {
    score?: number;
    speedScore?: number;
    seoScore?: number;
    conversionScore?: number;
    trustScore?: number;
  };
  createdAt?: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const DATA_DIR = "/tmp/audit-cache";

const globalForAuditRateLimit = globalThis as typeof globalThis & {
  __auditRateLimit?: Map<string, RateLimitEntry>;
};

const auditRateLimitStore = globalForAuditRateLimit.__auditRateLimit ?? new Map<string, RateLimitEntry>();
globalForAuditRateLimit.__auditRateLimit = auditRateLimitStore;

function trimSafe(value: unknown, max = 200) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}

function getClientIp(request: Request) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = auditRateLimitStore.get(ip);

  if (!current || now > current.resetAt) {
    auditRateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return true;
  }

  current.count += 1;
  auditRateLimitStore.set(ip, current);
  return false;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please wait a few minutes and try again.",
        },
        { status: 429 },
      );
    }

    const body = (await request.json()) as AuditPayload;
    const url = trimSafe(body.url, 500);
    const industry = trimSafe(body.industry, 100);
    const goal = trimSafe(body.goal, 100);
    const email = trimSafe(body.email, 180);
    const createdAt = trimSafe(body.createdAt, 80) || new Date().toISOString();

    if (!url) {
      return NextResponse.json({ success: false, message: "URL is required." }, { status: 400 });
    }

    const safeScores = {
      score: Number.isFinite(body.scores?.score) ? Number(body.scores?.score) : undefined,
      speedScore: Number.isFinite(body.scores?.speedScore) ? Number(body.scores?.speedScore) : undefined,
      seoScore: Number.isFinite(body.scores?.seoScore) ? Number(body.scores?.seoScore) : undefined,
      conversionScore: Number.isFinite(body.scores?.conversionScore) ? Number(body.scores?.conversionScore) : undefined,
      trustScore: Number.isFinite(body.scores?.trustScore) ? Number(body.scores?.trustScore) : undefined,
    };

    const cacheRecord = {
      url,
      industry,
      goal,
      email: email || null,
      scores: safeScores,
      createdAt,
    };

    try {
      await mkdir(DATA_DIR, { recursive: true });
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const path = `${DATA_DIR}/${id}.json`;
      await writeFile(path, JSON.stringify(cacheRecord, null, 2), "utf8");
    } catch {
      console.warn("Cache write failed — continuing");
    }

    console.info("[api/audit] saved stub payload", {
      url,
      industry,
      goal,
      email: email || null,
      scores: safeScores,
      createdAt,
    });

    return NextResponse.json({
      success: true,
      message: "Audit details captured.",
    });
  } catch (error) {
    console.error("[api/audit] error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Could not capture audit details.",
      },
      { status: 500 },
    );
  }
}
