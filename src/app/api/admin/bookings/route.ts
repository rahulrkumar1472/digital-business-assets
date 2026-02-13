import { NextResponse } from "next/server";

import { listBookings, toCsv } from "@/lib/bookings";

function isAuthorized(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return false;
  }

  const headerToken = request.headers.get("x-admin-token");
  const auth = request.headers.get("authorization");
  const bearerToken = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  return headerToken === adminToken || bearerToken === adminToken;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await listBookings();
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  if (format === "csv") {
    return new NextResponse(toCsv(bookings), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=bookings-export.csv",
      },
    });
  }

  return NextResponse.json({
    count: bookings.length,
    bookings,
  });
}
