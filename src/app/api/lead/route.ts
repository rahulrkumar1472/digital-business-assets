import { NextResponse } from "next/server";

import { normalizeLeadPayload, submitLead, validateLeadPayload } from "@/lib/lead";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = normalizeLeadPayload(body);
    const requireMessage = lead.source !== "chatbot";
    const validation = validateLeadPayload(lead, requireMessage);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your details and try again.",
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    const result = await submitLead({
      ...lead,
      source: lead.source || "website-form",
    });

    return NextResponse.json({
      success: result.success,
      crmForwarded: result.crmForwarded,
      message: result.message,
    });
  } catch (error) {
    console.error("[api/lead] error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Could not process lead submission.",
      },
      { status: 500 },
    );
  }
}
