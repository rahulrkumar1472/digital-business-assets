"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RequestLinkResponse = {
  ok?: boolean;
  token?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PortalLinkRequestForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = email.trim().toLowerCase();
    if (!emailPattern.test(normalized)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/portal/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });

      const payload = (await response.json()) as RequestLinkResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Could not create your dashboard link.");
      }

      if (payload.token) {
        router.push(`/portal/${payload.token}`);
        return;
      }

      setNotice("If we found your lead record, your secure dashboard link is now ready.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not create your dashboard link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
      <div>
        <label htmlFor="portal-email" className="text-xs font-semibold tracking-[0.12em] text-slate-300 uppercase">
          Email address
        </label>
        <Input
          id="portal-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@business.co.uk"
          className="mt-2 h-12 border-slate-700 bg-slate-950/70 text-base text-slate-100"
          required
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
        <p className="inline-flex items-center gap-2 font-semibold text-cyan-200">
          <ShieldCheck className="size-4" />
          Your dashboard link is private and expires in 24 hours.
        </p>
        <p className="mt-1">No spam. We use this only to retrieve your saved audit and simulator history.</p>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {notice ? <p className="text-sm text-cyan-200">{notice}</p> : null}

      <Button type="submit" className="h-12 w-full bg-cyan-300 text-base text-slate-950 hover:bg-cyan-200" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        Send my dashboard link
      </Button>
    </form>
  );
}
