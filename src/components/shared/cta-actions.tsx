"use client";

import Link from "next/link";

import { BuildPlanDialogButton } from "@/components/shared/build-plan-dialog-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaActionsProps = {
  className?: string;
  align?: "left" | "center";
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CtaActions({
  className,
  align = "left",
  primaryLabel = "Get a Free Build Plan",
  secondaryLabel = "See Case Studies",
  secondaryHref = "/case-studies",
}: CtaActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      <BuildPlanDialogButton label={primaryLabel} />

      <Button
        variant="outline"
        size="lg"
        asChild
        className="border-slate-700 bg-slate-900/40 text-slate-100 hover:bg-slate-800"
      >
        <Link href={secondaryHref}>{secondaryLabel}</Link>
      </Button>
    </div>
  );
}
