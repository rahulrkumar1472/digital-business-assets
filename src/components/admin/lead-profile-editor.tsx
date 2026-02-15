"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LeadProfileEditorProps = {
  leadId: string;
  initialValues: {
    notes: string;
    intentTier: string;
    nextAction: string;
    status: string;
  };
};

const intentOptions = ["Hot", "Warm", "Cold"];
const statusOptions = ["New", "Contacted", "Booked", "Won", "Lost", "hot_followup_sent"];

export function LeadProfileEditor({ leadId, initialValues }: LeadProfileEditorProps) {
  const [notes, setNotes] = useState(initialValues.notes);
  const [intentTier, setIntentTier] = useState(initialValues.intentTier || "Warm");
  const [nextAction, setNextAction] = useState(initialValues.nextAction);
  const [status, setStatus] = useState(initialValues.status || "New");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, intentTier, nextAction, status }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not save lead profile.");
      }
      setMessage("Saved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save lead profile.");
    } finally {
      setSaving(false);
      window.setTimeout(() => setMessage(null), 1800);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/55 p-5">
      <h2 className="text-lg font-semibold text-white">Operator Controls</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1.5 text-sm text-slate-300">
          Intent tier
          <select
            value={intentTier}
            onChange={(event) => setIntentTier(event.target.value)}
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100"
          >
            {intentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5 text-sm text-slate-300">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1.5 text-sm text-slate-300">
        Next action
        <Input
          value={nextAction}
          onChange={(event) => setNextAction(event.target.value)}
          className="h-10 border-slate-700 bg-slate-950/70 text-slate-100"
          placeholder="Book strategy call and send ROI snapshot"
        />
      </label>

      <label className="space-y-1.5 text-sm text-slate-300">
        Notes
        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="min-h-24 border-slate-700 bg-slate-950/70 text-slate-100"
          placeholder="Operator notes"
        />
      </label>

      <div className="flex items-center gap-3">
        <Button type="button" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200" onClick={() => void save()} disabled={saving}>
          {saving ? "Saving..." : "Save profile"}
        </Button>
        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </div>
    </div>
  );
}
