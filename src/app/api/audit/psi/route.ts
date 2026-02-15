import { NextResponse } from "next/server";

import { fetchPsiMetrics } from "@/lib/scans/psi";

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";
  const url = normalizeUrl(rawUrl);

  if (!url) {
    return NextResponse.json(
      {
        ok: false,
        message: "A valid URL is required.",
      },
      { status: 400 },
    );
  }

  const metrics = await fetchPsiMetrics(url);
  return NextResponse.json({
    ok: true,
    url,
    available: metrics.available,
    performanceScore: metrics.performanceScore,
    seoScore: metrics.seoScore,
    accessibilityScore: metrics.accessibilityScore,
    bestPracticesScore: metrics.bestPracticesScore,
    FCP: metrics.FCP,
    LCP: metrics.LCP,
    TBT: metrics.TBT,
    CLS: metrics.CLS,
    SI: metrics.SI,
    INP: metrics.INP,
    cwvStatus: metrics.cwvStatus,
    mode: metrics.mode,
  });
}
