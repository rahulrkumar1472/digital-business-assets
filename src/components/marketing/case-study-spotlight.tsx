"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { ImageOrPlaceholder } from "@/components/marketing/image-or-placeholder";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/types/content";

type CaseStudySpotlightProps = {
  caseStudies: CaseStudy[];
};

export function CaseStudySpotlight({ caseStudies }: CaseStudySpotlightProps) {
  const slides = caseStudies.slice(0, 3);
  const [index, setIndex] = useState(0);

  if (!slides.length) {
    return null;
  }

  const active = slides[index];

  const goPrevious = () => {
    setIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setIndex((current) => (current + 1) % slides.length);
  };

  return (
    <MotionReveal>
      <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45">
        <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            <ImageOrPlaceholder
              src={active.coverImage}
              alt={active.title}
              label={active.clientSector}
              className="aspect-[4/3] h-full w-full"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">{active.clientSector}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{active.title}</h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400 uppercase">Baseline</p>
                <p className="mt-2 text-sm text-slate-200">{active.challenge}</p>
              </div>
              <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/10 p-4">
                <p className="text-xs text-cyan-200 uppercase">Improvement</p>
                <p className="mt-2 text-sm text-white">
                  {active.outcomes[0]?.label} {active.outcomes[0]?.value}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300">
              &ldquo;
              {active.testimonial?.quote || "The new system improved response speed and booking quality quickly."}
              &rdquo;
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <Link href={`/case-studies/${active.slug}`}>
                  View full case study
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={goPrevious}
                className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800"
                aria-label="Previous case study"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={goNext}
                className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800"
                aria-label="Next case study"
              >
                <ArrowRight className="size-4" />
              </Button>

              <div className="ml-1 flex items-center gap-2">
                {slides.map((slide, slideIndex) => (
                  <button
                    key={slide.slug}
                    type="button"
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      slideIndex === index ? "bg-cyan-300" : "bg-slate-700"
                    }`}
                    onClick={() => setIndex(slideIndex)}
                    aria-label={`Go to case study ${slideIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </MotionReveal>
  );
}
