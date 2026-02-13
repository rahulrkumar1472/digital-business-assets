"use client";

import Link from "next/link";

import { LeadCaptureForm } from "@/components/shared/lead-capture-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type AnalyticsPayload, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type PrimaryCTAProps = {
  label?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  href?: string;
  secondary?: boolean;
  eventName?: string;
  eventPayload?: AnalyticsPayload;
  onClick?: () => void;
};

export function PrimaryCTA({
  label = "Get a Growth Plan",
  className,
  size = "lg",
  href,
  secondary = false,
  eventName,
  eventPayload,
  onClick,
}: PrimaryCTAProps) {
  const handleClick = () => {
    if (eventName) {
      trackEvent(eventName, eventPayload);
    }
    onClick?.();
  };

  if (href) {
    return (
      <Button
        asChild
        size={size}
        variant={secondary ? "outline" : "default"}
        className={cn(
          secondary
            ? "border-slate-700 bg-slate-900/40 text-slate-100 hover:bg-slate-800"
            : "bg-cyan-300 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.32)] transition-all hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_0_55px_rgba(34,211,238,0.46)]",
          className,
        )}
      >
        <Link href={href} onClick={handleClick}>
          {label}
        </Link>
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={size}
          onClick={handleClick}
          className={cn(
            "bg-cyan-300 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.32)] transition-all hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_0_55px_rgba(34,211,238,0.46)]",
            className,
          )}
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-800 bg-slate-950 text-slate-100 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Get Your AI Growth Plan</DialogTitle>
          <DialogDescription className="text-slate-400">
            Tell us your goals. We will map the fastest revenue system for your business.
          </DialogDescription>
        </DialogHeader>
        <LeadCaptureForm compact />
      </DialogContent>
    </Dialog>
  );
}
