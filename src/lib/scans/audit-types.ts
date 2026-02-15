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
};

export type PageExperienceMetrics = {
  source: "heuristic" | "psi" | "hybrid";
  scriptCount: number;
  imageCount: number;
  domEstimate: number;
  estimatedLoadComplexity: number;
  lcpMs?: number;
  cls?: number;
  inpMs?: number;
  psiPerformance?: number;
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

export type AuditResult = {
  url: string;
  businessName?: string;
  industry?: string;
  goal?: string;
  generatedAt: string;
  scores: AuditScores;
  categories: CategoryBreakdown[];
  checks: AuditCheck[];
  topFindings: AuditCheck[];
  narrative: AuditNarrative;
  pageExperience: PageExperienceMetrics;
  visibilitySignals: VisibilitySignals;
  competitors?: CompetitorResult[];
  recommendedModules: ModuleRecommendationLite[];
};
