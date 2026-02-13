import { NextResponse } from "next/server";

import { buildUpgradeCards, ensureScanProgress } from "@/lib/scans/scan-engine";
import { type AuditReason, getScanById } from "@/lib/scans/repository";

type ScanRouteProps = {
  params: Promise<{ scanId: string }>;
};

export async function GET(_request: Request, { params }: ScanRouteProps) {
  const { scanId } = await params;
  const scan = await getScanById(scanId);

  if (!scan) {
    return NextResponse.json({ success: false, error: "Scan not found." }, { status: 404 });
  }

  const lead = "lead" in scan ? scan.lead : null;

  if ((scan.status === "QUEUED" || scan.status === "PROCESSING") && lead) {
    await ensureScanProgress(scan.id, {
      fullName: lead.fullName,
      mobileNumber: lead.mobileNumber,
      businessName: lead.businessName,
      websiteUrl: scan.websiteUrl,
      reason: scan.concern as AuditReason,
      email: lead.email || undefined,
      industry: scan.industry,
    });
  }

  const rawResult = scan.rawResult && typeof scan.rawResult === "object" ? (scan.rawResult as Record<string, unknown>) : null;
  const upgradeCards =
    rawResult && Array.isArray(rawResult.upgradeCards)
      ? (rawResult.upgradeCards as unknown[])
      : buildUpgradeCards(scan.concern as AuditReason);

  return NextResponse.json({
    success: true,
    scan: {
      id: scan.id,
      status: scan.status,
      progress: scan.progress,
      concern: scan.concern,
      industry: scan.industry,
      websiteUrl: scan.websiteUrl,
      scores: scan.scores || null,
      insights: scan.insights || [],
      recommendations: scan.recommendations || [],
      upgradeCards,
      errorMessage: scan.errorMessage || null,
      createdAt: scan.createdAt,
      startedAt: scan.startedAt,
      completedAt: scan.completedAt,
      downloadUrl: `/api/tools/website-audit/${scan.id}/download`,
    },
    lead: lead
      ? {
          fullName: lead.fullName,
          mobileNumber: lead.mobileNumber,
          businessName: lead.businessName,
          websiteUrl: lead.websiteUrl,
          email: lead.email,
        }
      : null,
  });
}
