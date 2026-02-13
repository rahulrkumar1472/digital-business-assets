import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { AddToPlanButton } from "@/components/cart/add-to-plan-button";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type OutcomeCardProps = {
  title: string;
  result: string;
  timeframe: string;
  price: string;
  bullets: string[];
  href: string;
  delay?: number;
  priorityLabel?: string;
};

export function OutcomeCard({
  title,
  result,
  timeframe,
  price,
  bullets,
  href,
  delay = 0,
  priorityLabel,
}: OutcomeCardProps) {
  const derivedSlug = href.startsWith("/services/") ? href.replace("/services/", "") : "";

  return (
    <MotionReveal delay={delay}>
      <Card className={cn("h-full border-slate-800/90 bg-slate-900/45 py-0 transition-all hover:-translate-y-0.5 hover:border-cyan-400/40", priorityLabel && "border-cyan-500/45")}>
        <CardHeader className="space-y-3 border-b border-slate-800/85 py-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold tracking-[0.08em] text-cyan-200 uppercase">{price}</span>
            {priorityLabel ? (
              <Badge variant="outline" className="border-cyan-500/45 bg-cyan-500/10 text-cyan-200">{priorityLabel}</Badge>
            ) : null}
          </div>
          <CardTitle className="text-2xl text-white">{title}</CardTitle>
          <p className="max-w-[44ch] text-sm text-cyan-200">You get {result} in {timeframe}.</p>
        </CardHeader>

        <CardContent className="py-5">
          <ul className="space-y-2 text-sm text-slate-300">
            {bullets.map((bullet) => (
              <li key={bullet} className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t border-slate-800/85 py-4">
          <Button asChild variant="ghost" className="w-full justify-between text-cyan-300 hover:bg-slate-800/50 hover:text-cyan-200">
            <Link href={href}>
              View service
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          {derivedSlug ? (
            <AddToPlanButton slug={derivedSlug} title={title} price={price} className="w-full" />
          ) : null}
        </CardFooter>
      </Card>
    </MotionReveal>
  );
}
