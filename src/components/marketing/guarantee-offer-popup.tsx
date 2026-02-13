"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

const storageKey = "dba_guarantee_popup_dismissed";

export function GuaranteeOfferPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.localStorage.getItem(storageKey) === "1") {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, 10000);

    const onExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 8) {
        setOpen(true);
      }
    };

    window.addEventListener("mousemove", onExitIntent);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", onExitIntent);
    };
  }, []);

  const closePopup = () => {
    window.localStorage.setItem(storageKey, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : closePopup())}>
      <DialogContent className="border-slate-800 bg-slate-950 text-slate-100 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Claim your money-back guarantee offer</DialogTitle>
          <DialogDescription className="pt-1 text-slate-300">
            Book a strategy call and ask for the launch guarantee terms before onboarding.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          Priority implementation slots are limited each week.
        </div>

        <p className="text-xs text-slate-400">
          Disclaimer: Guarantee eligibility depends on agreed scope, asset handoff, and implementation requirements. This is not a promise of fixed revenue outcomes.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            onClick={() =>
              trackEvent("book_call_click", {
                source: "guarantee_popup",
              })
            }
          >
            <Link href="/book">Claim Offer & Book Call</Link>
          </Button>
          <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800" onClick={closePopup}>
            Continue Browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
