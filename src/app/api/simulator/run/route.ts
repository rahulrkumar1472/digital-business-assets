import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { isPrismaReady, prisma } from "@/lib/db/prisma";
import {
  runSimulatorEngine,
  type GrowthGoal,
  type LocationIntent,
  type OfferType,
  type SimulatorInputs,
  type SimulatorLeadCapturePoints,
  type SimulatorTrustSignals,
} from "@/lib/simulator/simulator-engine";

type SimulatorRunPayload = {
  leadId?: string;
  auditRunId?: string;
  domain?: string;
  businessName?: string;
  industry?: string;
  offerType?: OfferType;
  locationIntent?: LocationIntent;
  goal?: GrowthGoal;
  visitors?: number;
  conversionRate?: number | null;
  avgOrderValue?: number;
  closeRate?: number | null;
  grossMargin?: number | null;
  responseTimeMinutes?: number;
  followups?: number;
  leadCapturePoints?: Partial<SimulatorLeadCapturePoints>;
  trustSignals?: Partial<SimulatorTrustSignals>;
  currency?: "GBP";
};

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function trimSafe(value: unknown, max = 180) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function normalizeInputs(payload: SimulatorRunPayload): SimulatorInputs | null {
  const visitors = parseNumber(payload.visitors);
  const avgOrderValue = parseNumber(payload.avgOrderValue);
  const responseTimeMinutes = parseNumber(payload.responseTimeMinutes);
  const followups = parseNumber(payload.followups);

  if (!visitors || visitors <= 0 || !avgOrderValue || avgOrderValue <= 0 || responseTimeMinutes === null || followups === null) {
    return null;
  }

  const leadCapturePoints: SimulatorLeadCapturePoints = {
    websiteForm: Boolean(payload.leadCapturePoints?.websiteForm),
    whatsapp: Boolean(payload.leadCapturePoints?.whatsapp),
    phone: Boolean(payload.leadCapturePoints?.phone),
    bookingTool: Boolean(payload.leadCapturePoints?.bookingTool),
  };

  const trustSignals: SimulatorTrustSignals = {
    reviews: Boolean(payload.trustSignals?.reviews),
    caseStudies: Boolean(payload.trustSignals?.caseStudies),
    guarantees: Boolean(payload.trustSignals?.guarantees),
    certifications: Boolean(payload.trustSignals?.certifications),
  };

  return {
    domain: trimSafe(payload.domain, 200) || undefined,
    businessName: trimSafe(payload.businessName, 160) || undefined,
    industry: trimSafe(payload.industry, 100) || "local services",
    offerType: payload.offerType || "local-service",
    locationIntent: payload.locationIntent || "local",
    goal: payload.goal || "more-leads",
    visitors: Math.round(visitors),
    conversionRate: parseNumber(payload.conversionRate),
    avgOrderValue: Math.max(1, Number(avgOrderValue)),
    closeRate: parseNumber(payload.closeRate),
    grossMargin: parseNumber(payload.grossMargin),
    responseTimeMinutes: Math.max(1, Math.round(responseTimeMinutes)),
    followups: Math.max(0, Math.min(7, Math.round(followups))),
    leadCapturePoints,
    trustSignals,
    currency: "GBP",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SimulatorRunPayload;
    const normalized = normalizeInputs(body);

    if (!normalized) {
      return NextResponse.json(
        {
          ok: false,
          message: "Visitors, AOV, response time, and follow-up inputs are required.",
        },
        { status: 400 },
      );
    }

    const { inputs, output } = runSimulatorEngine(normalized);

    let simulatorRunId: string | undefined;
    const leadId = trimSafe(body.leadId, 100) || undefined;
    const auditRunId = trimSafe(body.auditRunId, 100) || undefined;

    if (isPrismaReady()) {
      const record = await prisma.simulatorRun.create({
        data: {
          leadId: leadId || null,
          auditRunId: auditRunId || null,
          domain: inputs.domain || null,
          businessName: inputs.businessName || null,
          industry: inputs.industry,
          offerType: inputs.offerType,
          goal: inputs.goal,
          locationIntent: inputs.locationIntent,
          visitors: inputs.visitors,
          conversionRate: inputs.conversionRate,
          avgOrderValue: inputs.avgOrderValue,
          closeRate: inputs.closeRate,
          grossMargin: typeof inputs.grossMargin === "number" ? inputs.grossMargin : null,
          responseTimeMinutes: inputs.responseTimeMinutes,
          followups: inputs.followups,
          leadCapturePoints: toJson(inputs.leadCapturePoints),
          trustSignals: toJson(inputs.trustSignals),
          outputs: toJson(output),
          currency: inputs.currency || "GBP",
        },
      });

      simulatorRunId = record.id;
    }

    return NextResponse.json({
      ok: true,
      simulatorRunId,
      inputs,
      output,
    });
  } catch (error) {
    console.error("[api/simulator/run] error", error);
    return NextResponse.json({ ok: false, message: "Could not run simulator." }, { status: 500 });
  }
}
