"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuditUrlLaunchFormProps = {
  defaultIndustry?: "local" | "service" | "ecom";
  defaultGoal?: "leads" | "sales";
  submitLabel?: string;
  showAdvancedToggle?: boolean;
  destination?: "results" | "start";
  showCompetitorInputs?: boolean;
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function normalizeDomain(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    return parsed.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

export function AuditUrlLaunchForm({
  defaultIndustry = "service",
  defaultGoal = "leads",
  submitLabel = "Run free growth audit",
  showAdvancedToggle = false,
  destination = "results",
  showCompetitorInputs = false,
}: AuditUrlLaunchFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [industry, setIndustry] = useState(defaultIndustry);
  const [goal, setGoal] = useState(defaultGoal);
  const [competitors, setCompetitors] = useState([
    "",
    "",
    "",
  ]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const normalized = normalizeUrl(url);

    if (!normalized) {
      setError("Please enter your website URL.");
      return;
    }

    setSubmitting(true);

    const competitorDomains = competitors
      .map((item) => ({ raw: item, normalized: normalizeDomain(item) }))
      .filter((item) => item.raw.trim().length > 0);

    const invalidCompetitor = competitorDomains.find((item) => !item.normalized);
    if (showCompetitorInputs && invalidCompetitor) {
      setSubmitting(false);
      setError("Please enter valid competitor domains or leave the field blank.");
      return;
    }

    const queryParams = new URLSearchParams({
      url: normalized,
      industry: industry || "service",
      goal: goal || "leads",
    });

    const uniqueCompetitors = Array.from(
      new Set(competitorDomains.map((item) => item.normalized).filter(Boolean)),
    ).slice(0, 3);
    if (uniqueCompetitors.length) {
      queryParams.set("competitors", uniqueCompetitors.join(","));
    }

    const query = queryParams.toString();

    if (destination === "start") {
      router.push(`/tools/website-audit/start?${query}`);
      return;
    }

    router.push(`/tools/website-audit/results?${query}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Enter your website URL (e.g. yourbusiness.co.uk)"
          className="h-12 flex-1 border-slate-700 bg-slate-950/70 text-slate-100"
          required
        />
        <Button type="submit" size="lg" className="h-12 bg-cyan-300 text-slate-950 hover:bg-cyan-200 sm:min-w-56" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>

      {showAdvancedToggle ? (
        <div className="space-y-3">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase"
            onClick={() => setAdvancedOpen((previous) => !previous)}
          >
            <ChevronDown className={`size-3.5 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
            Advanced
          </button>

          {advancedOpen ? (
            <div className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-[0.12em] text-slate-300 uppercase">Industry</label>
                <select
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value as "local" | "service" | "ecom")}
                  className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                >
                  <option value="local">Local</option>
                  <option value="service">Service</option>
                  <option value="ecom">Ecom</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-[0.12em] text-slate-300 uppercase">Goal</label>
                <select
                  value={goal}
                  onChange={(event) => setGoal(event.target.value as "leads" | "sales")}
                  className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
                >
                  <option value="leads">Leads</option>
                  <option value="sales">Sales</option>
                </select>
              </div>

              {showCompetitorInputs ? (
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-semibold tracking-[0.12em] text-slate-300 uppercase">
                    Competitors (optional, up to 3)
                  </label>
                  <div className="grid gap-2 md:grid-cols-3">
                    {competitors.map((competitor, index) => (
                      <Input
                        key={`competitor-${index + 1}`}
                        value={competitor}
                        onChange={(event) =>
                          setCompetitors((previous) =>
                            previous.map((item, itemIndex) =>
                              itemIndex === index ? event.target.value : item,
                            ),
                          )
                        }
                        placeholder={`competitor${index + 1}.co.uk`}
                        className="h-10 border-slate-700 bg-slate-900 text-sm text-slate-100"
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Add competitor domains only if you want side-by-side benchmarking.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </form>
  );
}
