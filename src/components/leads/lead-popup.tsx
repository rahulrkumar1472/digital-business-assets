"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getStoredLead, storeLead } from "@/lib/leads/client";

const shownSessionKey = "dba_popup_shown_session";
const lastShownAtKey = "dba_popup_last_shown";
const doNotShowKey = "dba_popup_do_not_show";
const cooldownMs = 7 * 24 * 60 * 60 * 1000;

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LeadPopup() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    website: "",
    consentWeekly: true,
  });

  useEffect(() => {
    const stored = getStoredLead();
    const urlFromQuery = searchParams.get("url") || "";
    const websiteFromContext = urlFromQuery || stored?.website || window.localStorage.getItem("dba_last_audit_url") || "";

    setForm((previous) => ({
      ...previous,
      name: stored?.name || previous.name,
      email: stored?.email || previous.email,
      phone: stored?.phone || previous.phone,
      businessName: stored?.businessName || previous.businessName,
      website: websiteFromContext || previous.website,
      consentWeekly: typeof stored?.consentWeekly === "boolean" ? stored.consentWeekly : previous.consentWeekly,
    }));
  }, [searchParams]);

  useEffect(() => {
    const doNotShow = window.localStorage.getItem(doNotShowKey) === "1";
    if (doNotShow) {
      return;
    }

    const shownThisSession = window.sessionStorage.getItem(shownSessionKey) === "1";
    const lastShown = Number(window.localStorage.getItem(lastShownAtKey) || 0);
    const inCooldown = Number.isFinite(lastShown) && lastShown > 0 && Date.now() - lastShown < cooldownMs;

    if (shownThisSession || inCooldown) {
      return;
    }

    const markShown = () => {
      window.sessionStorage.setItem(shownSessionKey, "1");
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

    const timer = window.setTimeout(openPopup, 8000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const close = () => setOpen(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.email.trim() || !emailIsValid(form.email.trim())) {
      setError("Please enter a valid email.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          businessName: form.businessName,
          website: form.website,
          source: "popup",
          pagePath: pathname || "/",
          consentWeekly: form.consentWeekly,
        }),
      });

      const result = (await response.json()) as { ok?: boolean; leadId?: string; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "save-failed");
      }

      storeLead({
        leadId: result.leadId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        website: form.website,
        consentWeekly: form.consentWeekly,
      });

      close();
    } catch {
      setError("Could not save your details right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-slate-800 bg-slate-950 text-slate-100 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Get your free weekly Growth Check</DialogTitle>
          <DialogDescription className="pt-1 text-slate-300">
            We&apos;ll monitor your site weekly and send 3 fixes that increase leads. Plus 30% off your first month if you want us to implement it.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Name"
              className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
            />
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              type="email"
              className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
              required
            />
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
              className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
            />
            <input
              value={form.businessName}
              onChange={(event) => setForm((prev) => ({ ...prev, businessName: event.target.value }))}
              placeholder="Business name"
              className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
            />
          </div>

          <input
            value={form.website}
            onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            placeholder="Website"
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100"
          />

          <label className="flex items-start gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={form.consentWeekly}
              onChange={(event) => setForm((prev) => ({ ...prev, consentWeekly: event.target.checked }))}
              className="mt-0.5 size-4 rounded border-slate-700 bg-slate-900"
            />
            Yes - send my weekly Growth Check
          </label>

          {error ? <p className="text-xs text-red-300">{error}</p> : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200 sm:flex-1" disabled={submitting}>
              {submitting ? "Sending..." : "Send me my weekly check"}
            </Button>
            <Button type="button" variant="outline" className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 sm:flex-1" onClick={close}>
              No thanks
            </Button>
          </div>

          <button
            type="button"
            className="text-xs text-slate-400 underline-offset-2 hover:text-slate-300 hover:underline"
            onClick={() => {
              window.localStorage.setItem(doNotShowKey, "1");
              close();
            }}
          >
            Don&apos;t show again
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
