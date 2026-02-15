"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const samplePresets = [
  { label: "Local business", url: "https://northcityplumbing.co.uk", industry: "Local Services", goal: "Slow replies" },
  { label: "Ecom", url: "https://modernshopstudio.co.uk", industry: "Ecommerce", goal: "Low conversion" },
  { label: "Service business", url: "https://primeclinicstudio.co.uk", industry: "Medical", goal: "No leads" },
] as const;

export function WebsiteAuditPlayground() {
  const router = useRouter();
  const [url, setUrl] = useState<string>(samplePresets[0].url);
  const [industry, setIndustry] = useState<string>(samplePresets[0].industry);
  const [goal, setGoal] = useState<string>(samplePresets[0].goal);

  const sendToResults = () => {
    const query = new URLSearchParams({
      url: url.trim() || "https://example.co.uk",
      industry: industry.trim() || "General",
      goal: goal.trim() || "All of it",
    }).toString();
    router.push(`/tools/website-audit/results?${query}`);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
        <h2 className="text-xl font-semibold text-white">Generate sample report</h2>
        <p className="mt-1 text-sm text-slate-300">Enter a URL or use a preset to open the full Website Growth Audit results page.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Website URL</label>
            <Input value={url} onChange={(event) => setUrl(event.target.value)} className="border-slate-700 bg-slate-950/65 text-slate-100" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Industry</label>
            <Input value={industry} onChange={(event) => setIndustry(event.target.value)} className="border-slate-700 bg-slate-950/65 text-slate-100" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">Goal</label>
            <Input value={goal} onChange={(event) => setGoal(event.target.value)} className="border-slate-700 bg-slate-950/65 text-slate-100" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {samplePresets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              className="border-slate-700 bg-slate-900/65 text-slate-100 hover:bg-slate-800"
              onClick={() => {
                setUrl(preset.url);
                setIndustry(preset.industry);
                setGoal(preset.goal);
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={sendToResults}
            className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
          >
            Generate Sample Report
          </Button>
        </div>
      </div>
    </div>
  );
}
