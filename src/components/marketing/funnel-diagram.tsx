"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const stages = [
  { label: "Traffic", detail: "Search, ads, social, referrals" },
  { label: "Lead", detail: "Forms, calls, chat, WhatsApp" },
  { label: "Book", detail: "Qualified appointments" },
  { label: "Sale", detail: "Won opportunities" },
  { label: "Repeat", detail: "Retention and upsell" },
];

export function FunnelDiagram() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
      <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Funnel Diagram</p>
      <div className="mt-4 grid gap-2">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className="rounded-xl border border-slate-700 bg-slate-950/70 p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{stage.label}</p>
              <p className="text-xs text-slate-400">Stage {index + 1}</p>
            </div>
            <p className="mt-1 text-xs text-slate-300">{stage.detail}</p>
            {index !== stages.length - 1 ? <ArrowDown className="mt-2 size-3.5 text-cyan-300" /> : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
