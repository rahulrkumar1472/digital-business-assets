"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, Route } from "lucide-react";

import { useFunnelTrack } from "@/components/funnel/funnel-provider";
import { Badge } from "@/components/ui/badge";
import { getBreadcrumbItems } from "@/lib/breadcrumbs/map";

export function Breadcrumbs() {
  const pathname = usePathname();
  const { track } = useFunnelTrack();
  const items = getBreadcrumbItems(pathname || "/");

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-3 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-950/55 px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <Route className="size-3.5 text-cyan-300" />
          Navigation
        </span>
        <span className="h-3.5 w-px bg-slate-700" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <span key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-1.5">
                {index > 0 ? <ChevronRight className="size-3 text-slate-500" /> : null}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-cyan-200"
                  >
                    {isFirst ? <Home className="size-3.5" /> : null}
                    <span className="truncate">{item.label}</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 text-white">
                    {isFirst ? <Home className="size-3.5" /> : null}
                    <span className="truncate">{item.label}</span>
                  </span>
                )}
              </span>
            );
          })}
        </nav>
        {track !== "unknown" ? (
          <>
            <span className="h-3.5 w-px bg-slate-700" />
            <Badge variant="outline" className="border-cyan-500/40 bg-cyan-500/10 text-cyan-200">
              {track === "track1" ? "Track 1" : "Track 2"}
            </Badge>
          </>
        ) : null}
      </div>
    </div>
  );
}

