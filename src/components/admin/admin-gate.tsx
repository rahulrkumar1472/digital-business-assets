"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminGateProps = {
  passwordConfigured: boolean;
};

export function AdminGate({ passwordConfigured }: AdminGateProps) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordConfigured) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Invalid password.");
      }

      window.location.reload();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not authenticate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.4)]">
      <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-cyan-200 uppercase">
        <ShieldCheck className="size-4" />
        Lead Vault Access
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Admin Access Required</h1>
      <p className="mt-2 text-sm text-slate-300">
        Enter your admin password to open Lead Vault and operator analytics.
      </p>

      {passwordConfigured ? (
        <form className="mt-5 space-y-3" onSubmit={onSubmit}>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            className="h-11 border-slate-700 bg-slate-950/70 text-slate-100"
            autoComplete="current-password"
          />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={submitting}>
            {submitting ? "Unlocking..." : "Unlock Lead Vault"}
          </Button>
        </form>
      ) : (
        <div className="mt-5 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm text-amber-100">
          `ADMIN_PASSWORD` is not configured. Add it to your environment to enable admin access.
        </div>
      )}
    </div>
  );
}
