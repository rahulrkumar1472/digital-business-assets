"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type HeroTypewriterProps = {
  lines: string[];
};

export function HeroTypewriter({ lines }: HeroTypewriterProps) {
  const safeLines = useMemo(
    () => (lines.length ? lines : ["Launch your revenue system fast."]),
    [lines],
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [visible, setVisible] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const active = safeLines[lineIndex];
    const typingDone = visible === active;
    const deletingDone = visible.length === 0;

    const timeout = setTimeout(
      () => {
        if (!deleting && !typingDone) {
          setVisible(active.slice(0, visible.length + 1));
          return;
        }

        if (!deleting && typingDone) {
          setDeleting(true);
          return;
        }

        if (deleting && !deletingDone) {
          setVisible(active.slice(0, visible.length - 1));
          return;
        }

        if (deleting && deletingDone) {
          setDeleting(false);
          setLineIndex((current) => (current + 1) % safeLines.length);
        }
      },
      typingDone && !deleting ? 1800 : deleting ? 25 : 45,
    );

    return () => clearTimeout(timeout);
  }, [deleting, lineIndex, safeLines, visible]);

  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-[3.4rem] text-2xl font-medium text-slate-100 sm:text-3xl"
    >
      <span className="bg-[linear-gradient(90deg,#e2e8f0,#67e8f9,#38bdf8)] bg-clip-text text-transparent">
        {visible}
      </span>
      <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-cyan-300 align-middle" />
    </motion.p>
  );
}
