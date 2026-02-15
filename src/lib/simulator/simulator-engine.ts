import { mapRecommendedModules } from "@/lib/scans/module-map";

export type OfferType = "local-service" | "ecom" | "lead-gen" | "saas";
export type LocationIntent = "local" | "national" | "international";
export type GrowthGoal = "more-leads" | "more-bookings" | "more-sales" | "higher-aov" | "lower-cpl";
export type ScenarioMode = "conservative" | "realistic" | "aggressive";

export type SimulatorTrustSignals = {
  reviews: boolean;
  caseStudies: boolean;
  guarantees: boolean;
  certifications: boolean;
};

export type SimulatorLeadCapturePoints = {
  websiteForm: boolean;
  whatsapp: boolean;
  phone: boolean;
  bookingTool: boolean;
};

export type SimulatorInputs = {
  domain?: string;
  businessName?: string;
  industry: string;
  offerType: OfferType;
  locationIntent: LocationIntent;
  goal: GrowthGoal;
  visitors: number;
  conversionRate: number | null;
  avgOrderValue: number;
  closeRate: number | null;
  grossMargin: number | null;
  responseTimeMinutes: number;
  followups: number;
  leadCapturePoints: SimulatorLeadCapturePoints;
  trustSignals: SimulatorTrustSignals;
  currency?: "GBP";
};

type SimulatorStageKey = "traffic" | "lead" | "appointment" | "sale" | "repeat";

export type SimulatorMetric = {
  key: "acquisition" | "conversion" | "speedToLead" | "trustProof" | "retention";
  label: string;
  score: number;
  whatItMeans: string;
  whyItMatters: string;
  nextSteps: string[];
  fixModule: {
    label: string;
    href: string;
  };
};

export type SimulatorScenario = {
  key: ScenarioMode;
  label: string;
  conversionUpliftPct: number;
  closeRateUpliftPct: number;
  responseTimeImprovementPct: number;
  projectedLeadDelta: number;
  projectedSalesDelta: number;
  projectedRevenueDelta: number;
  businessValue: string;
};

export type SimulatorStage = {
  key: SimulatorStageKey;
  label: string;
  score: number;
  rag: "green" | "amber" | "red";
};

export type SimulatorTopMove = {
  id: string;
  title: string;
  why: string;
  businessImpact: string;
  upliftLowPct: number;
  upliftHighPct: number;
  effort: "Low" | "Med" | "High";
  timeToImpact: string;
  diy: {
    label: string;
    href: string;
  };
  doneForYou: {
    label: string;
    href: string;
  };
};

export type SimulatorOutput = {
  assumptions: {
    conversionRateWasDefault: boolean;
    closeRateWasDefault: boolean;
    grossMarginWasDefault: boolean;
    defaultsUsed: string[];
  };
  baseline: {
    leadsPerMonth: number;
    salesPerMonth: number;
    revenuePerMonth: number;
    profitPerMonth: number | null;
  };
  summaryScore: number;
  metrics: SimulatorMetric[];
  scenarios: SimulatorScenario[];
  funnel: {
    stages: SimulatorStage[];
    weakestStage: SimulatorStage;
    explanation: [string, string, string];
  };
  topMoves: SimulatorTopMove[];
  recommendedModules: Array<{
    id: string;
    title: string;
    href: string;
  }>;
};

const conversionDefaultsByOffer: Record<OfferType, number> = {
  "local-service": 3.2,
  ecom: 1.8,
  "lead-gen": 2.6,
  saas: 2.2,
};

const closeRateDefaultsByOffer: Record<OfferType, number> = {
  "local-service": 34,
  ecom: 3.4,
  "lead-gen": 23,
  saas: 19,
};

const metricFixLinks = {
  acquisition: { label: "SEO Upgrade Pack", href: "/services/seo-upgrade-pack" },
  conversion: { label: "Website Pro Build", href: "/services/website-pro-build" },
  speedToLead: { label: "Follow-up Automation", href: "/services/follow-up-automation" },
  trustProof: { label: "Trust + Conversion Upgrade", href: "/services/website-pro-build" },
  retention: { label: "CRM Setup", href: "/services/crm-setup" },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, precision = 0) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function toRag(score: number): "green" | "amber" | "red" {
  if (score >= 90) return "green";
  if (score >= 50) return "amber";
  return "red";
}

function resolveDomainLabel(input: Pick<SimulatorInputs, "domain" | "businessName">) {
  if (input.businessName?.trim()) return input.businessName.trim();
  if (!input.domain?.trim()) return "your business";
  try {
    const parsed = /^https?:\/\//i.test(input.domain) ? new URL(input.domain) : new URL(`https://${input.domain}`);
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return input.domain.trim();
  }
}

function resolveConversionRate(inputs: SimulatorInputs) {
  const defaultRate = conversionDefaultsByOffer[inputs.offerType];
  if (typeof inputs.conversionRate === "number" && Number.isFinite(inputs.conversionRate) && inputs.conversionRate > 0) {
    return { value: clamp(inputs.conversionRate, 0.2, 80), isDefault: false };
  }
  return { value: defaultRate, isDefault: true };
}

function resolveCloseRate(inputs: SimulatorInputs) {
  const defaultRate = closeRateDefaultsByOffer[inputs.offerType];
  if (typeof inputs.closeRate === "number" && Number.isFinite(inputs.closeRate) && inputs.closeRate > 0) {
    return { value: clamp(inputs.closeRate, 0.2, 95), isDefault: false };
  }
  return { value: defaultRate, isDefault: true };
}

function resolveGrossMargin(inputs: SimulatorInputs) {
  if (typeof inputs.grossMargin === "number" && Number.isFinite(inputs.grossMargin) && inputs.grossMargin > 0) {
    return { value: clamp(inputs.grossMargin, 5, 95), isDefault: false };
  }
  return { value: null as number | null, isDefault: true };
}

function buildMetricScores(inputs: SimulatorInputs, normalized: { conversionRate: number; closeRate: number }) {
  const trustCount = Object.values(inputs.trustSignals).filter(Boolean).length;
  const captureCount = Object.values(inputs.leadCapturePoints).filter(Boolean).length;
  const visitorsScore = clamp(Math.round(Math.log10(Math.max(inputs.visitors, 10)) * 18), 10, 38);

  let acquisition = 40 + visitorsScore + captureCount * 5;
  if (inputs.locationIntent === "local" && inputs.offerType === "local-service") acquisition += 8;
  if (inputs.goal === "more-leads" || inputs.goal === "lower-cpl") acquisition += 4;
  acquisition = clamp(Math.round(acquisition), 0, 100);

  const conversionBenchmark = conversionDefaultsByOffer[inputs.offerType];
  const conversionRatio = normalized.conversionRate / conversionBenchmark;
  let conversion = 38 + clamp(Math.round(conversionRatio * 25), 0, 32) + clamp(Math.round(normalized.closeRate * 0.28), 3, 24);
  if (inputs.leadCapturePoints.bookingTool) conversion += 6;
  if (inputs.goal === "more-bookings" || inputs.goal === "more-sales") conversion += 5;
  if (inputs.responseTimeMinutes > 20) conversion -= 8;
  conversion = clamp(Math.round(conversion), 0, 100);

  let speedToLead = 94 - Math.round(inputs.responseTimeMinutes * 1.45) + inputs.followups * 5;
  if (inputs.leadCapturePoints.whatsapp) speedToLead += 5;
  if (inputs.leadCapturePoints.phone) speedToLead += 5;
  if (!inputs.leadCapturePoints.websiteForm && !inputs.leadCapturePoints.bookingTool) speedToLead -= 8;
  speedToLead = clamp(Math.round(speedToLead), 0, 100);

  let trustProof = 32 + trustCount * 15;
  if (inputs.leadCapturePoints.phone) trustProof += 5;
  if (inputs.locationIntent === "local" && inputs.trustSignals.reviews) trustProof += 7;
  trustProof = clamp(Math.round(trustProof), 0, 100);

  let retention = 30 + inputs.followups * 7 + trustCount * 4;
  if (inputs.goal === "higher-aov") retention += 10;
  if (inputs.offerType === "saas") retention += 8;
  retention = clamp(Math.round(retention), 0, 100);

  return { acquisition, conversion, speedToLead, trustProof, retention };
}

function buildScenarios(params: {
  inputs: SimulatorInputs;
  conversionRate: number;
  closeRate: number;
  baseline: SimulatorOutput["baseline"];
  summaryScore: number;
}) {
  const { inputs, conversionRate, closeRate, baseline, summaryScore } = params;
  const deficitFactor = (100 - summaryScore) / 100;
  const responsePressure = clamp((inputs.responseTimeMinutes - 5) / 45, 0, 1);

  const scenarioDefs: Array<{ key: ScenarioMode; label: string; conv: number; close: number; speed: number }> = [
    { key: "conservative", label: "Conservative", conv: 0.09, close: 0.05, speed: 0.24 },
    { key: "realistic", label: "Realistic", conv: 0.16, close: 0.1, speed: 0.45 },
    { key: "aggressive", label: "Aggressive", conv: 0.27, close: 0.16, speed: 0.62 },
  ];

  return scenarioDefs.map((scenario) => {
    const conversionUpliftPct = round((scenario.conv + deficitFactor * 0.12 + responsePressure * 0.06) * 100, 1);
    const closeRateUpliftPct = round((scenario.close + deficitFactor * 0.1) * 100, 1);
    const responseTimeImprovementPct = round((scenario.speed + deficitFactor * 0.12) * 100, 1);

    const improvedConversion = conversionRate * (1 + conversionUpliftPct / 100);
    const improvedCloseRate = closeRate * (1 + closeRateUpliftPct / 100);

    const projectedLeads = (inputs.visitors * improvedConversion) / 100;
    const projectedSales = (projectedLeads * improvedCloseRate) / 100;
    const projectedRevenue = projectedSales * inputs.avgOrderValue;

    const leadDelta = Math.max(0, Math.round(projectedLeads - baseline.leadsPerMonth));
    const salesDelta = Math.max(0, Math.round(projectedSales - baseline.salesPerMonth));
    const revenueDelta = Math.max(0, Math.round(projectedRevenue - baseline.revenuePerMonth));

    const businessValue =
      scenario.key === "conservative"
        ? "Stabilise weak stages first with low execution risk."
        : scenario.key === "realistic"
          ? "Most businesses with consistent implementation land in this range."
          : "Requires decisive execution across offer, speed-to-lead, and follow-up.";

    return {
      key: scenario.key,
      label: scenario.label,
      conversionUpliftPct,
      closeRateUpliftPct,
      responseTimeImprovementPct,
      projectedLeadDelta: leadDelta,
      projectedSalesDelta: salesDelta,
      projectedRevenueDelta: revenueDelta,
      businessValue,
    } satisfies SimulatorScenario;
  });
}

function buildTopMoves(params: {
  inputs: SimulatorInputs;
  scores: ReturnType<typeof buildMetricScores>;
  domainLabel: string;
}) {
  const { inputs, scores, domainLabel } = params;

  const baseMoves: Array<{
    id: string;
    score: number;
    title: string;
    why: string;
    businessImpact: string;
    effort: "Low" | "Med" | "High";
    timeToImpact: string;
    diy: { label: string; href: string };
  }> = [
    {
      id: "acquisition",
      score: scores.acquisition,
      title: "Tighten demand capture for high-intent traffic",
      why: `On ${domainLabel}, acquisition readiness is suppressing qualified traffic inflow.`,
      businessImpact: "More qualified visitors means more leads without only buying more ads.",
      effort: "Med",
      timeToImpact: "1-2 weeks",
      diy: { label: "SEO Upgrade Pack", href: "/services/seo-upgrade-pack" },
    },
    {
      id: "conversion",
      score: scores.conversion,
      title: "Clarify offer + CTA path on money pages",
      why: `On ${domainLabel}, conversion readiness is below ideal for buyer decisions.`,
      businessImpact: "Improved conversion lifts lead and sales output from existing traffic.",
      effort: "Med",
      timeToImpact: "5-10 days",
      diy: { label: "Website Pro Build", href: "/services/website-pro-build" },
    },
    {
      id: "speed-to-lead",
      score: scores.speedToLead,
      title: "Reduce response delay with automated follow-up",
      why: `Your current speed-to-lead stack is causing drop-off before conversations start.`,
      businessImpact: "Faster first response improves booking and close probability.",
      effort: "Low",
      timeToImpact: "3-7 days",
      diy: { label: "Follow-up Automation", href: "/services/follow-up-automation" },
    },
    {
      id: "trust-proof",
      score: scores.trustProof,
      title: "Strengthen trust and proof where buyers hesitate",
      why: `Trust signals on ${domainLabel} are not strong enough to remove buyer hesitation quickly.`,
      businessImpact: "Trust cues reduce objections and improve call-to-sale conversion.",
      effort: "Low",
      timeToImpact: "4-8 days",
      diy: { label: "Website Pro Build", href: "/services/website-pro-build" },
    },
    {
      id: "retention",
      score: scores.retention,
      title: "Install reactivation and repeat-purchase workflows",
      why: "Retention readiness is weak, so previous buyers are not fully monetised.",
      businessImpact: "Repeat and upsell revenue usually has the best margin profile.",
      effort: "Med",
      timeToImpact: "1-3 weeks",
      diy: { label: "CRM Setup", href: "/services/crm-setup" },
    },
    {
      id: "call-capture",
      score: inputs.leadCapturePoints.phone ? 100 : 44,
      title: "Capture missed calls and route high-intent enquiries",
      why: "Phone-first buyers drop if missed-call capture is absent.",
      businessImpact: "Recovered calls can become immediate booked revenue.",
      effort: "Low",
      timeToImpact: "2-5 days",
      diy: { label: "Call Tracking + Capture", href: "/services/call-tracking-missed-call-capture" },
    },
    {
      id: "booking-flow",
      score: inputs.leadCapturePoints.bookingTool ? 100 : 52,
      title: "Add a frictionless booking flow with reminders",
      why: "If booking is hard, interested visitors delay and disappear.",
      businessImpact: "Simpler booking flow increases completed appointments.",
      effort: "Low",
      timeToImpact: "3-7 days",
      diy: { label: "Booking System Setup", href: "/services/booking-system-setup" },
    },
  ];

  return baseMoves
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((move, index) => {
      const gap = clamp(100 - move.score, 8, 92);
      const upliftLowPct = clamp(Math.round(4 + gap * 0.14 - index), 4, 26);
      const upliftHighPct = clamp(Math.round(upliftLowPct + 8 + gap * 0.12), upliftLowPct + 4, 42);
      return {
        id: move.id,
        title: move.title,
        why: move.why,
        businessImpact: move.businessImpact,
        upliftLowPct,
        upliftHighPct,
        effort: move.effort,
        timeToImpact: move.timeToImpact,
        diy: move.diy,
        doneForYou: {
          label: "Create Bespoke Plan",
          href: `/bespoke-plan?track=track1&module=${encodeURIComponent(move.title)}&goal=${encodeURIComponent(inputs.goal)}&industry=${encodeURIComponent(inputs.industry)}`,
        },
      } satisfies SimulatorTopMove;
    });
}

export function runSimulatorEngine(rawInputs: SimulatorInputs): {
  inputs: SimulatorInputs & { conversionRate: number; closeRate: number; grossMargin: number | null };
  output: SimulatorOutput;
} {
  const domainLabel = resolveDomainLabel(rawInputs);
  const conversion = resolveConversionRate(rawInputs);
  const closeRate = resolveCloseRate(rawInputs);
  const grossMargin = resolveGrossMargin(rawInputs);

  const normalizedInputs = {
    ...rawInputs,
    conversionRate: conversion.value,
    closeRate: closeRate.value,
    grossMargin: grossMargin.value,
  };

  const leadsPerMonth = Math.round((rawInputs.visitors * conversion.value) / 100);
  const salesPerMonth = Math.round((leadsPerMonth * closeRate.value) / 100);
  const revenuePerMonth = Math.round(salesPerMonth * rawInputs.avgOrderValue);
  const profitPerMonth =
    typeof grossMargin.value === "number" ? Math.round((revenuePerMonth * grossMargin.value) / 100) : null;

  const baseline = {
    leadsPerMonth,
    salesPerMonth,
    revenuePerMonth,
    profitPerMonth,
  };

  const scores = buildMetricScores(rawInputs, { conversionRate: conversion.value, closeRate: closeRate.value });
  const metrics: SimulatorMetric[] = [
    {
      key: "acquisition",
      label: "Acquisition Readiness",
      score: scores.acquisition,
      whatItMeans: `On ${domainLabel}, this score reflects how prepared your demand capture layer is.`,
      whyItMatters: "If traffic quality is weak, every downstream conversion metric is capped.",
      nextSteps: [
        "Strengthen SEO intent coverage and local discoverability.",
        "Ensure each traffic source lands on the right offer page.",
        "Add clear lead capture options for every intent type.",
      ],
      fixModule: metricFixLinks.acquisition,
    },
    {
      key: "conversion",
      label: "Conversion Readiness",
      score: scores.conversion,
      whatItMeans: `On ${domainLabel}, this score shows how well visitors become leads or buyers.`,
      whyItMatters: "Small conversion improvements can materially increase monthly revenue.",
      nextSteps: [
        "Clarify offer positioning in the first viewport.",
        "Reduce form and booking friction.",
        "Use proof blocks near decision points.",
      ],
      fixModule: metricFixLinks.conversion,
    },
    {
      key: "speedToLead",
      label: "Speed-to-Lead Readiness",
      score: scores.speedToLead,
      whatItMeans: `On ${domainLabel}, this measures response speed and follow-up consistency.`,
      whyItMatters: "Speed wins. The first responder usually captures the booking.",
      nextSteps: [
        "Set response SLAs and auto-reply routing.",
        "Install missed-call and WhatsApp capture.",
        "Automate follow-ups for unresponsive leads.",
      ],
      fixModule: metricFixLinks.speedToLead,
    },
    {
      key: "trustProof",
      label: "Trust & Proof Readiness",
      score: scores.trustProof,
      whatItMeans: `On ${domainLabel}, this reflects buyer confidence signals before contact.`,
      whyItMatters: "Trust reduces hesitation and improves close rates.",
      nextSteps: [
        "Add reviews and case studies near CTAs.",
        "Surface guarantees and clear policies.",
        "Show business legitimacy on key pages.",
      ],
      fixModule: metricFixLinks.trustProof,
    },
    {
      key: "retention",
      label: "Retention/Upsell Readiness",
      score: scores.retention,
      whatItMeans: `On ${domainLabel}, this measures repeat and upsell system readiness.`,
      whyItMatters: "Repeat revenue often has lower CAC and stronger margin.",
      nextSteps: [
        "Install follow-up and nurture sequences.",
        "Segment leads/customers by buying stage.",
        "Run structured reactivation campaigns.",
      ],
      fixModule: metricFixLinks.retention,
    },
  ];

  const summaryScore = Math.round(
    scores.acquisition * 0.2 +
      scores.conversion * 0.26 +
      scores.speedToLead * 0.24 +
      scores.trustProof * 0.16 +
      scores.retention * 0.14,
  );

  const stages: SimulatorStage[] = [
    { key: "traffic", label: "Traffic", score: scores.acquisition, rag: toRag(scores.acquisition) },
    { key: "lead", label: "Lead", score: scores.conversion, rag: toRag(scores.conversion) },
    { key: "appointment", label: "Appointment/Call", score: scores.speedToLead, rag: toRag(scores.speedToLead) },
    { key: "sale", label: "Sale", score: Math.round((scores.conversion + scores.trustProof) / 2), rag: toRag(Math.round((scores.conversion + scores.trustProof) / 2)) },
    { key: "repeat", label: "Repeat", score: scores.retention, rag: toRag(scores.retention) },
  ];

  const weakestStage = [...stages].sort((a, b) => a.score - b.score)[0];
  const funnelExplanation: [string, string, string] = [
    `${weakestStage.label} is currently the weakest stage in your funnel.`,
    "This stage is creating avoidable leakage before revenue is captured.",
    "Fixing this first usually produces the fastest measurable uplift.",
  ];

  const topMoves = buildTopMoves({ inputs: rawInputs, scores, domainLabel });
  const scenarios = buildScenarios({
    inputs: rawInputs,
    conversionRate: conversion.value,
    closeRate: closeRate.value,
    baseline,
    summaryScore,
  });

  const moduleRecommendations = mapRecommendedModules({
    speedScore: scores.speedToLead,
    seoScore: scores.acquisition,
    conversionScore: scores.conversion,
    trustScore: scores.trustProof,
    leakTypes: [weakestStage.key, rawInputs.goal],
    industry: rawInputs.industry,
    goal: rawInputs.goal,
  }).slice(0, 6);

  const output: SimulatorOutput = {
    assumptions: {
      conversionRateWasDefault: conversion.isDefault,
      closeRateWasDefault: closeRate.isDefault,
      grossMarginWasDefault: grossMargin.isDefault,
      defaultsUsed: [
        conversion.isDefault ? "conversion rate" : "",
        closeRate.isDefault ? "close rate" : "",
        grossMargin.isDefault ? "gross margin" : "",
      ].filter(Boolean),
    },
    baseline,
    summaryScore: clamp(summaryScore, 0, 100),
    metrics,
    scenarios,
    funnel: {
      stages,
      weakestStage,
      explanation: funnelExplanation,
    },
    topMoves,
    recommendedModules: moduleRecommendations.map((module) => ({
      id: module.id,
      title: module.title,
      href: module.href,
    })),
  };

  return {
    inputs: normalizedInputs,
    output,
  };
}
