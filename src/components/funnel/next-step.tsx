"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useFunnelTrack } from "@/components/funnel/funnel-provider";
import { Button } from "@/components/ui/button";

const track1Steps = [
  "Pick your starter modules",
  "Review pricing and onboarding",
  "Create your plan and activate",
];

const track2Steps = [
  "Run free website audit",
  "Review scan report priorities",
  "Create plan or book strategy call",
];

export function RecommendedNextStep() {
  const { track } = useFunnelTrack();

  const isTrack1 = track === "track1";
  const isTrack2 = track === "track2";

  const title = isTrack1
    ? "Recommended Next Step (Track 1)"
    : isTrack2
      ? "Recommended Next Step (Track 2)"
      : "Recommended Next Step";

  const steps = isTrack1 ? track1Steps : isTrack2 ? track2Steps : [...track1Steps.slice(0, 2), ...track2Steps.slice(0, 1)];
  const primaryHref = isTrack1 ? "/services" : "/tools/website-audit/start";
  const primaryLabel = isTrack1 ? "Choose Modules" : "Run Website Audit";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
      <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {steps.map((step) => (
          <li key={step} className="list-disc pl-1 marker:text-cyan-300">
            {step}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button asChild size="sm">
          <Link href={primaryHref}>
            {primaryLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800">
          <Link href="/bespoke-plan">Create Your Bespoke Plan</Link>
        </Button>
      </div>
    </div>
  );
}

