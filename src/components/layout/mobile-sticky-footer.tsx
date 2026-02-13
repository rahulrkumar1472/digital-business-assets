"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { useFunnelTrack } from "@/components/funnel/funnel-provider";
import { trackEvent } from "@/lib/analytics";

export function MobileStickyFooter() {
  const { track } = useFunnelTrack();
  const secondaryHref =
    track === "track2" ? "/tools/website-audit/start" : "/services/website-starter-build";
  const secondaryLabel = track === "track2" ? "Run Website Audit" : "See Starter Build";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[72] border-t border-slate-800/90 bg-slate-950/92 px-4 pt-2 pb-[calc(0.65rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-3">
        <Link
          href={secondaryHref}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/75 px-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/35 hover:text-cyan-100"
          onClick={() =>
            trackEvent("hero_cta_click", {
              location: "mobile_sticky_footer",
              destination: secondaryHref,
              track,
            })
          }
        >
          {secondaryLabel}
        </Link>
        <Link
          href="/bespoke-plan"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/45 bg-cyan-400/15 px-3 text-sm font-semibold text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)] transition hover:bg-cyan-400/20"
          onClick={() =>
            trackEvent("hero_cta_click", {
              location: "mobile_sticky_footer",
              destination: "/bespoke-plan",
              track,
            })
          }
        >
          <Sparkles className="size-4" />
          Create Plan
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

