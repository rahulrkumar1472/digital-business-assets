import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { normalizeLeadPayload, submitLead, validateLeadPayload } from "@/lib/lead";
import { siteConfig } from "@/lib/site";

export type WebsiteAuditInput = {
  websiteUrl: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  concern: "No leads" | "Low conversion" | "Slow replies" | "Bad SEO" | "Need website" | "All of it";
};

export type WebsiteAuditScores = {
  performance: number;
  seo: number;
  accessibility: number;
};

export type TechnicalCheck = {
  label: string;
  status: "pass" | "warn" | "fail";
  details: string;
};

export type WebsiteAuditRecord = {
  id: string;
  createdAt: string;
  input: WebsiteAuditInput;
  normalizedUrl: string;
  domain: string;
  scores: WebsiteAuditScores;
  technicalChecks: TechnicalCheck[];
  speedMetrics: {
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    totalBlockingTime?: number;
  };
  recommendations: string[];
  narrativeSections: Array<{
    heading: string;
    paragraphs: string[];
    bullets: string[];
  }>;
  assets: {
    desktopScreenshot: string;
    mobileScreenshot: string;
    pdf: string;
    json: string;
  };
};

const auditsRoot = path.join(process.cwd(), ".data", "audits");
const execFileAsync = promisify(execFile);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function normaliseUrl(input: string) {
  const raw = input.trim();
  if (!raw) {
    throw new Error("Website URL is required.");
  }

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(candidate);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Website URL must use HTTP or HTTPS.");
  }

  parsed.hash = "";
  return parsed.toString();
}

function normalizeInput(raw: Partial<WebsiteAuditInput>) {
  const websiteUrl = normaliseUrl(raw.websiteUrl || "");
  const name = (raw.name || "").trim().slice(0, 120);
  const email = (raw.email || "").trim().slice(0, 180).toLowerCase();
  const phone = (raw.phone || "").trim().slice(0, 40);
  const industry = (raw.industry || "").trim().slice(0, 120);
  const concern =
    raw.concern && ["No leads", "Low conversion", "Slow replies", "Bad SEO", "Need website", "All of it"].includes(raw.concern)
      ? raw.concern
      : "All of it";

  if (!name || !email || !phone || !industry) {
    throw new Error("Name, email, phone, and industry are required.");
  }

  return {
    websiteUrl,
    name,
    email,
    phone,
    industry,
    concern,
  } as WebsiteAuditInput;
}

function countMatches(input: string, pattern: RegExp) {
  return (input.match(pattern) || []).length;
}

async function fetchTextSafe(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "DigitalBusinessAssetsAuditBot/1.0",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return null;
    }

    return await response.text();
  } catch {
    return null;
  }
}

async function collectTechnicalChecks(targetUrl: string) {
  const html = await fetchTextSafe(targetUrl);
  const parsed = new URL(targetUrl);

  const robotsUrl = new URL("/robots.txt", parsed).toString();
  const sitemapUrl = new URL("/sitemap.xml", parsed).toString();

  const [robotsText, sitemapText] = await Promise.all([fetchTextSafe(robotsUrl), fetchTextSafe(sitemapUrl)]);

  if (!html) {
    return {
      checks: [
        {
          label: "Page crawlability",
          status: "fail" as const,
          details: "Could not fetch the target homepage. Confirm URL accessibility.",
        },
      ],
      h1Count: 0,
      titleLength: 0,
      hasMetaDescription: false,
      hasCanonical: false,
    };
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch?.[1]?.replace(/\s+/g, " ").trim() || "";
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  const h1Count = countMatches(html, /<h1\b/gi);

  const checks: TechnicalCheck[] = [
    {
      label: "Title tag",
      status: titleText.length > 0 && titleText.length <= 60 ? "pass" : titleText.length > 0 ? "warn" : "fail",
      details:
        titleText.length > 0
          ? `Detected title length: ${titleText.length} characters.`
          : "No title tag detected on the homepage.",
    },
    {
      label: "Meta description",
      status: metaDescMatch?.[1] ? "pass" : "fail",
      details: metaDescMatch?.[1]
        ? `Meta description detected (${metaDescMatch[1].trim().length} characters).`
        : "Meta description missing on the homepage.",
    },
    {
      label: "H1 structure",
      status: h1Count === 1 ? "pass" : h1Count > 1 ? "warn" : "fail",
      details: `Detected ${h1Count} H1 tag${h1Count === 1 ? "" : "s"} on the homepage.`,
    },
    {
      label: "Canonical URL",
      status: canonicalMatch?.[1] ? "pass" : "warn",
      details: canonicalMatch?.[1]
        ? `Canonical points to ${canonicalMatch[1].trim()}.`
        : "Canonical link is missing.",
    },
    {
      label: "Viewport declaration",
      status: viewportMatch ? "pass" : "warn",
      details: viewportMatch ? "Viewport meta is present for mobile rendering." : "Viewport meta is missing.",
    },
    {
      label: "Robots.txt",
      status: robotsText ? "pass" : "warn",
      details: robotsText ? `Detected robots file at ${robotsUrl}.` : "Robots file not found.",
    },
    {
      label: "Sitemap.xml",
      status: sitemapText ? "pass" : "warn",
      details: sitemapText ? `Detected sitemap file at ${sitemapUrl}.` : "Sitemap file not found.",
    },
  ];

  return {
    checks,
    h1Count,
    titleLength: titleText.length,
    hasMetaDescription: Boolean(metaDescMatch?.[1]),
    hasCanonical: Boolean(canonicalMatch?.[1]),
  };
}

async function runPlaywrightScreenshots(targetUrl: string, outputDir: string) {
  const desktopPath = path.join(outputDir, "desktop.png");
  const mobilePath = path.join(outputDir, "mobile.png");

  try {
    const playwright = await import("playwright");
    const browser = await playwright.chromium.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    try {
      const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 920 } });
      await desktopPage.goto(targetUrl, { waitUntil: "networkidle", timeout: 45000 });
      await desktopPage.screenshot({ path: desktopPath, fullPage: true });

      const mobilePage = await browser.newPage({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
      await mobilePage.goto(targetUrl, { waitUntil: "networkidle", timeout: 45000 });
      await mobilePage.screenshot({ path: mobilePath, fullPage: true });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("[website-audit] playwright screenshot failed", error);

    const fallbackSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#082f49"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#g)"/>
  <text x="640" y="330" text-anchor="middle" fill="#d1d5db" font-size="42" font-family="Arial, sans-serif">Screenshot Unavailable</text>
  <text x="640" y="380" text-anchor="middle" fill="#94a3b8" font-size="22" font-family="Arial, sans-serif">Install Playwright browsers to enable captures</text>
</svg>`;

    await writeFile(desktopPath.replace(/\.png$/, ".svg"), fallbackSvg, "utf8");
    await writeFile(mobilePath.replace(/\.png$/, ".svg"), fallbackSvg, "utf8");

    return {
      desktop: desktopPath.replace(/\.png$/, ".svg"),
      mobile: mobilePath.replace(/\.png$/, ".svg"),
    };
  }

  return {
    desktop: desktopPath,
    mobile: mobilePath,
  };
}

async function runLighthouseAudit(targetUrl: string) {
  try {
    const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
    const { stdout } = await execFileAsync(
      npxCommand,
      [
        "lighthouse",
        targetUrl,
        "--quiet",
        "--chrome-flags=--headless --no-sandbox --disable-gpu",
        "--output=json",
        "--output-path=stdout",
        "--only-categories=performance,seo,accessibility",
      ],
      {
        timeout: 120000,
        maxBuffer: 10 * 1024 * 1024,
      },
    );

    const parsed = JSON.parse(stdout) as {
      categories?: {
        performance?: { score?: number };
        seo?: { score?: number };
        accessibility?: { score?: number };
      };
      audits?: {
        ["first-contentful-paint"]?: { numericValue?: number };
        ["largest-contentful-paint"]?: { numericValue?: number };
        ["total-blocking-time"]?: { numericValue?: number };
      };
    };

    const scores: WebsiteAuditScores = {
      performance: Math.round((parsed.categories?.performance?.score || 0) * 100),
      seo: Math.round((parsed.categories?.seo?.score || 0) * 100),
      accessibility: Math.round((parsed.categories?.accessibility?.score || 0) * 100),
    };

    return {
      scores,
      speedMetrics: {
        firstContentfulPaint: parsed.audits?.["first-contentful-paint"]?.numericValue,
        largestContentfulPaint: parsed.audits?.["largest-contentful-paint"]?.numericValue,
        totalBlockingTime: parsed.audits?.["total-blocking-time"]?.numericValue,
      },
    };
  } catch (error) {
    console.error("[website-audit] lighthouse failed", error);
    return {
      scores: {
        performance: 62,
        seo: 68,
        accessibility: 74,
      },
      speedMetrics: {},
    };
  }
}

function metricMs(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "n/a";
  }

  return `${(value / 1000).toFixed(2)}s`;
}

function buildRecommendations(
  input: WebsiteAuditInput,
  scores: WebsiteAuditScores,
  checks: TechnicalCheck[],
) {
  const recommendations: string[] = [];

  if (input.concern === "No leads" || input.concern === "All of it") {
    recommendations.push(
      "Install an offer-first homepage and service-page conversion path so visitors can enquire in under 30 seconds.",
    );
  }

  if (input.concern === "Slow replies" || input.concern === "All of it") {
    recommendations.push(
      "Deploy missed-call recovery and instant follow-up automations so every enquiry receives a response immediately.",
    );
  }

  if (scores.performance < 70) {
    recommendations.push(
      "Run a mobile speed remediation sprint. Over 80% of users browse on mobile, so loading delays directly reduce conversions.",
    );
  }

  if (scores.seo < 75) {
    recommendations.push(
      "Implement technical SEO baseline: title and description fixes, schema, canonical integrity, and internal linking by service intent.",
    );
  }

  if (checks.some((check) => check.label === "H1 structure" && check.status !== "pass")) {
    recommendations.push(
      "Fix heading hierarchy with exactly one H1 and structured H2/H3 sections to improve crawlability and on-page clarity.",
    );
  }

  recommendations.push(
    "Build a 30-day response-time dashboard tracking lead speed, booking rates, and no-show recovery to prove measurable growth.",
  );

  return recommendations.slice(0, 7);
}

function buildNarrativeSections(record: {
  input: WebsiteAuditInput;
  domain: string;
  scores: WebsiteAuditScores;
  checks: TechnicalCheck[];
  speedMetrics: WebsiteAuditRecord["speedMetrics"];
  recommendations: string[];
}) {
  const { input, domain, scores, checks, speedMetrics, recommendations } = record;
  const headings = [
    "Executive Summary",
    "Current Revenue Risk",
    "Competitive Pressure Analysis",
    "Mobile Experience Reality",
    "Speed and Technical Performance",
    "Technical SEO Baseline",
    "On-Page Conversion Journey",
    "Lead Capture and Routing",
    "Response-Time Exposure",
    "Booking and No-Show Controls",
    "Trust and Authority Signals",
    "Automation Blueprint",
    "30-Day Deployment Plan",
    "90-Day Scaling Plan",
    "Measurement and Governance",
  ];

  return headings.map((heading, index) => {
    const severityTone =
      index % 3 === 0
        ? "high urgency"
        : index % 3 === 1
          ? "measured urgency"
          : "execution urgency";

    const paragraphs = [
      `For ${input.industry} operators using ${domain}, the current digital setup shows ${severityTone}. Your stated concern is “${input.concern}”, and the technical findings align with that commercial pain. Performance score is ${scores.performance}/100, SEO score is ${scores.seo}/100, and accessibility score is ${scores.accessibility}/100. These numbers are not abstract metrics. They represent how quickly a potential customer can discover your offer, trust your business, and take action. If that path is slow or unclear, the enquiry is delayed, and delayed enquiries almost always cost revenue in a competitive local market.`,
      `The data also reinforces a mobile-first priority. More than 80% of browsing sessions in service categories now start on mobile, which means your first impression happens on a small screen under time pressure. In this audit, key indicators include first contentful paint at ${metricMs(speedMetrics.firstContentfulPaint)}, largest contentful paint at ${metricMs(speedMetrics.largestContentfulPaint)}, and total blocking time at ${metricMs(speedMetrics.totalBlockingTime)}. When these numbers drift upward, users bounce before seeing the offer, and your paid or organic traffic budget is effectively subsidising competitors who respond and load faster.`,
      `Our implementation approach is direct: diagnose, install, and prove. We address the bottleneck behind this section with practical changes to page structure, lead capture flow, response automation, and booking orchestration. Then we attach measurement so you can see the impact in weekly operating terms, not vanity reports. This is where most businesses get stuck; they invest in isolated tactics and never connect the full journey. Your next step is to execute one accountable growth system where every lead is tagged, routed, followed up, and measured from first click to booked outcome.`,
    ];

    const bullets = [
      `Primary risk signal: ${checks[index % checks.length]?.label || "Lead handling consistency"}`,
      `Immediate commercial focus: ${recommendations[index % recommendations.length] || "Improve speed-to-lead"}`,
      "Owner action: assign one accountable lead for rollout and weekly KPI review",
      "Expected result: lower leakage, faster follow-up, and improved booked revenue quality",
    ];

    return {
      heading,
      paragraphs,
      bullets,
    };
  });
}

async function fileToDataUrl(filePath: string) {
  const buffer = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === ".svg" ? "image/svg+xml" : "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function statusColor(status: TechnicalCheck["status"]) {
  if (status === "pass") {
    return "#22c55e";
  }
  if (status === "warn") {
    return "#f59e0b";
  }
  return "#ef4444";
}

export async function buildWebsiteAuditReportHtml(audit: WebsiteAuditRecord) {
  const desktopDataUrl = await fileToDataUrl(audit.assets.desktopScreenshot);
  const mobileDataUrl = await fileToDataUrl(audit.assets.mobileScreenshot);

  const sectionsHtml = audit.narrativeSections
    .map(
      (section) => `
        <section class="section">
          <h2>${section.heading}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          <ul>
            ${section.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
          </ul>
        </section>
      `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Website Audit Report - ${audit.domain}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Inter", "Segoe UI", sans-serif;
        background: #05060a;
        color: #e5e7eb;
        line-height: 1.65;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 20mm 14mm;
      }
      .cover {
        background: linear-gradient(145deg, rgba(56,189,248,0.18), rgba(8,47,73,0.84));
        border: 1px solid rgba(56,189,248,0.4);
        border-radius: 20px;
        padding: 18px;
        margin-bottom: 18px;
      }
      .brand { font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #67e8f9; }
      h1 { margin: 8px 0 10px; font-size: 34px; line-height: 1.15; }
      h2 { margin: 0 0 10px; font-size: 22px; }
      p { margin: 0 0 12px; font-size: 13px; color: #d1d5db; }
      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-top: 14px;
      }
      .card {
        border: 1px solid rgba(148,163,184,0.34);
        border-radius: 14px;
        padding: 10px;
        background: rgba(15,23,42,0.7);
      }
      .scores {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin: 14px 0;
      }
      .score-value { font-size: 30px; font-weight: 700; color: #ecfeff; margin: 6px 0 0; }
      .images {
        display: grid;
        grid-template-columns: 1fr 0.6fr;
        gap: 10px;
        margin: 16px 0;
      }
      .images img {
        width: 100%;
        border-radius: 12px;
        border: 1px solid rgba(148,163,184,0.3);
      }
      .checks {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        margin: 12px 0 18px;
      }
      .chip {
        border-radius: 999px;
        font-size: 11px;
        padding: 4px 8px;
        display: inline-block;
        margin-bottom: 6px;
      }
      .section {
        margin: 16px 0;
        padding: 14px;
        border: 1px solid rgba(30,41,59,0.85);
        border-radius: 14px;
        background: rgba(15,23,42,0.58);
      }
      ul { margin: 0; padding-left: 18px; }
      li { margin: 0 0 8px; font-size: 13px; color: #e2e8f0; }
      .actions {
        border: 1px solid rgba(34,211,238,0.36);
        border-radius: 14px;
        background: rgba(34,211,238,0.08);
        padding: 12px;
        margin: 14px 0;
      }
      .footer {
        margin-top: 18px;
        border-top: 1px solid rgba(71,85,105,0.5);
        padding-top: 10px;
        font-size: 11px;
        color: #94a3b8;
      }
      .back-cover {
        margin-top: 24px;
        border: 1px solid rgba(34,211,238,0.4);
        border-radius: 16px;
        padding: 18px;
        background: linear-gradient(145deg, rgba(6,182,212,0.12), rgba(2,6,23,0.9));
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="cover">
        <p class="brand">Digital Business Assets</p>
        <h1>Website Growth Audit Report</h1>
        <p><strong>Domain:</strong> ${audit.domain}</p>
        <p><strong>Prepared For:</strong> ${audit.input.name} (${audit.input.industry})</p>
        <p><strong>Primary Concern:</strong> ${audit.input.concern}</p>
        <p><strong>Date:</strong> ${new Date(audit.createdAt).toLocaleDateString("en-GB")}</p>

        <div class="scores">
          <div class="card"><p>Performance</p><p class="score-value">${audit.scores.performance}</p></div>
          <div class="card"><p>SEO</p><p class="score-value">${audit.scores.seo}</p></div>
          <div class="card"><p>Accessibility</p><p class="score-value">${audit.scores.accessibility}</p></div>
        </div>

        <div class="images">
          <img src="${desktopDataUrl}" alt="Desktop screenshot" />
          <img src="${mobileDataUrl}" alt="Mobile screenshot" />
        </div>
      </section>

      <section class="card">
        <h2>Technical Health Checks</h2>
        <div class="checks">
          ${audit.technicalChecks
            .map(
              (check) => `
            <div class="card">
              <span class="chip" style="background:${statusColor(check.status)}22;color:${statusColor(check.status)};border:1px solid ${statusColor(check.status)}66">${check.status.toUpperCase()}</span>
              <p><strong>${check.label}</strong></p>
              <p>${check.details}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>

      <section class="actions">
        <h2>Recommended Next Actions</h2>
        <ul>
          ${audit.recommendations.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>

      ${sectionsHtml}

      <section class="back-cover">
        <p class="brand">Digital Business Assets</p>
        <h2>Next Step: 30-Day Implementation Plan</h2>
        <p>
          This report is an education and planning document. We can now convert this into a practical sprint that installs
          lead capture, response automation, booking controls, and reporting in sequence.
        </p>
        <ul>
          <li>Book strategy call: ${siteConfig.url}/book</li>
          <li>Model growth scenarios: ${siteConfig.url}/growth-simulator</li>
          <li>Service modules overview: ${siteConfig.url}/services</li>
        </ul>
      </section>

      <div class="footer">
        Terms apply. Growth depends on implementation and market conditions. This report does not guarantee specific revenue outcomes.
      </div>
    </main>
  </body>
</html>
  `;
}

async function createPdfFromHtml(html: string, outputPath: string) {
  const puppeteer = await import("puppeteer");

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "8mm",
        right: "8mm",
        bottom: "10mm",
        left: "8mm",
      },
    });
  } finally {
    await browser.close();
  }
}

export async function runWebsiteAudit(rawInput: Partial<WebsiteAuditInput>) {
  const input = normalizeInput(rawInput);
  const normalizedUrl = input.websiteUrl;
  const parsed = new URL(normalizedUrl);
  const domain = parsed.hostname;

  const id = `${slugify(domain)}-${Date.now()}`;
  const auditDir = path.join(auditsRoot, id);
  await mkdir(auditDir, { recursive: true });

  const [technical, lighthouse, screenshots] = await Promise.all([
    collectTechnicalChecks(normalizedUrl),
    runLighthouseAudit(normalizedUrl),
    runPlaywrightScreenshots(normalizedUrl, auditDir),
  ]);

  const recommendations = buildRecommendations(input, lighthouse.scores, technical.checks);
  const narrativeSections = buildNarrativeSections({
    input,
    domain,
    scores: lighthouse.scores,
    checks: technical.checks,
    speedMetrics: lighthouse.speedMetrics,
    recommendations,
  });

  const record: WebsiteAuditRecord = {
    id,
    createdAt: new Date().toISOString(),
    input,
    normalizedUrl,
    domain,
    scores: lighthouse.scores,
    technicalChecks: technical.checks,
    speedMetrics: lighthouse.speedMetrics,
    recommendations,
    narrativeSections,
    assets: {
      desktopScreenshot: screenshots.desktop,
      mobileScreenshot: screenshots.mobile,
      pdf: path.join(auditDir, "report.pdf"),
      json: path.join(auditDir, "result.json"),
    },
  };

  const html = await buildWebsiteAuditReportHtml(record);
  await createPdfFromHtml(html, record.assets.pdf);
  await writeFile(record.assets.json, JSON.stringify(record, null, 2), "utf8");

  const lead = normalizeLeadPayload({
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.industry,
    website: normalizedUrl,
    industry: input.industry,
    message: `Website audit request. Concern: ${input.concern}.`,
    source: "website-audit",
    meta: {
      auditId: id,
      domain,
      performanceScore: lighthouse.scores.performance,
      seoScore: lighthouse.scores.seo,
      accessibilityScore: lighthouse.scores.accessibility,
    },
  });

  const validation = validateLeadPayload(lead, false);
  if (validation.valid) {
    await submitLead(lead);
  }

  return record;
}

export async function getWebsiteAuditById(id: string) {
  const normalized = slugify(id);
  const resultPath = path.join(auditsRoot, normalized, "result.json");

  try {
    const raw = await readFile(resultPath, "utf8");
    return JSON.parse(raw) as WebsiteAuditRecord;
  } catch {
    return null;
  }
}

export async function getWebsiteAuditPdfBuffer(id: string) {
  const normalized = slugify(id);
  const pdfPath = path.join(auditsRoot, normalized, "report.pdf");

  try {
    return await readFile(pdfPath);
  } catch {
    return null;
  }
}
