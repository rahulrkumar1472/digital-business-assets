"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const plans = ["Starter", "Growth", "Scale"] as const;

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<(typeof plans)[number]>("Starter");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, plan }),
      });
      const data = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not sign up.");
      }

      router.push("/app");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not sign up.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border-slate-700 bg-slate-950/60 text-slate-100"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border-slate-700 bg-slate-950/60 text-slate-100"
          required
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">Plan</label>
        <select
          value={plan}
          onChange={(event) => setPlan(event.target.value as (typeof plans)[number])}
          className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-100"
        >
          {plans.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

