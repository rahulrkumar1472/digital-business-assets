import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@/types/content";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Card className="h-full border-slate-800/80 bg-slate-900/40 backdrop-blur">
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-2.5">
            <Icon className="size-5 text-cyan-300" />
          </div>
          <span className="text-xs font-medium text-slate-400">{service.entryPrice}</span>
        </div>
        <CardTitle className="text-xl text-white">{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-between gap-6">
        <p className="text-sm leading-relaxed text-slate-300">{service.shortDescription}</p>
        <Button
          asChild
          variant="ghost"
          className="justify-start px-0 text-cyan-300 hover:bg-transparent hover:text-cyan-200"
        >
          <Link href={`/services/${service.slug}`}>
            View service
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
