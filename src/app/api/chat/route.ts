import { NextResponse } from "next/server";

import { chatToolDefinitions, listIndustryNames, runChatTool } from "@/lib/chat-tools";
import { buildKnowledgeDigest } from "@/lib/knowledge";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ToolCall = {
  callId: string;
  name: string;
  args: Record<string, unknown>;
};

type FallbackProfile = {
  industry?: string;
  monthlyRevenue?: number;
  monthlyLeads?: number;
  blocker?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  budgetRange?: string;
  timeline?: string;
};

type ResponsesApiOutputItem = {
  type?: string;
  role?: string;
  content?: Array<Record<string, unknown>>;
  name?: string;
  arguments?: string;
  call_id?: string;
};

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const SYSTEM_PROMPT = `You are an AI Business Growth Consultant for Digital Business Assets, serving UK SMEs.

Rules:
- Ask one question at a time.
- Max 4 probing questions before giving value.
- Diagnose funnel leaks before recommendations.
- No fake guarantees or unverifiable claims.
- Keep advice concrete, structured, and concise.
- Use bullet points where helpful.
- Recommend services only from the available service list.
- Offer a 30-day action plan and ask to book a strategy call.
- Capture lead details before final handoff: name, email, phone, company, website, budget range, timeline.
- If lead details are provided, call save_lead.
- If user asks for recommendations, call recommend_assets.
- If user asks to book, call book_consultation.
`;

function normaliseMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      const raw = item as Record<string, unknown>;
      const role = raw.role === "assistant" ? "assistant" : raw.role === "user" ? "user" : null;
      const content = typeof raw.content === "string" ? raw.content.trim() : "";

      if (!role || !content) {
        return null;
      }

      return {
        role,
        content: content.slice(0, 2400),
      };
    })
    .filter((item): item is ChatMessage => Boolean(item))
    .slice(-16);
}

function buildConversationTranscript(messages: ChatMessage[]) {
  return messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join("\n");
}

async function callResponsesApi(payload: Record<string, unknown>) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI API request failed (${response.status}): ${details.slice(0, 600)}`);
  }

  return (await response.json()) as Record<string, unknown>;
}

async function saveLeadViaApi(request: Request, args: Record<string, unknown>) {
  const endpoint = new URL("/api/lead", request.url);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...args,
      source: "chatbot",
    }),
  });

  const data = (await response.json()) as Record<string, unknown>;
  return {
    ok: response.ok && Boolean(data.success),
    leadCaptured: response.ok && Boolean(data.success),
    message:
      (typeof data.message === "string" && data.message) ||
      "Lead details processed via /api/lead.",
    response: data,
  };
}

function extractAssistantMessage(data: Record<string, unknown>) {
  const directText = data.output_text;
  if (typeof directText === "string" && directText.trim()) {
    return directText.trim();
  }

  const output = Array.isArray(data.output) ? (data.output as ResponsesApiOutputItem[]) : [];

  for (const item of output) {
    if (item.type !== "message" || item.role !== "assistant" || !Array.isArray(item.content)) {
      continue;
    }

    const text = item.content
      .map((part) => {
        const candidate = part.text;
        return typeof candidate === "string" ? candidate : "";
      })
      .join("\n")
      .trim();

    if (text) {
      return text;
    }
  }

  return "";
}

function extractToolCalls(data: Record<string, unknown>): ToolCall[] {
  const output = Array.isArray(data.output) ? (data.output as ResponsesApiOutputItem[]) : [];
  const calls: ToolCall[] = [];

  for (const item of output) {
    if (item.type !== "function_call" || !item.call_id || !item.name) {
      continue;
    }

    let args: Record<string, unknown> = {};
    if (typeof item.arguments === "string" && item.arguments.trim()) {
      try {
        const parsed = JSON.parse(item.arguments) as unknown;
        if (parsed && typeof parsed === "object") {
          args = parsed as Record<string, unknown>;
        }
      } catch {
        args = {};
      }
    }

    calls.push({
      callId: item.call_id,
      name: item.name,
      args,
    });
  }

  return calls;
}

function extractNumericValue(source: string, pattern: RegExp) {
  const match = source.match(pattern);
  if (!match?.[1]) {
    return undefined;
  }

  const numeric = Number(match[1].replaceAll(",", ""));
  return Number.isFinite(numeric) ? numeric : undefined;
}

function inferFallbackProfile(messages: ChatMessage[]): FallbackProfile {
  const userMessages = messages.filter((message) => message.role === "user").map((message) => message.content);
  const joined = userMessages.join(" ").toLowerCase();

  const industries = listIndustryNames();
  const matchedIndustry = industries.find((industry) => joined.includes(industry.toLowerCase()));

  const blockers = ["traffic", "lead quality", "conversion", "follow-up", "all of it", "missed calls", "bookings"];
  const blocker = blockers.find((candidate) => joined.includes(candidate));

  const emailMatch = joined.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  const phoneMatch = joined.match(/(\+?[0-9][0-9\s()-]{7,20}[0-9])/i);
  const websiteMatch = joined.match(/https?:\/\/[^\s]+/i);

  const nameMatch =
    userMessages.join(" ").match(/(?:my name is|i am)\s+([A-Za-z][A-Za-z\s'-]{1,40})/i) ??
    userMessages.join(" ").match(/name[:\s]+([A-Za-z][A-Za-z\s'-]{1,40})/i);

  const companyMatch = userMessages.join(" ").match(/(?:company|business)\s*(?:is|:)?\s*([A-Za-z0-9&.,'\s-]{2,60})/i);
  const budgetMatch = userMessages.join(" ").match(/(?:budget|range)\s*(?:is|:)?\s*([A-Za-z0-9£$,\s-]{2,40})/i);
  const timelineMatch = userMessages.join(" ").match(/(?:timeline|timeframe)\s*(?:is|:)?\s*([A-Za-z0-9,\s-]{2,40})/i);

  return {
    industry: matchedIndustry,
    monthlyRevenue:
      extractNumericValue(joined, /(?:monthly revenue|revenue)\D*([0-9][0-9,]{2,})/i) ??
      extractNumericValue(joined, /£\s*([0-9][0-9,]{2,})/i),
    monthlyLeads: extractNumericValue(joined, /([0-9]{1,5})\s*(?:leads|enquiries|inquiries)\s*(?:per month|monthly|a month)?/i),
    blocker,
    name: nameMatch?.[1]?.trim(),
    email: emailMatch?.[0],
    phone: phoneMatch?.[1]?.trim(),
    company: companyMatch?.[1]?.trim(),
    website: websiteMatch?.[0],
    budgetRange: budgetMatch?.[1]?.trim(),
    timeline: timelineMatch?.[1]?.trim(),
  };
}

async function fallbackConsultantFlow(request: Request, messages: ChatMessage[]) {
  const profile = inferFallbackProfile(messages);

  if (!profile.industry) {
    return {
      message: "Tell me your industry first so I can benchmark this properly.",
      leadCaptured: false,
      usedFallback: true,
    };
  }

  if (!profile.monthlyRevenue) {
    return {
      message: "Roughly what is your monthly revenue right now?",
      leadCaptured: false,
      usedFallback: true,
    };
  }

  if (!profile.monthlyLeads) {
    return {
      message: "How many leads or enquiries do you generate per month?",
      leadCaptured: false,
      usedFallback: true,
    };
  }

  if (!profile.blocker) {
    return {
      message: "What is the biggest blocker right now: traffic, lead quality, conversion, or follow-up?",
      leadCaptured: false,
      usedFallback: true,
    };
  }

  const recommendation = await runChatTool("recommend_assets", {
    industry: profile.industry,
    monthlyRevenue: profile.monthlyRevenue,
    monthlyLeads: profile.monthlyLeads,
    blocker: profile.blocker,
  });

  const leadRequired = !profile.name || !profile.email || !profile.phone || !profile.company;

  if (leadRequired) {
    return {
      message: `Diagnosis: your main leaks are response delay, follow-up inconsistency, and booking friction.\n\nRecommended next stack: ${JSON.stringify(
        recommendation,
      )}\n\nIf you want the 30-day action plan, share name, email, phone, company, website, budget range, and timeline.`,
      leadCaptured: false,
      usedFallback: true,
    };
  }

  const saveResult = await saveLeadViaApi(request, {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    company: profile.company,
    website: profile.website,
    budgetRange: profile.budgetRange,
    timeline: profile.timeline,
    industry: profile.industry,
    monthlyRevenue: profile.monthlyRevenue,
    monthlyLeads: profile.monthlyLeads,
    message: `Biggest blocker: ${profile.blocker}`,
  });

  return {
    message:
      "Great, I have saved your details and mapped your likely leaks. Next step: book your strategy session here /book so we can finalise your 30-day implementation plan.",
    leadCaptured:
      Boolean(saveResult) &&
      typeof saveResult === "object" &&
      "leadCaptured" in saveResult &&
      Boolean((saveResult as { leadCaptured?: boolean }).leadCaptured),
    usedFallback: true,
    toolResults: [
      { name: "recommend_assets", output: recommendation },
      { name: "save_lead", output: saveResult },
    ],
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const messages = normaliseMessages(payload.messages);

    if (!messages.length) {
      return NextResponse.json({
        message: "Tell me your industry and what is stuck right now: traffic, lead quality, conversion, follow-up, or all of it?",
      });
    }

    const knowledgeDigest = buildKnowledgeDigest(14);
    const industries = listIndustryNames().join(", ");
    const transcript = buildConversationTranscript(messages);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(await fallbackConsultantFlow(request, messages));
    }

    const firstResponse = await callResponsesApi({
      model: MODEL,
      instructions: `${SYSTEM_PROMPT}\n\nKnown industries: ${industries}\n\nKnowledge:\n${knowledgeDigest}`,
      input: transcript,
      tools: chatToolDefinitions,
      tool_choice: "auto",
      temperature: 0.4,
    });

    if (!firstResponse) {
      return NextResponse.json(await fallbackConsultantFlow(request, messages));
    }

    const toolCalls = extractToolCalls(firstResponse);
    const toolResults: Array<{ name: string; output: unknown }> = [];
    let leadCaptured = false;

    for (const call of toolCalls) {
      const result =
        call.name === "save_lead"
          ? await saveLeadViaApi(request, call.args)
          : await runChatTool(call.name, call.args);
      if (
        result &&
        typeof result === "object" &&
        "leadCaptured" in result &&
        (result as { leadCaptured?: boolean }).leadCaptured
      ) {
        leadCaptured = true;
      }

      toolResults.push({
        name: call.name,
        output: result,
      });
    }

    let message = extractAssistantMessage(firstResponse);

    if (toolCalls.length > 0) {
      const secondResponse = await callResponsesApi({
        model: MODEL,
        previous_response_id: firstResponse.id,
        instructions: `${SYSTEM_PROMPT}\n\nKnown industries: ${industries}`,
        input: toolCalls.map((call, index) => ({
          type: "function_call_output",
          call_id: call.callId,
          output: JSON.stringify(toolResults[index]?.output ?? {}),
        })),
      });

      if (secondResponse) {
        const finalMessage = extractAssistantMessage(secondResponse);
        if (finalMessage) {
          message = finalMessage;
        }
      }
    }

    return NextResponse.json({
      message:
        message ||
        "I can map your 30-day action plan. Tell me your industry, monthly revenue, monthly leads, and biggest blocker.",
      leadCaptured,
      toolResults,
    });
  } catch (error) {
    console.error("[api/chat] error", error);

    return NextResponse.json(
      {
        message:
          "I hit a temporary issue. Tell me your industry, monthly revenue, and biggest blocker, and I will map the next best move.",
      },
      { status: 200 },
    );
  }
}
