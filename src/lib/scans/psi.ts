export type PsiMetrics = {
  available: boolean;
  mode: "psi" | "estimate";
  performanceScore?: number;
  seoScore?: number;
  accessibilityScore?: number;
  bestPracticesScore?: number;
  FCP?: number;
  LCP?: number;
  TBT?: number;
  CLS?: number;
  SI?: number;
  INP?: number;
  cwvStatus: "Pass" | "Needs Improvement" | "Fail" | "Estimated";
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function inferCwvStatus(input: { lcp?: number; cls?: number; inp?: number }): PsiMetrics["cwvStatus"] {
  if (typeof input.lcp !== "number" || typeof input.cls !== "number" || typeof input.inp !== "number") {
    return "Estimated";
  }

  const fail = input.lcp > 4000 || input.cls > 0.25 || input.inp > 500;
  if (fail) {
    return "Fail";
  }

  const pass = input.lcp <= 2500 && input.cls <= 0.1 && input.inp <= 200;
  if (pass) {
    return "Pass";
  }

  return "Needs Improvement";
}

export async function fetchPsiMetrics(url: string): Promise<PsiMetrics> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) {
    return {
      available: false,
      mode: "estimate",
      cwvStatus: "Estimated",
    };
  }

  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices&url=${encodeURIComponent(
    url,
  )}&key=${encodeURIComponent(key)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5600);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "user-agent": "DigitalBusinessAssetsAuditBot/3.0 (+https://digitalbusinessassets.co.uk)",
      },
    });

    if (!response.ok) {
      return {
        available: false,
        mode: "estimate",
        cwvStatus: "Estimated",
      };
    }

    const json = (await response.json()) as {
      lighthouseResult?: {
        categories?: {
          performance?: { score?: number };
          seo?: { score?: number };
          accessibility?: { score?: number };
          ["best-practices"]?: { score?: number };
        };
        audits?: Record<string, { numericValue?: number }>;
      };
    };

    const performance = json.lighthouseResult?.categories?.performance?.score;
    if (typeof performance !== "number") {
      return {
        available: false,
        mode: "estimate",
        cwvStatus: "Estimated",
      };
    }

    const audits = json.lighthouseResult?.audits || {};
    const fcp = audits["first-contentful-paint"]?.numericValue;
    const lcp = audits["largest-contentful-paint"]?.numericValue;
    const tbt = audits["total-blocking-time"]?.numericValue;
    const cls = audits["cumulative-layout-shift"]?.numericValue;
    const si = audits["speed-index"]?.numericValue;
    const inp = audits["interaction-to-next-paint"]?.numericValue;

    const parsed = {
      performanceScore: clamp(Math.round(performance * 100), 0, 100),
      seoScore:
        typeof json.lighthouseResult?.categories?.seo?.score === "number"
          ? clamp(Math.round(json.lighthouseResult.categories.seo.score * 100), 0, 100)
          : undefined,
      accessibilityScore:
        typeof json.lighthouseResult?.categories?.accessibility?.score === "number"
          ? clamp(Math.round(json.lighthouseResult.categories.accessibility.score * 100), 0, 100)
          : undefined,
      bestPracticesScore:
        typeof json.lighthouseResult?.categories?.["best-practices"]?.score === "number"
          ? clamp(Math.round(json.lighthouseResult.categories["best-practices"].score * 100), 0, 100)
          : undefined,
      FCP: typeof fcp === "number" ? Math.round(fcp) : undefined,
      LCP: typeof lcp === "number" ? Math.round(lcp) : undefined,
      TBT: typeof tbt === "number" ? Math.round(tbt) : undefined,
      CLS: typeof cls === "number" ? Number(cls.toFixed(3)) : undefined,
      SI: typeof si === "number" ? Math.round(si) : undefined,
      INP: typeof inp === "number" ? Math.round(inp) : undefined,
    };

    return {
      available: true,
      mode: "psi",
      ...parsed,
      cwvStatus: inferCwvStatus({
        lcp: parsed.LCP,
        cls: parsed.CLS,
        inp: parsed.INP,
      }),
    };
  } catch {
    return {
      available: false,
      mode: "estimate",
      cwvStatus: "Estimated",
    };
  } finally {
    clearTimeout(timeout);
  }
}
