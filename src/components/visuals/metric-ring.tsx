"use client";

import { useEffect, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

type MetricRingProps = {
  value: number;
  label?: string;
  size?: number;
  className?: string;
};

export function MetricRing({ value, label = "Growth score", size = 190, className }: MetricRingProps) {
  const score = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 11;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useMotionValue(0);
  const strokeOffset = useTransform(progress, (latest) => circumference - (latest / 100) * circumference);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(progress, score, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplay(Math.round(latest));
      },
    });

    return () => {
      controls.stop();
    };
  }, [progress, score]);

  const scoreLabel = useMemo(() => {
    if (score >= 82) return "Strong";
    if (score >= 62) return "Promising";
    if (score >= 45) return "Needs attention";
    return "High urgency";
  }, [score]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-[0_0_26px_rgba(34,211,238,0.22)]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(51,65,85,0.9)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#metric-ring-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: strokeOffset }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="metric-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.95)" />
            <stop offset="50%" stopColor="rgba(56,189,248,0.95)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0.85)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">{label}</p>
        <p className="mt-1 text-4xl font-semibold text-white">{display}</p>
        <p className="mt-1 text-xs text-slate-300">{scoreLabel}</p>
      </div>
    </div>
  );
}
