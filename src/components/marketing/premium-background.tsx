"use client";

import { motion } from "framer-motion";

export function PremiumBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-40 -left-24 h-[34rem] w-[34rem] rounded-full bg-cyan-500/16 blur-3xl"
        animate={{ x: [0, 36, -18, 0], y: [0, 24, -12, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-16 right-[-8rem] h-[36rem] w-[36rem] rounded-full bg-sky-400/12 blur-3xl"
        animate={{ x: [0, -26, 12, 0], y: [0, -20, 8, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.2)_0%,rgba(2,6,23,0.75)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:38px_38px] [mask-image:radial-gradient(circle_at_center,black_35%,transparent_95%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.72)_72%,rgba(2,6,23,0.95)_100%)]" />
    </div>
  );
}
