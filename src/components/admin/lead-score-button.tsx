"use client";

import { useMemo, useState } from "react";
import { Flame, Loader2, Snowflake, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type LeadScoreCategory = "hot" | "warm" | "cold";

type ScoreApiResponse = {
  ok: boolean;
  score?: number;
  category?: LeadScoreCategory;
  reasons?: string[];
  message?: string;
};

type LeadScoreButtonProps = {
  leadId: string;
  initialScore: number;
  initialCategory: LeadScoreCategory;
};

function badgeMeta(category: LeadScoreCategory, score: number) {
  if (category === "hot") {
    return {
      label: `🔥 HOT (${score})`,
      icon: Flame,
      className: "border-rose-400/35 bg-rose-500/15 text-rose-200",
    };
  }

  if (category === "warm") {
    return {
      label: `🟡 WARM (${score})`,
      icon: Sun,
      className: "border-amber-400/35 bg-amber-500/15 text-amber-200",
    };
  }

  return {
    label: `⚪ COLD (${score})`,
    icon: Snowflake,
    className: "border-slate-700 bg-slate-900/70 text-slate-300",
  };
}

export function LeadScoreButton({ leadId, initialScore, initialCategory }: LeadScoreButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [category, setCategory] = useState<LeadScoreCategory>(initialCategory);
  const [reasons, setReasons] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const meta = useMemo(() => badgeMeta(category, score), [category, score]);

  const calculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/score`, {
        method: "POST",
      });
      const payload = (await response.json()) as ScoreApiResponse;
      if (!response.ok || !payload.ok || typeof payload.score !== "number" || !payload.category) {
        throw new Error(payload.message || "Could not calculate lead score.");
      }

      setScore(payload.score);
      setCategory(payload.category);
      setReasons(Array.isArray(payload.reasons) ? payload.reasons : []);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not calculate lead score.");
    } finally {
      setLoading(false);
    }
  };

  const Icon = meta.icon;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-cyan-200 uppercase">Lead scoring</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Priority Queue Score</h3>
          <p className="mt-1 text-sm text-slate-300">Uses behaviour and business signals from audit, simulator, and event data.</p>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
          <Icon className="size-3.5" />
          {meta.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => void calculate()}
          disabled={loading}
          className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Calculating...
            </>
          ) : (
            "Calculate Lead Score"
          )}
        </Button>
      </div>

      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}

      {reasons.length ? (
        <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
          {reasons.map((reason) => (
            <li key={reason} className="rounded-md border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">
              {reason}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
