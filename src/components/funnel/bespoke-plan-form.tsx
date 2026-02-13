"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useFunnelTrack } from "@/components/funnel/funnel-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCartItems, type PlanModuleItem } from "@/lib/cart/cart-store";

type Step = 1 | 2 | 3;

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  industry: string;
  websiteState: "no-website" | "already-online";
  leadVolumeRange: string;
  monthlyRevenueRange: string;
  biggestBlocker: string;
  preferredContact: "book-call" | "message";
  notes: string;
};

const defaultState: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  industry: "",
  websiteState: "no-website",
  leadVolumeRange: "0-25",
  monthlyRevenueRange: "0-10k",
  biggestBlocker: "",
  preferredContact: "book-call",
  notes: "",
};

export function BespokePlanForm() {
  const router = useRouter();
  const { track, setTrack } = useFunnelTrack();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(defaultState);
  const [modules, setModules] = useState<PlanModuleItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setModules(getCartItems());
  }, []);

  useEffect(() => {
    if (track === "track2") {
      setForm((prev) => ({ ...prev, websiteState: "already-online" }));
    }
  }, [track]);

  const inferredTrack = useMemo(() => {
    return form.websiteState === "already-online" ? "track2" : "track1";
  }, [form.websiteState]);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    setError(null);
    if (step === 1) {
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.company.trim()) {
        setError("Please complete all required fields.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!form.biggestBlocker.trim()) {
        setError("Tell us your biggest blocker before continuing.");
        return;
      }
      setStep(3);
    }
  };

  const goBack = () => {
    setError(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/bespoke-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          track: inferredTrack,
          selectedModules: modules,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        nextUrl?: string;
      };

      if (!response.ok || !data.success || !data.nextUrl) {
        throw new Error(data.message || "Could not submit bespoke plan.");
      }

      setTrack(inferredTrack);
      router.push(data.nextUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit bespoke plan.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="inline-flex rounded-full border border-slate-700 bg-slate-950/65 px-3 py-1 text-xs text-slate-300">
        Step {step} of 3
      </div>

      {step === 1 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Full name</label>
            <Input value={form.name} onChange={(event) => update("name", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Email</label>
            <Input value={form.email} onChange={(event) => update("email", event.target.value)} type="email" className="border-slate-700 bg-slate-950/60 text-slate-100" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Phone</label>
            <Input value={form.phone} onChange={(event) => update("phone", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Company</label>
            <Input value={form.company} onChange={(event) => update("company", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" required />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Website status</label>
              <select
                value={form.websiteState}
                onChange={(event) => update("websiteState", event.target.value)}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-100"
              >
                <option value="no-website">No website / weak website</option>
                <option value="already-online">Already online</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Website URL (optional)</label>
              <Input value={form.website} onChange={(event) => update("website", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Industry</label>
              <Input value={form.industry} onChange={(event) => update("industry", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Biggest blocker</label>
              <Input value={form.biggestBlocker} onChange={(event) => update("biggestBlocker", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" required />
            </div>
          </div>
          <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
            Suggested track: {inferredTrack === "track1" ? "Track 1 (Get Online in 72 Hours)" : "Track 2 (Analyse & Improve)"}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Lead volume range</label>
              <select
                value={form.leadVolumeRange}
                onChange={(event) => update("leadVolumeRange", event.target.value)}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-100"
              >
                <option value="0-25">0-25 / month</option>
                <option value="26-100">26-100 / month</option>
                <option value="101-300">101-300 / month</option>
                <option value="300+">300+ / month</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Monthly revenue range</label>
              <select
                value={form.monthlyRevenueRange}
                onChange={(event) => update("monthlyRevenueRange", event.target.value)}
                className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-100"
              >
                <option value="0-10k">£0-10k</option>
                <option value="10k-30k">£10k-30k</option>
                <option value="30k-75k">£30k-75k</option>
                <option value="75k+">£75k+</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Preferred contact</label>
            <select
              value={form.preferredContact}
              onChange={(event) => update("preferredContact", event.target.value)}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-100"
            >
              <option value="book-call">Book call</option>
              <option value="message">Message first</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="min-h-24 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
            <p className="font-semibold text-white">Selected modules in your plan: {modules.length}</p>
            {modules.length > 0 ? (
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                {modules.map((module) => (
                  <li key={module.slug}>• {module.title}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-xs text-slate-400">No modules selected yet. You can still submit this plan request.</p>
            )}
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800"
            onClick={goBack}
          >
            Back
          </Button>
        ) : null}
        {step < 3 ? (
          <Button type="button" className="sm:ml-auto" onClick={goNext}>
            Continue
          </Button>
        ) : (
          <Button type="submit" className="sm:ml-auto" disabled={loading}>
            {loading ? "Submitting..." : "Submit Bespoke Plan"}
          </Button>
        )}
      </div>
    </form>
  );
}

