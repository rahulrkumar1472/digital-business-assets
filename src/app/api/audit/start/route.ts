import { NextResponse } from "next/server";

import { isPrismaReady, prisma } from "@/lib/db/prisma";
import { logAuditEvent } from "@/lib/scans/audit-tracking";
import { normalizeCompetitorDomain } from "@/lib/scans/audit-engine";

type StartAuditPayload = {
  url?: string;
  industry?: string;
  goal?: string;
  competitors?: string[];
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
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
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:") {
      parsed.protocol = "https:";
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  if (!isPrismaReady()) {
    return NextResponse.json({ ok: false, message: "Database is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as StartAuditPayload;

    const name = trimSafe(body.name, 120);
    const email = trimSafe(body.email, 180).toLowerCase();
    const phone = trimSafe(body.phone, 40);
    const businessName = trimSafe(body.businessName, 140);
    const industry = trimSafe(body.industry, 80) || "service";
    const goal = trimSafe(body.goal, 80) || "leads";
    const url = normalizeWebsite(trimSafe(body.url, 500));
    const competitors = Array.isArray(body.competitors)
      ? Array.from(
          new Set(
            body.competitors
              .map((item) => normalizeCompetitorDomain(String(item || "")))
              .filter(Boolean),
          ),
        ).slice(0, 3)
      : [];

    if (!url || !name || !phone || !email) {
      return NextResponse.json(
        {
          ok: false,
          message: "Name, phone, email, and website URL are required.",
        },
        { status: 400 },
      );
    }
    if (!emailPattern.test(email)) {
      return NextResponse.json({ ok: false, message: "Please enter a valid email." }, { status: 400 });
    }

    const existingLead = await prisma.lead.findFirst({ where: { email } });
    const lead = existingLead
      ? await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            fullName: name,
            name,
            mobileNumber: phone,
            phone,
            businessName: businessName || existingLead.businessName,
            websiteUrl: url,
            website: url,
            source: "audit_start",
            pagePath: "/tools/website-audit/start",
            reason: existingLead.reason || "All of it",
          },
        })
      : await prisma.lead.create({
          data: {
            fullName: name,
            name,
            mobileNumber: phone,
            phone,
            businessName: businessName || "Unknown Business",
            websiteUrl: url,
            website: url,
            email,
            source: "audit_start",
            pagePath: "/tools/website-audit/start",
            reason: "All of it",
          },
        });

    const reportId = `${new URL(url).hostname}-${Date.now()}`;
    const auditRun = await prisma.auditRun.create({
      data: {
        url,
        leadId: lead.id,
        reportId,
        scoresJson: {
          status: "started",
          industry,
          goal,
          competitors,
        },
      },
    });

    await logAuditEvent({
      type: "audit_started",
      leadId: lead.id,
      auditRunId: auditRun.id,
      payload: {
        url,
        industry,
        goal,
        competitors,
      },
    });

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      auditRunId: auditRun.id,
      reportId,
      url,
      industry,
      goal,
      competitors,
    });
  } catch (error) {
    console.error("[api/audit/start] error", error);
    return NextResponse.json({ ok: false, message: "Could not start audit run." }, { status: 500 });
  }
}

