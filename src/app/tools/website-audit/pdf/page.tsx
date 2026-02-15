import type { Metadata } from "next";

import { AuditPdfDownload } from "@/components/tools/audit-pdf-download";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/tools/website-audit/pdf",
  title: "Audit PDF Download",
  description:
    "Generate and download your branded Website Growth Audit PDF with scorecards, top findings, implementation plan, and clickable next-step links.",
});

type WebsiteAuditPdfPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WebsiteAuditPdfPage({ searchParams }: WebsiteAuditPdfPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      query.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      query.set(key, value[0]);
    }
  }

  const url = typeof params.url === "string" && params.url ? params.url : "https://example.co.uk";
  return <AuditPdfDownload queryString={query.toString()} url={url} />;
}
