"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auditReasons } from "@/lib/scans/constants";

const phonePattern = /^[+()\d\s-]{7,22}$/;

type AuditStartFormState = {
  fullName: string;
  mobileNumber: string;
  businessName: string;
  websiteUrl: string;
  reason: (typeof auditReasons)[number];
  email: string;
  industry: string;
};

const initialState: AuditStartFormState = {
  fullName: "",
  mobileNumber: "",
  businessName: "",
  websiteUrl: "",
  reason: "All of it",
  email: "",
  industry: "",
};

export function WebsiteAuditStartForm() {
  const router = useRouter();
  const [form, setForm] = useState<AuditStartFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof AuditStartFormState, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.mobileNumber.trim() || !form.businessName.trim() || !form.websiteUrl.trim()) {
      setError("Please complete full name, mobile number, business name, and website URL.");
      return;
    }

    if (!phonePattern.test(form.mobileNumber.trim())) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/tools/website-audit/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        resultsUrl?: string;
      };

      if (!response.ok || !data.success || !data.resultsUrl) {
        throw new Error(data.error || "Could not start scan.");
      }

      router.push(data.resultsUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not start scan.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8" noValidate>
      <h2 className="text-2xl font-semibold text-white">Start your free website scan</h2>
      <p className="text-sm text-slate-300">
        Required: full name, mobile number, business name, website URL, and reason. Email is optional.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Full name</label>
          <Input value={form.fullName} onChange={(event) => update("fullName", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Mobile number</label>
          <Input value={form.mobileNumber} onChange={(event) => update("mobileNumber", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Business name</label>
          <Input value={form.businessName} onChange={(event) => update("businessName", event.target.value)} className="border-slate-700 bg-slate-950/60 text-slate-100" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Website URL</label>
          <Input value={form.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} placeholder="https://yourbusiness.co.uk" className="border-slate-700 bg-slate-950/60 text-slate-100" required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Primary concern</label>
          <select
            value={form.reason}
            onChange={(event) => update("reason", event.target.value)}
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-100"
          >
            {auditReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Industry</label>
          <Input value={form.industry} onChange={(event) => update("industry", event.target.value)} placeholder="e.g. Restaurant, Clinic, Real Estate" className="border-slate-700 bg-slate-950/60 text-slate-100" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Email (optional)</label>
        <Input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@company.co.uk" className="border-slate-700 bg-slate-950/60 text-slate-100" />
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <Button type="submit" className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Starting scan...
          </>
        ) : (
          "Run free website scan"
        )}
      </Button>

      <p className="text-xs text-slate-400">Terms apply. Growth depends on implementation and market conditions.</p>
    </form>
  );
}
