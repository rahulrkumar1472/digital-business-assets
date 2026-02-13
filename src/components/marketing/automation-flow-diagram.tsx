"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const flow = ["Lead Capture", "Follow-up", "Booking", "Reminders", "Review Request"];

export function AutomationFlowDiagram() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
      <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Automation Flow Diagram</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {flow.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100"
            >
              {step}
            </motion.div>
            {index !== flow.length - 1 ? <ArrowRight className="size-3.5 text-cyan-300" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
