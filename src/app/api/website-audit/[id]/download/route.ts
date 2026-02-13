import { NextResponse } from "next/server";

import { getWebsiteAuditPdfBuffer } from "@/lib/website-audit";

type WebsiteAuditDownloadRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: WebsiteAuditDownloadRouteProps) {
  const { id } = await params;
  const pdf = await getWebsiteAuditPdfBuffer(id);

  if (!pdf) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="website-audit-${id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
