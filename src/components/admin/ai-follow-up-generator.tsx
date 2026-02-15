"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, Clipboard, Loader2, MessageCircle, MessagesSquare, PhoneCall, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GeneratedMessagePayload = {
  id?: string;
  createdAt?: string;
  domain: string;
  weakestFunnelStage: string;
  topFindings: string[];
  estimatedRevenueGain: string;
  urgencyFactor: string;
  emailVersion: string;
  whatsappVersion: string;
  smsVersion: string;
  callScriptVersion: string;
};

type FollowUpApiResponse = {
  ok: boolean;
  error?: string;
  message?: GeneratedMessagePayload | null;
};

type AiFollowUpGeneratorProps = {
  leadId: string;
};

function asTopFindings(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 3);
}

async function copyToClipboard(value: string) {
  if (!value) return;
  await navigator.clipboard.writeText(value);
}

export function AiFollowUpGenerator({ leadId }: AiFollowUpGeneratorProps) {
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<GeneratedMessagePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadLatest = async () => {
      try {
        const response = await fetch(`/api/admin/leads/${leadId}/generate-message`);
        const data = (await response.json()) as FollowUpApiResponse;

        if (!mounted) return;

        if (response.ok && data.ok && data.message) {
          setMessage({
            ...data.message,
            topFindings: asTopFindings(data.message.topFindings),
          });
        }
      } catch {
        // best effort load only
      } finally {
        if (mounted) {
          setLoadingInitial(false);
        }
      }
    };

    void loadLatest();

    return () => {
      mounted = false;
    };
  }, [leadId]);

  const generate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/generate-message`, {
        method: "POST",
      });

      const data = (await response.json()) as FollowUpApiResponse;
      if (!response.ok || !data.ok || !data.message) {
        throw new Error(data.error || "Could not generate follow-up message.");
      }

      setMessage({
        ...data.message,
        topFindings: asTopFindings(data.message.topFindings),
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate follow-up message.");
    } finally {
      setGenerating(false);
    }
  };

  const findingsLine = useMemo(() => {
    if (!message?.topFindings?.length) return "No findings available yet.";
    return message.topFindings.join(" • ");
  }, [message?.topFindings]);

  const renderCopyButton = (tabKey: string, value: string) => (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="h-8 border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
      onClick={() => {
        void copyToClipboard(value);
        setCopiedTab(tabKey);
        window.setTimeout(() => setCopiedTab((current) => (current === tabKey ? null : current)), 1400);
      }}
    >
      <Clipboard className="size-3.5" />
      {copiedTab === tabKey ? "Copied" : "Copy"}
    </Button>
  );

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-cyan-200 uppercase">
            <Bot className="size-3.5" />
            AI Conversion Agent
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">Generate AI Follow-Up</h3>
          <p className="mt-1 text-sm text-slate-300">
            Builds outreach across email, WhatsApp, SMS, and call script using the lead&apos;s audit and simulator context.
          </p>
        </div>

        <Button
          type="button"
          className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
          disabled={generating}
          onClick={() => void generate()}
        >
          {generating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate AI Follow-Up
            </>
          )}
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

      {loadingInitial && !message ? <p className="mt-3 text-sm text-slate-400">Loading latest message...</p> : null}

      {message ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
              <p className="text-slate-400">Domain</p>
              <p className="mt-0.5 font-medium text-slate-100">{message.domain}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
              <p className="text-slate-400">Weakest stage</p>
              <p className="mt-0.5 font-medium text-slate-100">{message.weakestFunnelStage}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
              <p className="text-slate-400">Estimated gain</p>
              <p className="mt-0.5 font-medium text-emerald-200">{message.estimatedRevenueGain}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
              <p className="text-slate-400">Urgency factor</p>
              <p className="mt-0.5 font-medium text-amber-200">{message.urgencyFactor}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/55 p-3 text-xs text-slate-300">
            <p className="text-slate-400">Top findings used</p>
            <p className="mt-1">{findingsLine}</p>
          </div>

          <Tabs defaultValue="email" className="gap-3">
            <TabsList className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-950/60 p-1 md:grid-cols-4">
              <TabsTrigger value="email" className="data-[state=active]:bg-slate-800/70">
                <MessagesSquare className="size-3.5" />
                Email
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="data-[state=active]:bg-slate-800/70">
                <MessageCircle className="size-3.5" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="sms" className="data-[state=active]:bg-slate-800/70">
                <MessageCircle className="size-3.5" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="call-script" className="data-[state=active]:bg-slate-800/70">
                <PhoneCall className="size-3.5" />
                Call Script
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="mb-2 flex justify-end">{renderCopyButton("email", message.emailVersion)}</div>
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-200">{message.emailVersion}</pre>
            </TabsContent>

            <TabsContent value="whatsapp" className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="mb-2 flex justify-end">{renderCopyButton("whatsapp", message.whatsappVersion)}</div>
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-200">{message.whatsappVersion}</pre>
            </TabsContent>

            <TabsContent value="sms" className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="mb-2 flex justify-end">{renderCopyButton("sms", message.smsVersion)}</div>
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-200">{message.smsVersion}</pre>
            </TabsContent>

            <TabsContent value="call-script" className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="mb-2 flex justify-end">{renderCopyButton("call-script", message.callScriptVersion)}</div>
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-200">{message.callScriptVersion}</pre>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </article>
  );
}
