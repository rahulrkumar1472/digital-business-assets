"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock3, DollarSign, PhoneCall, TrendingUp } from "lucide-react";

import { AnimatedCounter } from "@/components/marketing/animated-counter";

const kpis = [
  { label: "Leads", value: 124, suffix: "/mo", icon: TrendingUp },
  { label: "Bookings", value: 43, suffix: "/mo", icon: Clock3 },
  { label: "Recovered", value: 18200, prefix: "£", icon: DollarSign },
  { label: "Response", value: 2, suffix: "m", icon: PhoneCall },
];

const chartPath = "M4 84 C28 68, 42 60, 58 58 C76 56, 90 42, 114 34 C132 27, 148 24, 172 16";

export function DashboardPreviewPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative rounded-3xl border border-cyan-500/25 bg-[linear-gradient(160deg,rgba(56,189,248,0.18),rgba(15,23,42,0.88))] p-4 shadow-[0_32px_100px_rgba(2,6,23,0.62)] backdrop-blur-xl"
    >
      <div className="rounded-2xl border border-slate-800/85 bg-slate-950/70 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Dashboard Preview</p>
          <span className="text-[11px] text-slate-400">Live sync</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {kpis.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-3"
            >
              <p className="text-[11px] text-slate-400 uppercase">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">
                <AnimatedCounter value={item.value} prefix={item.prefix} suffix={item.suffix} durationMs={1000} />
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/65 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>30-day trend</span>
            <span className="text-cyan-300">+31%</span>
          </div>
          <svg viewBox="0 0 180 90" className="h-28 w-full">
            <defs>
              <linearGradient id="chart-stroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path d="M0 89 H180" stroke="rgba(148,163,184,0.16)" strokeWidth="1" />
            <motion.path
              d={chartPath}
              fill="none"
              stroke="url(#chart-stroke)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/65 p-3">
          <p className="text-xs text-slate-400">Pipeline</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            {[
              ["New", "26"],
              ["Contacted", "19"],
              ["Booked", "13"],
              ["Won", "7"],
            ].map(([stage, count], index) => (
              <div key={stage} className="flex items-center gap-2">
                <div className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200">
                  {stage}: {count}
                </div>
                {index !== 3 ? <ArrowRight className="size-3 text-cyan-300" /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
