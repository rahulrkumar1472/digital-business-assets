"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const starterMessage =
  "Tell me your industry + what’s stuck: leads, conversion, follow-up, or all of it?";

const quickPrompts = [
  "We are missing too many leads",
  "Our follow-up process is too slow",
  "I'm a plumber and missed calls are killing sales",
  "I need a 30-day growth plan",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: starterMessage },
  ]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollerRef.current) {
      return;
    }

    scrollerRef.current.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setShowNudge(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowNudge(true);
    }, 6000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen, messages.length]);

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isLoading) {
      return;
    }

    const nextUserMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, nextUserMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages.map((message) => ({ role: message.role, content: message.content })) }),
      });

      const data = (await response.json()) as {
        message?: string;
        leadCaptured?: boolean;
      };

      const assistantText = (data.message || "I can help map your growth plan. Tell me your biggest blocker.").trim();

      setMessages((previous) => [
        ...previous,
        {
          id: createId(),
          role: "assistant",
          content: assistantText,
        },
      ]);

      if (data.leadCaptured && !leadCaptured) {
        setLeadCaptured(true);
        trackEvent("chatbot_lead_captured", {
          source: "chat_widget",
        });
      }
    } catch (error) {
      console.error("[chat-widget] failed", error);
      setMessages((previous) => [
        ...previous,
        {
          id: createId(),
          role: "assistant",
          content:
            "I hit a temporary issue. Share your industry, monthly revenue, and biggest blocker, and I will still map the next step.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  const handleOpen = () => {
    setIsOpen((previous) => {
      const next = !previous;
      if (next) {
        setShowNudge(false);
        trackEvent("chatbot_open", {
          source: "floating_widget",
        });
      }
      return next;
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="fixed right-4 bottom-[calc(5.85rem+env(safe-area-inset-bottom))] z-[70] sm:right-6 sm:bottom-24 lg:bottom-6"
      >
        <AnimatePresence>
          {showNudge ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-2 ml-auto max-w-[220px] rounded-xl border border-cyan-500/35 bg-slate-950/95 px-3 py-2 text-xs text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >
              Want a free growth plan?
            </motion.div>
          ) : null}
        </AnimatePresence>
        <Button
          onClick={handleOpen}
          className="group h-12 rounded-full border border-cyan-400/40 bg-slate-950/90 px-4 text-slate-100 shadow-[0_0_30px_rgba(34,211,238,0.32)] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(34,211,238,0.45)]"
          variant="outline"
        >
          <motion.span
            animate={showNudge ? { y: [0, -2.6, 0], scale: [1, 1.05, 1] } : { y: [0, -1.8, 0] }}
            transition={{ duration: showNudge ? 1.5 : 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="mr-2 inline-flex size-7 items-center justify-center rounded-full bg-cyan-500/20"
          >
            <Bot className="size-4 text-cyan-300" />
          </motion.span>
          <span className="text-sm font-semibold">Growth Consultant Online</span>
          <Sparkles className="ml-2 size-4 text-cyan-300/90" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed right-4 bottom-[calc(7.1rem+env(safe-area-inset-bottom))] z-[80] flex h-[min(70vh,640px)] w-[min(430px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/95 shadow-[0_30px_90px_rgba(2,6,23,0.8)] backdrop-blur sm:right-6 lg:bottom-20"
          >
            <div className="flex items-center justify-between border-b border-slate-800/90 bg-slate-950/92 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">AI Business Growth Specialist</p>
                <p className="text-[11px] text-slate-400">Consultative mode: diagnose before recommendations</p>
              </div>
              <Button size="icon" variant="ghost" className="text-slate-300 hover:bg-slate-800" onClick={() => setIsOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <div ref={scrollerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    message.role === "assistant"
                      ? "mr-auto border border-slate-700 bg-slate-900 text-slate-100"
                      : "ml-auto border border-cyan-500/35 bg-cyan-500/10 text-cyan-100",
                  )}
                >
                  {message.content}
                </div>
              ))}

              {isLoading ? (
                <div className="mr-auto inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
                  <Loader2 className="size-4 animate-spin" />
                  Thinking...
                </div>
              ) : null}

              {messages.length <= 2 ? (
                <div className="space-y-2 pt-1">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-left text-xs text-slate-200 transition hover:border-cyan-400/45 hover:text-cyan-100"
                      onClick={() => {
                        void sendMessage(prompt);
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-800/90 p-3">
              {leadCaptured ? (
                <div className="mb-3 rounded-xl border border-cyan-500/35 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                  Lead details captured. Ready for strategy call handoff.
                </div>
              ) : null}

              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type your message..."
                  className="border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500"
                />
                <Button type="submit" size="icon" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={isLoading}>
                  <Send className="size-4" />
                </Button>
              </form>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>No guarantees. Estimates are scenario-based.</span>
                <Link
                  href="/book"
                  className="text-cyan-300 hover:text-cyan-200"
                  onClick={() =>
                    trackEvent("book_call_click", {
                      source: "chat_widget",
                    })
                  }
                >
                  Book a call
                </Link>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Want me to connect you to a real consultant? Say “handoff”.</p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
