"use client";

import { AuditUrlLaunchForm } from "@/components/tools/audit-url-launch-form";

export function WebsiteAuditStartForm() {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-white">Start your free website scan</h2>
      <p className="text-sm text-slate-300">
        URL first for speed. Use Advanced only if you want to tailor industry and goal before generating your report.
      </p>

      <AuditUrlLaunchForm
        defaultIndustry="service"
        defaultGoal="leads"
        submitLabel="Generate report"
        showAdvancedToggle
        showCompetitorInputs
      />

      <p className="text-xs text-slate-400">
        If you skip Advanced, we default to industry: service and goal: leads. Competitor benchmarking runs only when
        you provide competitor domains.
      </p>
    </div>
  );
}
