export type AuditCategory = "Speed" | "SEO" | "Conversion" | "Trust" | "Visibility";

export type RAG = "green" | "amber" | "red";

export type AuditEffort = "S" | "M" | "L";

export type AuditImpact = "Low" | "Med" | "High";

export type AuditCheck = {
  id: string;
  category: AuditCategory;
  label: string;
  status: RAG;
  scoreDelta: number;
  evidence?: string;
  fix?: string;
  effort: AuditEffort;
  impact: AuditImpact;
};

export type AuditScores = {
  overall: number;
  speed: number;
  seo: number;
  conversion: number;
  trust: number;
  visibility: number;
};

export type AuditDashboardScores = {
  overall: number;
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  customerExperience: number;
};

export type AuditPillars = {
  overall: number;
  performance: number;
  seo: number;
  contentClarity: number;
  trustAuthority: number;
};

export type AuditNarrative = {
  executiveSummary: string;
  whyItMatters: string;
  nextSteps: string[];
};

export type CategoryBreakdown = {
  category: AuditCategory;
  score: number;
  rag: RAG;
};

export type CompetitorResult = {
  domain: string;
  scores: AuditScores;
  topWins: string[];
  topGaps: string[];
  titleLength: number;
  hasMetaDescription: boolean;
  hasCanonical: boolean;
  hasJsonLd: boolean;
  hasCta: boolean;
  contentDepth: number;
};

export type PageExperienceMetrics = {
  source: "heuristic" | "psi" | "hybrid";
  scriptCount: number;
  headScriptCount: number;
  imageCount: number;
  domEstimate: number;
  estimatedLoadComplexity: number;
  ttfbEstimateMs: number;
  fcpMs?: number;
  lcpMs?: number;
  tbtMs?: number;
  siMs?: number;
  cls?: number;
  inpMs?: number;
  psiPerformance?: number;
  cwvStatus: "Pass" | "Needs Improvement" | "Fail" | "Estimated";
};

export type VisibilitySignals = {
  socialLinks: {
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
    tiktok: boolean;
    youtube: boolean;
  };
  hasGoogleBusinessHint: boolean;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
};

export type ModuleRecommendationLite = {
  id: string;
  title: string;
  why: string;
  action: string;
  href: string;
  phase: string;
  priceLabel: string;
};

export type SuggestedCopy = {
  heroHeadlines: string[];
  subheadline: string;
  ctaRewrite: string;
};

export type ContentClarityScore = {
  score: number;
  title: string;
  metaDescription: string;
  h1: string;
  h2Count: number;
  h3Count: number;
  wordCount: number;
  headingsCount: number;
  internalLinkCount: number;
  hasReviewKeywords: boolean;
  hasPricingLink: boolean;
  hasClearCtaText: boolean;
  imageAltRatio: number;
  localIntentRelevant: boolean;
  rubric: Array<{
    label: string;
    score: number;
    maxScore: number;
    note: string;
  }>;
  suggestedCopy: SuggestedCopy;
  diagnosticSummary: string;
};

export type BusinessSnapshot = {
  hostname: string;
  isHttps: boolean;
  titleText: string;
  h1Text: string;
  hasEmail: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
  likelySiteType: "ecom" | "service" | "unknown";
};

export type AuditResult = {
  url: string;
  businessName?: string;
  industry?: string;
  goal?: string;
  generatedAt: string;
  scores: AuditScores;
  dashboardScores: AuditDashboardScores;
  pillars: AuditPillars;
  categories: CategoryBreakdown[];
  checks: AuditCheck[];
  topFindings: AuditCheck[];
  narrative: AuditNarrative;
  pageExperience: PageExperienceMetrics;
  visibilitySignals: VisibilitySignals;
  contentClarity: ContentClarityScore;
  businessSnapshot: BusinessSnapshot;
  competitors?: CompetitorResult[];
  recommendedModules: ModuleRecommendationLite[];
  auditRunId?: string;
};
