import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@/types/content";

type ServicePillarsProps = {
  services: Service[];
};

export function ServicePillars({ services }: ServicePillarsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {services.map((service, index) => {
        const Icon = service.icon;

        return (
          <MotionReveal key={service.slug} delay={index * 0.04}>
            <Card className="h-full border-slate-800/90 bg-slate-900/45 backdrop-blur transition-all hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_60px_rgba(8,47,73,0.35)]">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-lg border border-cyan-500/35 bg-cyan-500/10 p-2">
                    <Icon className="size-4.5 text-cyan-300" />
                  </span>
                  <span className="text-[11px] tracking-[0.08em] text-slate-400 uppercase">{service.entryPrice}</span>
                </div>
                <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                <p className="text-sm font-medium text-cyan-200">{service.strapline}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-2 text-sm text-slate-300">
                  {service.deliverables.slice(0, 3).map((point) => (
                    <li key={point} className="list-disc pl-1 marker:text-cyan-300">
                      {point}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="ghost" className="w-full justify-between px-0 text-cyan-300 hover:bg-transparent hover:text-cyan-200">
                  <Link href={`/services/${service.slug}`}>
                    View details
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </MotionReveal>
        );
      })}
    </div>
  );
}
