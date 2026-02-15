"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type OsMapProps = {
  className?: string;
  compact?: boolean;
};

type OsNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

const nodes: OsNode[] = [
  { id: "website", label: "Website", x: 90, y: 70 },
  { id: "leads", label: "Leads", x: 250, y: 70 },
  { id: "crm", label: "CRM", x: 410, y: 70 },
  { id: "follow-up", label: "Follow-up", x: 570, y: 70 },
  { id: "booking", label: "Booking", x: 730, y: 70 },
  { id: "reporting", label: "Reporting", x: 890, y: 70 },
  { id: "ai-employee", label: "AI Employee", x: 570, y: 190 },
];

const links = [
  { from: "website", to: "leads" },
  { from: "leads", to: "crm" },
  { from: "crm", to: "follow-up" },
  { from: "follow-up", to: "booking" },
  { from: "booking", to: "reporting" },
  { from: "follow-up", to: "ai-employee" },
  { from: "ai-employee", to: "crm" },
];

function findNode(id: string) {
  return nodes.find((node) => node.id === id);
}

export function OsMap({ className, compact = false }: OsMapProps) {
  const nodeWidth = compact ? 128 : 140;
  const nodeHeight = compact ? 42 : 48;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/65 p-4",
        className,
      )}
      aria-label="Business OS map"
    >
      <svg viewBox="0 0 1040 270" className="h-auto w-full" role="img" aria-label="Business OS module map">
        <defs>
          <linearGradient id="os-map-link" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.22)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.86)" />
          </linearGradient>
          <filter id="os-map-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {links.map((link, index) => {
          const from = findNode(link.from);
          const to = findNode(link.to);
          if (!from || !to) {
            return null;
          }

          const startX = from.x + nodeWidth / 2;
          const startY = from.y + nodeHeight / 2;
          const endX = to.x + nodeWidth / 2;
          const endY = to.y + nodeHeight / 2;
          const curve = Math.abs(endY - startY) > 20 ? 45 : 24;
          const path = `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;

          return (
            <motion.path
              key={`${link.from}-${link.to}`}
              d={path}
              fill="none"
              stroke="url(#os-map-link)"
              strokeWidth="2"
              filter="url(#os-map-glow)"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: index * 0.1, ease: "easeOut" }}
            />
          );
        })}

        {nodes.map((node, index) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.94, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 + index * 0.06, ease: "easeOut" }}
          >
            <rect
              x={node.x}
              y={node.y}
              width={nodeWidth}
              height={nodeHeight}
              rx={12}
              fill="rgba(15,23,42,0.92)"
              stroke="rgba(34,211,238,0.55)"
              strokeWidth="1.2"
            />
            <text
              x={node.x + nodeWidth / 2}
              y={node.y + nodeHeight / 2 + 4}
              textAnchor="middle"
              fontSize={compact ? 13 : 14}
              fill="#d7f7ff"
              fontWeight={600}
              style={{ letterSpacing: "0.01em" }}
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
