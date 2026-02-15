"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type PortalLinkButtonProps = {
  leadId: string;
  initialToken?: string | null;
  initialExpiresAt?: string | null;
};

type PortalApiResponse = {
  ok?: boolean;
  token?: string;
  expiresAt?: string;
  url?: string;
  message?: string;
};

export function PortalLinkButton({ leadId, initialToken, initialExpiresAt }: PortalLinkButtonProps) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(initialToken || "");
  const [expiresAt, setExpiresAt] = useState(initialExpiresAt || "");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const portalHref = useMemo(() => (token ? `/portal/${token}` : ""), [token]);

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/portal-link`, {
        method: "POST",
      });
      const payload = (await response.json()) as PortalApiResponse;

      if (!response.ok || !payload.ok || !payload.token) {
        throw new Error(payload.message || "Could not generate portal link.");
      }

      setToken(payload.token);
      setExpiresAt(payload.expiresAt || "");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate portal link.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!portalHref) return;

    try {
      const absolute = `${window.location.origin}${portalHref}`;
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Could not copy link.");
    }
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5">
      <p className="text-xs font-semibold tracking-[0.08em] text-cyan-200 uppercase">Portal access</p>
      <h3 className="mt-1 text-lg font-semibold text-white">Generate portal link</h3>
      <p className="mt-1 text-sm text-slate-300">Create a 24-hour secure dashboard URL for this lead.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={() => void generate()} className="bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={loading}>
          <Link2 className="size-4" />
          {loading ? "Generating..." : "Generate portal link"}
        </Button>
        <Button type="button" variant="outline" className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800" onClick={() => void copyLink()} disabled={!portalHref}>
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>

      {portalHref ? (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/65 p-3 text-xs text-slate-300">
          <p className="font-semibold text-slate-100">Latest token: {token.slice(0, 12)}...</p>
          <p className="mt-1">Expires: {expiresAt ? new Date(expiresAt).toLocaleString("en-GB") : "—"}</p>
          <Link href={portalHref} className="mt-2 inline-flex font-semibold text-cyan-200 hover:text-cyan-100">
            Open dashboard
          </Link>
        </div>
      ) : null}

      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </article>
  );
}
