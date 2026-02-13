import { readFile } from "node:fs/promises";

import { NextResponse } from "next/server";

import { getScanById } from "@/lib/scans/repository";
import { getWebsiteAuditPdfBuffer } from "@/lib/website-audit";

type ScanDownloadRouteProps = {
  params: Promise<{ scanId: string }>;
};

export async function GET(_request: Request, { params }: ScanDownloadRouteProps) {
  const { scanId } = await params;
  const scan = await getScanById(scanId);

  if (!scan) {
    return NextResponse.json({ success: false, error: "Scan not found." }, { status: 404 });
  }

  const rawResult = scan.rawResult && typeof scan.rawResult === "object" ? (scan.rawResult as Record<string, unknown>) : null;
  const auditId = rawResult && typeof rawResult.auditId === "string" ? rawResult.auditId : null;

  let pdfBuffer: Buffer | null = null;

  if (auditId) {
    pdfBuffer = await getWebsiteAuditPdfBuffer(auditId);
  }

  if (!pdfBuffer && scan.reportPath) {
    try {
      pdfBuffer = await readFile(scan.reportPath);
    } catch {
      pdfBuffer = null;
    }
  }

  if (!pdfBuffer) {
    return NextResponse.json({ success: false, error: "Report PDF not ready." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="website-audit-${scan.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
