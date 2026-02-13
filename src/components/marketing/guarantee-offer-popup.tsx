"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

const sessionShownKey = "dba_guarantee_popup_shown_session";
const lastShownAtKey = "dba_guarantee_popup_last_shown_at";
const cooldownMs = 7 * 24 * 60 * 60 * 1000;

export function GuaranteeOfferPopup() {
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const shownThisSession = window.sessionStorage.getItem(sessionShownKey) === "1";
    const lastShownAt = Number(window.localStorage.getItem(lastShownAtKey) || 0);
    const inCooldown = Number.isFinite(lastShownAt) && lastShownAt > 0 && Date.now() - lastShownAt < cooldownMs;

    if (shownThisSession || inCooldown) {
      return;
    }

    const markShown = () => {
      window.sessionStorage.setItem(sessionShownKey, "1");
      window.localStorage.setItem(lastShownAtKey, String(Date.now()));
    };

    const openPopup = () => {
      if (shownRef.current) {
        return;
      }

      shownRef.current = true;
      markShown();
      setOpen(true);
    };

    const timer = window.setTimeout(() => {
      openPopup();
    }, 8000);

    const onExitIntent = (event: MouseEvent) => {
      const leavingDocument = !event.relatedTarget;
      if (leavingDocument && event.clientY <= 10 && window.innerWidth >= 1024) {
        openPopup();
      }
    };

    window.addEventListener("mouseout", onExitIntent);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mouseout", onExitIntent);
    };
  }, []);

  const closePopup = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : closePopup())}>
      <DialogContent className="border-slate-800 bg-slate-950 text-slate-100 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Claim your money-back guarantee offer</DialogTitle>
          <DialogDescription className="pt-1 text-slate-300">
            If we can&apos;t demonstrate measurable growth in 30 days, we refund your first month.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          Priority rollout windows are capped weekly. Speed wins. The first responder wins.
        </div>

        <p className="text-xs text-slate-400">Terms apply. Growth depends on implementation and market conditions.</p>

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
            <Link href="/growth-simulator">Get My Growth Plan</Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
