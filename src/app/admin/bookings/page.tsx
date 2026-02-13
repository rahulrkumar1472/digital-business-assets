import { ShieldAlert } from "lucide-react";

import { SectionBlock } from "@/components/marketing/section-block";
import { buildMetadata } from "@/lib/seo";
import { listBookings } from "@/lib/bookings";

export const metadata = buildMetadata({ path: "/admin/bookings" });

type AdminBookingsPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  const params = await searchParams;
  const token = params.token || "";
  const adminToken = process.env.ADMIN_TOKEN || "";

  if (!adminToken || token !== adminToken) {
    return (
      <SectionBlock className="pt-24 pb-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/35 bg-red-500/10 p-6 text-red-100">
          <p className="inline-flex items-center gap-2 text-lg font-semibold">
            <ShieldAlert className="size-5" />
            Unauthorized
          </p>
          <p className="mt-2 text-sm text-red-200">Add your admin token as a query parameter: <code>?token=YOUR_ADMIN_TOKEN</code></p>
        </div>
      </SectionBlock>
    );
  }

  const bookings = await listBookings();

  return (
    <SectionBlock className="pt-20 pb-20">
      <h1 className="text-4xl font-semibold text-white md:text-5xl">Booking Admin</h1>
      <p className="mt-3 text-sm text-slate-300">Total bookings: {bookings.length}</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/45">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-950/70 text-xs tracking-[0.08em] text-slate-400 uppercase">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Industry</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-slate-800/80">
                <td className="px-4 py-3">{booking.date}</td>
                <td className="px-4 py-3">{booking.time}</td>
                <td className="px-4 py-3">{booking.name}</td>
                <td className="px-4 py-3">{booking.company}</td>
                <td className="px-4 py-3">{booking.email}</td>
                <td className="px-4 py-3">{booking.phone}</td>
                <td className="px-4 py-3">{booking.industry || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        API export: send <code>x-admin-token</code> header to <code>/api/admin/bookings</code> or use <code>?format=csv</code>.
      </p>
    </SectionBlock>
  );
}
