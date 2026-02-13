import { NextResponse } from "next/server";

import { createBooking, getAvailability, getUpcomingDates, isDateFormat } from "@/lib/bookings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    const dates = getUpcomingDates(21);
    return NextResponse.json({
      dates,
    });
  }

  if (!isDateFormat(date)) {
    return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
  }

  const times = await getAvailability(date);
  return NextResponse.json({
    date,
    times,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      date: string;
      time: string;
      name: string;
      email: string;
      phone: string;
      company: string;
      website?: string;
      industry?: string;
      goals?: string;
    };

    const booking = await createBooking(body);

    console.info("[booking] sendgrid-placeholder", {
      to: booking.email,
      bookingId: booking.id,
    });

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create booking.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
