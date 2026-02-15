"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type FollowUpEmailButtonProps = {
  leadId: string;
};

export function FollowUpEmailButton({ leadId }: FollowUpEmailButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "copied" | "error">("idle");

  const generateEmail = async () => {
    setStatus("loading");
    try {
      const response = await fetch(`/api/admin/leads/${leadId}/follow-up`);
      const data = (await response.json()) as { ok?: boolean; subject?: string; body?: string; message?: string };

      if (!response.ok || !data.ok || !data.subject || !data.body) {
        throw new Error(data.message || "Could not generate follow-up email.");
      }

      const payload = `Subject: ${data.subject}\n\n${data.body}`;
      await navigator.clipboard.writeText(payload);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
      onClick={() => void generateEmail()}
      disabled={status === "loading"}
    >
      {status === "loading"
        ? "Generating..."
        : status === "copied"
          ? "Copied"
          : status === "error"
            ? "Try again"
            : "Generate Follow-up Email"}
    </Button>
  );
}
