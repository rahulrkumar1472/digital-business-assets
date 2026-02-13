"use client";

import { useEffect, useRef, useState } from "react";

function shouldIgnore(element: HTMLElement) {
  if (element.tagName === "HTML" || element.tagName === "BODY") {
    return true;
  }

  if (element.dataset.ignoreOverflowQa === "true") {
    return true;
  }

  const style = window.getComputedStyle(element);
  return style.position === "fixed";
}

function inspectOverflow() {
  const viewportWidth = document.documentElement.clientWidth;
  const offenders: HTMLElement[] = [];

  document.querySelectorAll<HTMLElement>("body *").forEach((element) => {
    if (shouldIgnore(element)) {
      element.classList.remove("overflow-qa-outline");
      return;
    }

    const rect = element.getBoundingClientRect();
    const overflowing = rect.right > viewportWidth + 1 || rect.left < -1 || rect.width > viewportWidth + 1;

    if (overflowing) {
      offenders.push(element);
      element.classList.add("overflow-qa-outline");
      return;
    }

    element.classList.remove("overflow-qa-outline");
  });

  return offenders;
}

export function MobileOverflowHelper() {
  const [offenderCount, setOffenderCount] = useState(0);
  const lastReportedRef = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const run = () => {
      const offenders = inspectOverflow() || [];
      setOffenderCount(offenders.length);

      if (offenders.length > 0 && offenders.length !== lastReportedRef.current) {
        lastReportedRef.current = offenders.length;
        const sample = offenders.slice(0, 8).map((element) => {
          const tag = element.tagName.toLowerCase();
          const className = element.className?.toString().trim().replace(/\s+/g, ".") || "no-class";
          return `${tag}.${className}`;
        });

        console.warn("[overflow-qa] Elements wider than viewport:", sample);
      }
    };

    const timer = window.setTimeout(run, 180);
    const interval = window.setInterval(run, 1200);

    window.addEventListener("resize", run);
    window.addEventListener("orientationchange", run);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener("resize", run);
      window.removeEventListener("orientationchange", run);
    };
  }, []);

  if (process.env.NODE_ENV === "production" || offenderCount === 0) {
    return null;
  }

  return <div className="overflow-qa-badge">Overflow QA: {offenderCount}</div>;
}
