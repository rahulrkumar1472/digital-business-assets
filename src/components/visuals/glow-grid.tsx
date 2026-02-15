"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type GlowGridProps = {
  className?: string;
};

export function GlowGrid({ className }: GlowGridProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -top-28 left-[-15%] h-[18rem] w-[18rem] rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 36, -20, 0], y: [0, 22, 10, 0], opacity: [0.45, 0.7, 0.5, 0.45] }}
        transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] bottom-[-10%] h-[18rem] w-[18rem] rounded-full bg-blue-500/18 blur-3xl"
        animate={{ x: [0, -32, 16, 0], y: [0, -28, 14, 0], opacity: [0.35, 0.62, 0.42, 0.35] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 1200 680"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dba-grid-pattern" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
          </pattern>
          <linearGradient id="dba-grid-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(2,6,23,0.1)" />
            <stop offset="70%" stopColor="rgba(2,6,23,0.42)" />
            <stop offset="100%" stopColor="rgba(2,6,23,0.88)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#dba-grid-pattern)" />
        <rect width="100%" height="100%" fill="url(#dba-grid-fade)" />
      </svg>
    </div>
  );
}
