import { NextResponse } from "next/server";

import { runWebsiteAudit } from "@/lib/website-audit";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    const audit = await runWebsiteAudit({
      websiteUrl: typeof payload.websiteUrl === "string" ? payload.websiteUrl : "",
      name: typeof payload.name === "string" ? payload.name : "",
      email: typeof payload.email === "string" ? payload.email : "",
      phone: typeof payload.phone === "string" ? payload.phone : "",
      industry: typeof payload.industry === "string" ? payload.industry : "",
      concern: typeof payload.concern === "string" ? (payload.concern as never) : "All of it",
    });

    return NextResponse.json({
      success: true,
      auditId: audit.id,
      scores: audit.scores,
      recommendations: audit.recommendations,
      downloadUrl: `/api/website-audit/${audit.id}/download`,
      templateUrl: `/website-audit/template/${audit.id}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Audit generation failed.";
    console.error("[api/website-audit] failed", error);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
