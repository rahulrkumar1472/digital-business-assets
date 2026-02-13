import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrackTileProps = {
  label: string;
  title: string;
  whoFor: string;
  outcome: string;
  steps: readonly string[];
  href: string;
  ctaLabel: string;
  icon: LucideIcon;
  delay?: number;
  compact?: boolean;
  featured?: boolean;
};

export function TrackTile({
  label,
  title,
  whoFor,
  outcome,
  steps,
  href,
  ctaLabel,
  icon: Icon,
  delay = 0,
  compact = false,
  featured = false,
}: TrackTileProps) {
  return (
    <MotionReveal delay={delay}>
      <Card
        className={cn(
          "relative h-full overflow-hidden border-slate-800/90 bg-[linear-gradient(155deg,rgba(30,41,59,0.56),rgba(15,23,42,0.95))] py-0 transition-all hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-400/50 hover:shadow-[0_24px_70px_rgba(8,47,73,0.45)]",
          featured && "border-cyan-300/60 bg-[linear-gradient(145deg,rgba(34,211,238,0.2),rgba(15,23,42,0.95))] shadow-[0_0_80px_rgba(34,211,238,0.2)]",
        )}
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-24 bg-[radial-gradient(circle,rgba(56,189,248,0.2),transparent_72%)]" />
        <CardHeader className="space-y-3 border-b border-slate-800/80 py-5">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline" className="border-cyan-500/45 bg-cyan-500/10 text-cyan-200">{label}</Badge>
            <span className="rounded-lg border border-slate-700 bg-slate-950/70 p-2 text-cyan-300">
              <Icon className="size-4" />
            </span>
          </div>
          <CardTitle className="text-3xl leading-tight text-white md:text-4xl">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 py-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Who this is for</p>
            <p className="max-w-[52ch] text-sm text-slate-200">{whoFor}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">What you get</p>
            <p className="max-w-[52ch] text-sm font-medium text-cyan-200">{outcome}</p>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/8 px-2.5 py-2">
              <p className="text-[10px] font-semibold tracking-[0.1em] text-cyan-300 uppercase">Outcome focus</p>
              <p className="mt-1 text-xs text-cyan-100">{outcome}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Journey</p>
            <div className={cn("grid gap-2", compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3")}>
              {steps.map((step, index) => (
                <div key={step} className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs text-slate-200">
                  <p className="text-[10px] text-cyan-300">Step {index + 1}</p>
                  <p className="mt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="inline-flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-3.5 text-cyan-300" />No fluff, clear priorities</li>
            <li className="inline-flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-3.5 text-cyan-300" />Built around your current bottleneck</li>
          </ul>
        </CardContent>

        <CardFooter className="border-t border-slate-800/80 py-4">
          <Button asChild size="lg" className="w-full">
            <Link href={href}>
              {ctaLabel}
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </MotionReveal>
  );
}
