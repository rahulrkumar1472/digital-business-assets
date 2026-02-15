import { buildMetadata } from "@/lib/seo";
import { listBookings } from "@/lib/bookings";

export const metadata = buildMetadata({ path: "/admin/bookings" });

export default async function AdminBookingsPage() {
  const bookings = await listBookings();

  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold text-white md:text-4xl">Booking Admin</h2>
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
    </section>
  );
}
