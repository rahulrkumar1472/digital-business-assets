"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

type ContentSectionProps = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  visual?: React.ReactNode;
  className?: string;
};

function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

export function ContentSection({ heading, paragraphs, bullets = [], visual, className }: ContentSectionProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const oversized = paragraphs.find((paragraph) => countWords(paragraph) > 250);
    if (oversized) {
      console.warn(`[content-section] Paragraph over 250 words detected in section: ${heading}`);
    }
  }, [heading, paragraphs]);

  return (
    <section className={cn("rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8", className)}>
      <h2 className="text-3xl font-semibold text-white md:text-4xl">{heading}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
          {paragraph}
        </p>
      ))}
      {bullets.length ? (
        <ul className="mt-4 space-y-2 text-sm text-slate-200">
          {bullets.map((bullet) => (
            <li key={bullet} className="list-disc pl-1 marker:text-cyan-300">
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {visual ? <div className="mt-6">{visual}</div> : null}
    </section>
  );
}
