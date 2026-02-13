"use client";

import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  durationMs = 1100,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    let start: number | undefined;

    const step = (timestamp: number) => {
      if (!start) {
        start = timestamp;
      }

      const progress = Math.min((timestamp - start) / durationMs, 1);
      const current = Math.round(progress * value);
      setDisplay(current);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [durationMs, value]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
