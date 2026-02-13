import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Industry } from "@/types/content";

type IndustryCardProps = {
  industry: Industry;
};

export function IndustryCard({ industry }: IndustryCardProps) {
  return (
    <Card className="h-full overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-slate-800">
        <Image
          src={industry.coverImage}
          alt={industry.name}
          fill
          className="object-cover opacity-85"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>
      <CardHeader className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.08em] text-cyan-300 uppercase">
          {industry.audience}
        </p>
        <CardTitle className="text-xl text-white">{industry.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-slate-300">{industry.summary}</p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/industries/${industry.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Explore industry framework
          <ArrowRight className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
