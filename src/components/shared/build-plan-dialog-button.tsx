"use client";

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
import { cn } from "@/lib/utils";

type BuildPlanDialogButtonProps = {
  label?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
};

export function BuildPlanDialogButton({
  label = "Get a Free Build Plan",
  className,
  size = "lg",
}: BuildPlanDialogButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={size} className={cn("bg-cyan-300 text-slate-950 hover:bg-cyan-200", className)}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-800 bg-slate-950 text-slate-100 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Your Free Build Plan</DialogTitle>
          <DialogDescription className="text-slate-400">
            Tell us where leads are leaking and we will map your highest-impact 30-day build.
          </DialogDescription>
        </DialogHeader>
        <LeadCaptureForm compact />
      </DialogContent>
    </Dialog>
  );
}
