import { NextResponse } from "next/server";
import {
  Document,
  Link,
  Page,
  Path,
  Svg,
  Text,
  View,
  renderToBuffer,
  StyleSheet,
} from "@react-pdf/renderer";

import { createPortalSessionForLeadId } from "@/lib/portal/portal-session";
import { parseCompetitorList, runWebsiteGrowthAudit } from "@/lib/scans/audit-engine";
import { logAuditEvent } from "@/lib/scans/audit-tracking";
import type { AuditResult, RAG } from "@/lib/scans/audit-types";
import { siteConfig } from "@/lib/site";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_MAX = 6;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const globalForPdfRateLimit = globalThis as typeof globalThis & {
  __auditPdfRateLimit?: Map<string, RateLimitEntry>;
};

const pdfRateLimitStore = globalForPdfRateLimit.__auditPdfRateLimit ?? new Map<string, RateLimitEntry>();
globalForPdfRateLimit.__auditPdfRateLimit = pdfRateLimitStore;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#060c16",
    color: "#eef3fb",
    paddingTop: 38,
    paddingBottom: 30,
    paddingHorizontal: 34,
    fontSize: 10,
    lineHeight: 1.45,
  },
  frame: {
    borderWidth: 1,
    borderColor: "#1f4254",
    borderRadius: 10,
    padding: 16,
  },
  heading: {
    fontSize: 25,
    fontWeight: 700,
    color: "#f2f8ff",
  },
  subheading: {
    marginTop: 6,
    fontSize: 11,
    color: "#a7bed4",
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#55dbff",
  },
  card: {
    borderWidth: 1,
    borderColor: "#1f3244",
    borderRadius: 10,
    backgroundColor: "#0a1523",
    padding: 10,
  },
  tinyLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    color: "#74aecb",
  },
  scoreValue: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: 700,
    color: "#f4f8fd",
  },
  bodyMuted: {
    color: "#b1c5d8",
    fontSize: 9,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  link: {
    color: "#32d6ff",
    textDecoration: "underline",
    fontSize: 9,
  },
  ragBadge: {
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  tableHeader: {
    backgroundColor: "#0d2134",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  tableRow: {
    borderWidth: 1,
    borderColor: "#1c3244",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginTop: 5,
    backgroundColor: "#091220",
  },
  chip: {
    borderWidth: 1,
    borderColor: "#264257",
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 7,
    fontSize: 8,
    color: "#d4e5f2",
  },
  pageFooter: {
    position: "absolute",
    bottom: 16,
    left: 34,
    right: 34,
    borderTopWidth: 1,
    borderTopColor: "#1d3242",
    paddingTop: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#7f9ab0",
    fontSize: 8,
  },
});

function ragLabelColor(status: RAG) {
  if (status === "green") {
    return { backgroundColor: "#123e34", color: "#8ff5cc", borderColor: "#2b8f74" };
  }
  if (status === "amber") {
    return { backgroundColor: "#473312", color: "#ffd69a", borderColor: "#ab7c31" };
  }
  return { backgroundColor: "#4f1d28", color: "#ffc2cf", borderColor: "#c14b67" };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getClientIp(request: Request) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = pdfRateLimitStore.get(ip);

  if (!current || now > current.resetAt) {
    pdfRateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return true;
  }

  current.count += 1;
  pdfRateLimitStore.set(ip, current);
  return false;
}

function safeUrl(value: string | null) {
  if (!value) {
    return "https://example.co.uk";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "https://example.co.uk";
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(candidate).toString();
  } catch {
    return "https://example.co.uk";
  }
}

function parseHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "example.co.uk";
  }
}

function topActionFromFinding(finding: AuditResult["topFindings"][number], index: number) {
  const impactBase = finding.impact === "High" ? 13 : finding.impact === "Med" ? 9 : 6;
  const effortModifier = finding.effort === "S" ? 2 : finding.effort === "M" ? 0 : -2;
  const upliftLow = clamp(Math.round(impactBase + finding.scoreDelta * 0.35 + effortModifier - index), 5, 28);
  const upliftHigh = clamp(upliftLow + (finding.impact === "High" ? 12 : 8), upliftLow + 4, 44);

  return {
    title: finding.label,
    because: finding.evidence || "Signal detected in scan.",
    upliftRange: `+${upliftLow}% to +${upliftHigh}%`,
  };
}

function weakestStage(audit: AuditResult) {
  const stages = [
    { stage: "Traffic", score: Math.round((audit.scores.seo + audit.scores.visibility) / 2) },
    { stage: "Landing", score: audit.scores.speed },
    { stage: "Offer", score: audit.scores.conversion },
    { stage: "Lead", score: audit.scores.conversion },
    { stage: "Follow-up", score: audit.scores.trust },
    { stage: "Sale", score: Math.round((audit.scores.conversion + audit.scores.trust) / 2) },
  ].sort((a, b) => a.score - b.score);

  return stages[0]?.stage || "Offer";
}

function buildAuditPdfDocument(options: {
  audit: AuditResult;
  businessName: string;
  generatedDate: string;
  bespokeHref: string;
  rerunHref: string;
  bookHref: string;
  dashboardHref: string;
}) {
  const { audit, businessName, generatedDate, bespokeHref, rerunHref, bookHref, dashboardHref } = options;
  const topActions = audit.topFindings.slice(0, 3).map(topActionFromFinding);
  const stageWeak = weakestStage(audit);

  const categoryCards = [
    {
      label: "Overall",
      value: audit.dashboardScores.overall,
      rag: ragLabelColor(
        audit.dashboardScores.overall >= 90 ? "green" : audit.dashboardScores.overall >= 50 ? "amber" : "red",
      ),
    },
    {
      label: "Performance",
      value: audit.dashboardScores.performance,
      rag: ragLabelColor(
        audit.dashboardScores.performance >= 90 ? "green" : audit.dashboardScores.performance >= 50 ? "amber" : "red",
      ),
    },
    {
      label: "SEO",
      value: audit.dashboardScores.seo,
      rag: ragLabelColor(audit.dashboardScores.seo >= 90 ? "green" : audit.dashboardScores.seo >= 50 ? "amber" : "red"),
    },
    {
      label: "Accessibility",
      value: audit.dashboardScores.accessibility,
      rag: ragLabelColor(
        audit.dashboardScores.accessibility >= 90 ? "green" : audit.dashboardScores.accessibility >= 50 ? "amber" : "red",
      ),
    },
    {
      label: "Best Practices",
      value: audit.dashboardScores.bestPractices,
      rag: ragLabelColor(
        audit.dashboardScores.bestPractices >= 90 ? "green" : audit.dashboardScores.bestPractices >= 50 ? "amber" : "red",
      ),
    },
    {
      label: "Customer Experience",
      value: audit.dashboardScores.customerExperience,
      rag: ragLabelColor(
        audit.dashboardScores.customerExperience >= 90 ? "green" : audit.dashboardScores.customerExperience >= 50 ? "amber" : "red",
      ),
    },
  ];

  return (
    <Document title="DBA Website Growth Audit" author="Digital Business Assets" subject="Website Growth Audit">
      <Page size="A4" style={styles.page}>
        <View style={styles.frame}>
          <Text style={styles.tinyLabel}>Digital Business Assets</Text>
          <Text style={styles.heading}>Website Growth Audit</Text>
          <Text style={styles.subheading}>Prepared report with scorecards, top issues, benchmark context, and implementation path.</Text>

          <View style={{ marginTop: 24, ...styles.card }}>
            <Text style={styles.tinyLabel}>Prepared for</Text>
            <Text style={{ fontSize: 18, marginTop: 4, fontWeight: 700 }}>{businessName}</Text>
            <Text style={{ marginTop: 8, color: "#acc1d2" }}>Website: {audit.url}</Text>
            <Text style={{ marginTop: 3, color: "#acc1d2" }}>Date: {generatedDate}</Text>
          </View>

          <View style={{ marginTop: 20, ...styles.card }}>
            <Text style={{ fontSize: 11, color: "#d9e8f5" }}>This report diagnoses where your funnel leaks revenue and what to fix first.</Text>
            <Text style={{ marginTop: 6, color: "#a9bed0" }}>
              It is free to run. You can implement internally (Track 2) or have us implement the stack for you (Track 1).
            </Text>
          </View>

          <View style={{ marginTop: 24, ...styles.row }}>
            <View style={{ ...styles.chip }}>
              <Text>Consultant-grade output</Text>
            </View>
            <View style={{ ...styles.chip }}>
              <Text>Business-owner language</Text>
            </View>
            <View style={{ ...styles.chip }}>
              <Text>14-day action plan</Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text>Confidential — For internal use</Text>
          <Text>{siteConfig.legalName}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Executive Summary</Text>
        <Text style={styles.subheading}>{audit.narrative.executiveSummary}</Text>

        <View style={{ marginTop: 12, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {categoryCards.map((card) => (
            <View key={card.label} style={{ ...styles.card, width: "31%" }}>
              <Text style={styles.tinyLabel}>{card.label}</Text>
              <Text style={styles.scoreValue}>{card.value}/100</Text>
              <Text style={{ ...styles.ragBadge, ...card.rag }}>{card.value >= 90 ? "GREEN" : card.value >= 50 ? "AMBER" : "RED"}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Google Insights metrics</Text>
        <View style={{ ...styles.card }}>
          <Text style={{ ...styles.bodyMuted }}>
            {audit.pageExperience.source === "hybrid"
              ? "PSI connected: live Lighthouse metrics available."
              : "Estimate mode: connect PSI key for live Lighthouse metrics."}
          </Text>
          <View style={{ marginTop: 8, ...styles.row }}>
            <View style={{ ...styles.card, width: "32%" }}>
              <Text style={styles.tinyLabel}>LCP</Text>
              <Text style={{ marginTop: 3, fontSize: 11, color: "#f1f7fd" }}>
                {typeof audit.pageExperience.lcpMs === "number" ? `${audit.pageExperience.lcpMs}ms` : "Estimated"}
              </Text>
            </View>
            <View style={{ ...styles.card, width: "32%" }}>
              <Text style={styles.tinyLabel}>INP</Text>
              <Text style={{ marginTop: 3, fontSize: 11, color: "#f1f7fd" }}>
                {typeof audit.pageExperience.inpMs === "number" ? `${audit.pageExperience.inpMs}ms` : "Estimated"}
              </Text>
            </View>
            <View style={{ ...styles.card, width: "32%" }}>
              <Text style={styles.tinyLabel}>CLS</Text>
              <Text style={{ marginTop: 3, fontSize: 11, color: "#f1f7fd" }}>
                {typeof audit.pageExperience.cls === "number" ? audit.pageExperience.cls.toString() : "Estimated"}
              </Text>
            </View>
          </View>
          <Text style={{ marginTop: 6, ...styles.bodyMuted }}>
            Core Web Vitals status: {audit.pageExperience.cwvStatus}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Top 3 actions</Text>
        <View style={styles.col}>
          {topActions.map((action, index) => (
            <View key={action.title} style={styles.card}>
              <Text style={{ fontWeight: 700, fontSize: 11, color: "#edf5fc" }}>
                Action {index + 1}: {action.title}
              </Text>
              <Text style={{ marginTop: 4, ...styles.bodyMuted }}>Because we detected: {action.because}</Text>
              <Text style={{ marginTop: 3, color: "#49ddff" }}>Estimated uplift: {action.upliftRange}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Narrative</Text>
        <View style={styles.card}>
          <Text style={styles.bodyMuted}>{audit.narrative.whyItMatters}</Text>
        </View>

        <Text style={styles.sectionTitle}>What customers feel</Text>
        <View style={styles.card}>
          <Text style={styles.bodyMuted}>
            {audit.dashboardScores.customerExperience >= 90
              ? "Visitors can understand your offer quickly and move to action with low friction."
              : audit.dashboardScores.customerExperience >= 55
                ? "Visitors can navigate, but hesitation points still reduce conversion."
                : "Visitors are likely seeing early friction from speed, offer clarity, and trust cues."}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Top 5 findings snapshot</Text>
        <View style={styles.col}>
          {audit.topFindings.slice(0, 5).map((finding) => (
            <View key={`p2-${finding.id}`} style={styles.card}>
              <Text style={{ fontSize: 9, fontWeight: 700, color: "#edf7ff" }}>
                {finding.label} · {finding.status.toUpperCase()}
              </Text>
              <Text style={{ marginTop: 2, fontSize: 8.2, color: "#b8cbdb" }}>{finding.fix}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pageFooter}>
          <Text>Page 2 · Executive summary</Text>
          <Text>{siteConfig.url}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Findings + 14-Day Plan</Text>
        <Text style={styles.subheading}>Weakest funnel stage highlighted: {stageWeak}</Text>

        <View style={{ marginTop: 10, ...styles.card }}>
          <Text style={styles.tinyLabel}>Funnel diagram</Text>
          <Svg width="100%" height="72" viewBox="0 0 500 72">
            {[
              { label: "Traffic", x: 8 },
              { label: "Landing", x: 90 },
              { label: "Offer", x: 172 },
              { label: "Lead", x: 254 },
              { label: "Follow-up", x: 336 },
              { label: "Sale", x: 418 },
            ].map((node, index, arr) => (
              <>
                <Path
                  key={`${node.label}-box`}
                  d={`M${node.x} 18 h72 a8 8 0 0 1 8 8 v20 a8 8 0 0 1 -8 8 h-72 a8 8 0 0 1 -8 -8 v-20 a8 8 0 0 1 8 -8 z`}
                  fill={node.label === stageWeak ? "#4c1f2a" : "#0e1b2a"}
                  stroke={node.label === stageWeak ? "#e35d7f" : "#2b4a62"}
                  strokeWidth={1.4}
                />
                <Text key={`${node.label}-text`} style={{ fontSize: 7, fill: "#e7f3fc" }} x={node.x + 16} y={38}>
                  {node.label}
                </Text>
                {index < arr.length - 1 ? (
                  <Path
                    key={`${node.label}-arrow`}
                    d={`M${node.x + 80} 36 H${arr[index + 1].x - 6}`}
                    stroke="#33d4ff"
                    strokeWidth={1.3}
                  />
                ) : null}
              </>
            ))}
          </Svg>
        </View>

        <Text style={styles.sectionTitle}>Top findings</Text>
        <View style={styles.tableHeader}>
          <Text style={{ fontSize: 8, color: "#d3e7f8" }}>Finding · Category · Status · Effort · Impact · Fix</Text>
        </View>
        {audit.topFindings.slice(0, 10).map((finding) => (
          <View key={finding.id} style={styles.tableRow}>
            <Text style={{ fontSize: 8.3, fontWeight: 700, color: "#e8f4fc" }}>{finding.label}</Text>
            <Text style={{ marginTop: 2, fontSize: 7.8, color: "#a9bed0" }}>
              {finding.category} · {finding.status.toUpperCase()} · Effort {finding.effort} · Impact {finding.impact}
            </Text>
            <Text style={{ marginTop: 2, fontSize: 7.6, color: "#b8cbdb" }}>{finding.fix || "Apply remediation guidance."}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Content quality</Text>
        <View style={styles.card}>
          <Text style={{ fontSize: 10, fontWeight: 700, color: "#edf7ff" }}>
            Content score: {audit.contentClarity.score}/100
          </Text>
          <Text style={{ marginTop: 4, ...styles.bodyMuted }}>{audit.contentClarity.diagnosticSummary}</Text>
        </View>

        {audit.competitors?.length ? (
          <>
            <Text style={styles.sectionTitle}>Competitor benchmark</Text>
            <View style={styles.col}>
              {audit.competitors.slice(0, 3).map((competitor) => (
                <View key={competitor.domain} style={styles.card}>
                  <Text style={{ fontSize: 9.5, fontWeight: 700, color: "#edf7ff" }}>{competitor.domain}</Text>
                  <Text style={{ marginTop: 2, ...styles.bodyMuted }}>
                    Overall {competitor.scores.overall} · SEO {competitor.scores.seo} · Meta {competitor.hasMetaDescription ? "yes" : "no"} · Schema{" "}
                    {competitor.hasJsonLd ? "yes" : "no"}
                  </Text>
                  <Text style={{ marginTop: 2, ...styles.bodyMuted }}>
                    CTA clarity {competitor.hasCta ? "strong" : "weak"} · Content depth {competitor.contentDepth} words
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>14-day rollout</Text>
        <View style={styles.col}>
          <View style={styles.card}>
            <Text style={{ fontWeight: 700, color: "#46dcff" }}>Day 1-3</Text>
            <Text style={styles.bodyMuted}>{audit.recommendedModules[0]?.action || "Fix top conversion and SEO blockers."}</Text>
          </View>
          <View style={styles.card}>
            <Text style={{ fontWeight: 700, color: "#46dcff" }}>Day 4-7</Text>
            <Text style={styles.bodyMuted}>{audit.recommendedModules[2]?.action || "Deploy trust and speed improvements across core pages."}</Text>
          </View>
          <View style={styles.card}>
            <Text style={{ fontWeight: 700, color: "#46dcff" }}>Day 8-14</Text>
            <Text style={styles.bodyMuted}>{audit.recommendedModules[4]?.action || "Automate follow-up and lock reporting visibility."}</Text>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text>Page 3 · Findings and plan</Text>
          <Text>{siteConfig.url}</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>How DBA Operates</Text>
        <Text style={styles.subheading}>One-stop growth system: tools first, implementation optional.</Text>

        <View style={{ marginTop: 12, ...styles.row }}>
          <View style={{ ...styles.card, width: "49%" }}>
            <Text style={{ fontWeight: 700, color: "#43daff" }}>Track 1 · Done-for-you</Text>
            <Text style={{ marginTop: 6, ...styles.bodyMuted }}>• Website + conversion rebuild</Text>
            <Text style={styles.bodyMuted}>• SEO + authority uplift</Text>
            <Text style={styles.bodyMuted}>• CRM + follow-up automation</Text>
            <Text style={styles.bodyMuted}>• Reporting + optimisation cadence</Text>
          </View>
          <View style={{ ...styles.card, width: "49%" }}>
            <Text style={{ fontWeight: 700, color: "#43daff" }}>Track 2 · DIY + support</Text>
            <Text style={{ marginTop: 6, ...styles.bodyMuted }}>• Keep scanning and benchmarking</Text>
            <Text style={styles.bodyMuted}>• Fix highest-impact issues first</Text>
            <Text style={styles.bodyMuted}>• Use simulator for revenue projection</Text>
            <Text style={styles.bodyMuted}>• Add modules only when needed</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recommended modules (clickable)</Text>
        <View style={styles.col}>
          {audit.recommendedModules.slice(0, 6).map((module) => (
            <View key={module.id} style={styles.card}>
              <Text style={{ fontSize: 10, fontWeight: 700, color: "#edf7ff" }}>{module.title}</Text>
              <Text style={{ marginTop: 2, fontSize: 8.5, color: "#9fbbd1" }}>{module.why}</Text>
              <Link style={styles.link} src={`${siteConfig.url}${module.href}`}>
                Open module
              </Link>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Next steps</Text>
        <View style={styles.card}>
          <Link style={styles.link} src={dashboardHref}>
            Your dashboard link
          </Link>
          <Link style={styles.link} src={`${siteConfig.url}/services`}>
            Explore all services
          </Link>
          <Link style={styles.link} src={bespokeHref}>
            Build bespoke plan
          </Link>
          <Link style={styles.link} src={bookHref}>
            Book a call
          </Link>
          <Link style={styles.link} src={rerunHref}>
            Run another scan
          </Link>
        </View>

        <View style={styles.pageFooter}>
          <Text>{siteConfig.legalName} · {siteConfig.email}</Text>
          <Text>Page 4 · Next steps</Text>
        </View>
      </Page>
    </Document>
  );
}

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: "Too many PDF requests. Please wait and try again." }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const url = safeUrl(searchParams.get("url"));
    const industry = searchParams.get("industry")?.trim() || "service";
    const goal = searchParams.get("goal")?.trim() || "leads";
    const competitors = parseCompetitorList(searchParams.get("competitors") || undefined);
    const businessName = searchParams.get("businessName")?.trim() || parseHostname(url);
    const leadId = searchParams.get("leadId")?.trim() || undefined;
    const reportId = searchParams.get("rid")?.trim() || undefined;
    const auditRunId = searchParams.get("auditRunId")?.trim() || undefined;

    const audit = await runWebsiteGrowthAudit({
      url,
      industry,
      goal,
      competitors,
      businessName,
    });

    const hostname = parseHostname(audit.url);
    const date = new Date(audit.generatedAt);
    const dateStr = date.toISOString().slice(0, 10);

    const bespokeHref = `${siteConfig.url}/bespoke-plan?track=track1&website=${encodeURIComponent(audit.url)}&industry=${encodeURIComponent(
      audit.industry || "service",
    )}&goal=${encodeURIComponent(audit.goal || "leads")}&topAction=${encodeURIComponent(audit.topFindings[0]?.label || "Growth plan")}`;
    const rerunHref = `${siteConfig.url}/tools/website-audit/start`;
    const bookHref = `${siteConfig.url}/book?source=audit-pdf&website=${encodeURIComponent(audit.url)}&industry=${encodeURIComponent(
      audit.industry || "service",
    )}`;
    let dashboardHref = `${siteConfig.url}/portal`;
    if (leadId) {
      const portal = await createPortalSessionForLeadId(leadId);
      if (portal?.url) {
        dashboardHref = portal.url;
      }
    }

    const doc = buildAuditPdfDocument({
      audit,
      businessName,
      generatedDate: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      bespokeHref,
      rerunHref,
      bookHref,
      dashboardHref,
    });

    const buffer = await renderToBuffer(doc);
    const bytes = new Uint8Array(buffer);
    const filename = `DBA-Website-Audit-${hostname}-${dateStr}.pdf`;

    await logAuditEvent({
      type: "pdf_downloaded",
      leadId,
      auditRunId,
      payload: {
        reportId,
        url: audit.url,
        industry,
        goal,
      },
    });

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${filename}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api/audit/pdf] generation failed", error);
    return NextResponse.json({ error: "Could not generate audit PDF." }, { status: 500 });
  }
}
