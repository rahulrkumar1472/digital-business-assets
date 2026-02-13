"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const defaultFlowSteps = [
  "Lead",
  "AI Assistant",
  "Booking",
  "Reminder",
  "Review Request",
  "Upsell",
];

type AutomationFlowPreviewProps = {
  compact?: boolean;
  className?: string;
  steps?: string[];
  title?: string;
};

export function AutomationFlowPreview({
  compact = false,
  className,
  steps = defaultFlowSteps,
  title = "Automation Flow Preview",
}: AutomationFlowPreviewProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45 p-5 md:p-6",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(160deg, rgba(56,189,248,0.12), rgba(15,23,42,0.88)), url('/media/flow.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">{title}</p>
      <div className={cn("mt-4 flex flex-wrap items-center gap-2", compact ? "" : "lg:gap-3") }>
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0.6, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-medium text-slate-200"
            >
              {step}
            </motion.div>
            {index !== steps.length - 1 ? (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: 0.12 + index * 0.08 }}
              >
                <ArrowRight className="size-3.5 text-cyan-300" />
              </motion.div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
