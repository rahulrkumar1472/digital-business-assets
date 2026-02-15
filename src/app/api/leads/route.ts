import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { isPrismaReady, prisma } from "@/lib/db/prisma";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  website?: string;
  source?: string;
  pagePath?: string;
  consentWeekly?: boolean;
  auditReport?: Record<string, unknown>;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimSafe(value: unknown, max = 200) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}

function normalizeWebsite(value: string) {
  const raw = value.trim();
  if (!raw) {
    return "";
  }
  try {
    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const parsed = new URL(candidate);
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return raw;
  }
}

function toInputJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === null || typeof value === "undefined") {
    return undefined;
  }
  return value as Prisma.InputJsonValue;
}

function mergeAuditReport(existing: unknown, incoming: Record<string, unknown> | undefined, savedAt: string): Prisma.InputJsonValue | undefined {
  if (!incoming) {
    return toInputJson(existing);
  }

  const existingObject = typeof existing === "object" && existing !== null ? (existing as Record<string, unknown>) : {};
  const existingHistoryRaw = existingObject.history;
  const existingHistory = Array.isArray(existingHistoryRaw) ? existingHistoryRaw : [];
  const entry = {
    savedAt,
    ...incoming,
  };

  return {
    latest: entry,
    history: [...existingHistory, entry].slice(-12),
  } as Prisma.InputJsonValue;
}

export async function POST(request: Request) {
  if (!isPrismaReady()) {
    return NextResponse.json(
      {
        ok: false,
        message: "Database is not configured.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as LeadPayload;
    const name = trimSafe(body.name, 120);
    const email = trimSafe(body.email, 180).toLowerCase();
    const phone = trimSafe(body.phone, 40);
    const businessName = trimSafe(body.businessName, 140);
    const website = normalizeWebsite(trimSafe(body.website, 500));
    const source = trimSafe(body.source, 60) || "unknown";
    const pagePath = trimSafe(body.pagePath, 240);
    const consentWeekly = typeof body.consentWeekly === "boolean" ? body.consentWeekly : undefined;
    const createdAt = new Date().toISOString();
    const seenAt = new Date();

    if (email && !emailPattern.test(email)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 },
      );
    }

    const defaultFullName = name || "Unknown";
    const defaultPhone = phone || "N/A";
    const defaultBusinessName = businessName || "Unknown Business";
    const defaultWebsite = website || "https://example.co.uk";

    if (email) {
      const existing = await prisma.lead.findFirst({
        where: { email },
      });

      if (existing) {
        const updated = await prisma.lead.update({
          where: { id: existing.id },
          data: {
            fullName: name || existing.fullName,
            name: name || existing.name,
            mobileNumber: phone || existing.mobileNumber,
            phone: phone || existing.phone,
            businessName: businessName || existing.businessName,
            websiteUrl: website || existing.websiteUrl,
            website: website || existing.website,
            email,
            source,
            pagePath: pagePath || existing.pagePath,
            consentWeekly: typeof consentWeekly === "boolean" ? consentWeekly : existing.consentWeekly,
            auditReport: mergeAuditReport(existing.auditReport, body.auditReport, createdAt),
            reason: existing.reason || "All of it",
            lastSeenAt: seenAt,
          },
        });

        return NextResponse.json({ ok: true, leadId: updated.id });
      }
    }

    const created = await prisma.lead.create({
      data: {
        fullName: defaultFullName,
        name: name || null,
        mobileNumber: defaultPhone,
        phone: phone || null,
        businessName: defaultBusinessName,
        websiteUrl: defaultWebsite,
        website: website || null,
        reason: "All of it",
        email: email || null,
        source,
        pagePath: pagePath || null,
        consentWeekly: consentWeekly ?? false,
        auditReport: mergeAuditReport(null, body.auditReport, createdAt),
        lastSeenAt: seenAt,
      },
    });

    return NextResponse.json({ ok: true, leadId: created.id });
  } catch (error) {
    console.error("[api/leads] error", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Could not save lead.",
      },
      { status: 500 },
    );
  }
}
