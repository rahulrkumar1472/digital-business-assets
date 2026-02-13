export const auditReasons = ["No leads", "Low conversion", "Slow replies", "Bad SEO", "Need website", "All of it"] as const;

export type AuditReason = (typeof auditReasons)[number];
