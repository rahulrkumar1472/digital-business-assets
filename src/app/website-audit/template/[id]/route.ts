import { NextResponse } from "next/server";

import { buildWebsiteAuditReportHtml, getWebsiteAuditById } from "@/lib/website-audit";

type WebsiteAuditTemplateRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: WebsiteAuditTemplateRouteProps) {
  const { id } = await params;
  const audit = await getWebsiteAuditById(id);

  if (!audit) {
    return new NextResponse("Report not found.", { status: 404 });
  }

  const html = await buildWebsiteAuditReportHtml(audit);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
