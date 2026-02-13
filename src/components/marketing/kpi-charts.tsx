"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "W1", baseline: 100, projected: 108 },
  { month: "W2", baseline: 104, projected: 121 },
  { month: "W3", baseline: 106, projected: 132 },
  { month: "W4", baseline: 109, projected: 147 },
  { month: "W5", baseline: 112, projected: 156 },
  { month: "W6", baseline: 115, projected: 168 },
];

export function KPICharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
      <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">KPI Charts</p>
      <p className="mt-1 text-xs text-slate-400">Example projections, not guaranteed outcomes.</p>
      <div className="mt-4 h-56 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="baseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "0.6rem",
                  color: "#e2e8f0",
                }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#94a3b8" fillOpacity={1} fill="url(#baseline)" />
              <Area type="monotone" dataKey="projected" stroke="#22d3ee" fillOpacity={1} fill="url(#projected)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full rounded-xl border border-slate-800 bg-slate-950/50" />
        )}
      </div>
    </div>
  );
}
