"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type ScanTimelineProps = {
  steps: string[];
  activeStep: number;
  className?: string;
};

export function ScanTimeline({ steps, activeStep, className }: ScanTimelineProps) {
  const clampedActive = Math.max(0, Math.min(activeStep, steps.length - 1));
  const progress = ((clampedActive + 1) / Math.max(steps.length, 1)) * 100;

  return (
    <div className={cn("rounded-2xl border border-slate-800 bg-slate-950/65 p-4", className)}>
      <div className="mb-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Scan Timeline</p>
        <p className="mt-1 text-sm text-slate-300">Running checks in sequence to produce your growth report.</p>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400/55 via-cyan-300 to-blue-400"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {steps.map((step, index) => {
          const isDone = index < clampedActive;
          const isActive = index === clampedActive;

          return (
            <motion.article
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06, ease: "easeOut" }}
              className={cn(
                "rounded-xl border p-3 text-xs md:text-sm",
                isDone
                  ? "border-cyan-500/45 bg-cyan-500/10 text-cyan-100"
                  : isActive
                    ? "border-cyan-400/40 bg-slate-900/85 text-slate-100"
                    : "border-slate-800 bg-slate-900/65 text-slate-400",
              )}
            >
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase">
                {isDone ? <CheckCircle2 className="size-3.5" /> : null}
                Step {index + 1}
              </p>
              <p className="mt-1 leading-snug">{step}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
