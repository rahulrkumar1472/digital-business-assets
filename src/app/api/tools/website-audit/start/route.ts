import { NextResponse } from "next/server";

import { submitLead } from "@/lib/lead";
import { enqueueScanJob } from "@/lib/scans/scan-engine";
import { type AuditReason, createLeadAndScan, normalizeLeadScanInput } from "@/lib/scans/repository";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    const input = normalizeLeadScanInput({
      fullName: typeof payload.fullName === "string" ? payload.fullName : "",
      mobileNumber: typeof payload.mobileNumber === "string" ? payload.mobileNumber : "",
      businessName: typeof payload.businessName === "string" ? payload.businessName : "",
      websiteUrl: typeof payload.websiteUrl === "string" ? payload.websiteUrl : "",
      reason: typeof payload.reason === "string" ? (payload.reason as AuditReason) : "All of it",
      email: typeof payload.email === "string" ? payload.email : "",
      industry: typeof payload.industry === "string" ? payload.industry : "",
    });

    const created = await createLeadAndScan(input);

    if (input.email) {
      await submitLead({
        name: input.fullName,
        email: input.email,
        phone: input.mobileNumber,
        company: input.businessName,
        website: input.websiteUrl,
        industry: input.industry,
        message: `Website scan requested. Reason: ${input.reason}`,
        source: "tools-website-audit",
        meta: {
          scanId: created.scanId,
          datastore: created.source,
        },
      });
    }

    await enqueueScanJob(created.scanId, input);

    return NextResponse.json({
      success: true,
      scanId: created.scanId,
      statusUrl: `/api/tools/website-audit/${created.scanId}`,
      resultsUrl: `/tools/website-audit/results/${created.scanId}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start website scan.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
