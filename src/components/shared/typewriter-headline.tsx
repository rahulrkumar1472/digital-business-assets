"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterHeadlineProps = {
  lines: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  holdTime?: number;
  className?: string;
};

export function TypewriterHeadline({
  lines,
  typeSpeed = 58,
  deleteSpeed = 32,
  holdTime = 1800,
  className,
}: TypewriterHeadlineProps) {
  const safeLines = useMemo(
    () => (lines.length ? lines : ["Need a growth system that actually converts?"]),
    [lines],
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const activeLine = safeLines[lineIndex];
    const finishedTyping = visibleText === activeLine;
    const finishedDeleting = visibleText.length === 0;

    const timeout = setTimeout(
      () => {
        if (!isDeleting && !finishedTyping) {
          setVisibleText(activeLine.slice(0, visibleText.length + 1));
          return;
        }

        if (!isDeleting && finishedTyping) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && !finishedDeleting) {
          setVisibleText(activeLine.slice(0, visibleText.length - 1));
          return;
        }

        if (isDeleting && finishedDeleting) {
          setIsDeleting(false);
          setLineIndex((current) => (current + 1) % safeLines.length);
        }
      },
      finishedTyping && !isDeleting
        ? holdTime
        : isDeleting
          ? deleteSpeed
          : typeSpeed,
    );

    return () => clearTimeout(timeout);
  }, [
    deleteSpeed,
    holdTime,
    isDeleting,
    lineIndex,
    safeLines,
    typeSpeed,
    visibleText,
  ]);

  return (
    <div className={className}>
      <p className="min-h-[2.8rem] text-xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
        {visibleText}
        <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-cyan-400 align-middle" />
      </p>
    </div>
  );
}
