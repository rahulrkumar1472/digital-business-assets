import { NextResponse } from "next/server";

import { getUserSession } from "@/lib/auth/session";
import { createBespokePlanRequest } from "@/lib/bespoke-plan/repository";
import { submitLead } from "@/lib/lead";

const validTracks = new Set(["track1", "track2", "unknown"]);
const validContactMethods = new Set(["book-call", "message"]);

type SelectedModule = {
  slug: string;
  title: string;
  price?: string;
};

function clean(value: unknown, max = 220) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const session = await getUserSession();

    const name = clean(payload.name, 120);
    const email = clean(payload.email, 180).toLowerCase();
    const phone = clean(payload.phone, 40);
    const company = clean(payload.company, 140);
    const website = clean(payload.website, 200) || undefined;
    const industry = clean(payload.industry, 120) || undefined;
    const trackRaw = clean(payload.track, 20);
    const track = validTracks.has(trackRaw) ? (trackRaw as "track1" | "track2" | "unknown") : "unknown";
    const monthlyRevenueRange = clean(payload.monthlyRevenueRange, 120) || undefined;
    const leadVolumeRange = clean(payload.leadVolumeRange, 120) || undefined;
    const biggestBlocker = clean(payload.biggestBlocker, 300);
    const preferredContactRaw = clean(payload.preferredContact, 30);
    const preferredContact = validContactMethods.has(preferredContactRaw)
      ? (preferredContactRaw as "book-call" | "message")
      : "book-call";
    const notes = clean(payload.notes, 2000) || undefined;

    const selectedModules: SelectedModule[] = Array.isArray(payload.selectedModules)
      ? payload.selectedModules
          .map((entry): SelectedModule | null => {
            if (!entry || typeof entry !== "object") {
              return null;
            }
            const item = entry as Record<string, unknown>;
            const slug = clean(item.slug, 120);
            const title = clean(item.title, 160);
            const price = clean(item.price, 80);
            if (!slug || !title) {
              return null;
            }
            return { slug, title, price: price || undefined };
          })
          .filter((entry): entry is SelectedModule => entry !== null)
      : [];

    if (!name || !email || !phone || !company || !biggestBlocker) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const created = await createBespokePlanRequest({
      userId: session?.userId,
      name,
      email,
      phone,
      company,
      website,
      industry,
      track,
      monthlyRevenueRange,
      leadVolumeRange,
      biggestBlocker,
      preferredContact,
      notes,
      selectedModules,
    });

    await submitLead({
      name,
      email,
      phone,
      company,
      website,
      industry,
      message: `Bespoke plan request. Track=${track}. Blocker=${biggestBlocker}. Preferred contact=${preferredContact}.`,
      source: "bespoke-plan",
      meta: {
        requestId: created.id,
        selectedModules: selectedModules.length,
      },
    });

    return NextResponse.json({
      success: true,
      requestId: created.id,
      nextUrl: `/thanks?track=${track}`,
    });
  } catch (error) {
    console.error("[api/bespoke-plan] error", error);
    return NextResponse.json({ success: false, message: "Could not submit bespoke plan." }, { status: 500 });
  }
}
