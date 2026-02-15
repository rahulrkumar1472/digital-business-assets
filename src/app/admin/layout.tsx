import Link from "next/link";

import { AdminGate } from "@/components/admin/admin-gate";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { SectionBlock } from "@/components/marketing/section-block";
import { isAdminAuthenticated, isAdminPasswordConfigured } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isAdminPasswordConfigured();
  const authenticated = configured ? await isAdminAuthenticated() : false;

  if (!authenticated) {
    return (
      <SectionBlock className="pt-24 pb-20">
        <AdminGate passwordConfigured={configured} />
      </SectionBlock>
    );
  }

  return (
    <SectionBlock className="pt-20 pb-20">
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">Admin</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Lead Vault</h1>
              <p className="mt-2 text-sm text-slate-300">
                Operator dashboard for captured leads, audit runs, simulator runs, and timeline events.
              </p>
            </div>
            <AdminLogoutButton />
          </div>

          <nav className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link
              href="/admin/leads"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
            >
              Leads
            </Link>
            <Link
              href="/admin/analytics"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
            >
              Analytics
            </Link>
            <Link
              href="/admin/bookings"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
            >
              Bookings
            </Link>
          </nav>
        </header>

        {children}
      </div>
    </SectionBlock>
  );
}
