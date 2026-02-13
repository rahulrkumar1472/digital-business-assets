import Link from "next/link";

const dashboardNav = [
  { label: "Overview", href: "/app" },
  { label: "Reports", href: "/app/reports" },
  { label: "Leads", href: "/app/leads" },
  { label: "AI Employees", href: "/app/employees" },
  { label: "Simulator", href: "/app/simulator" },
  { label: "Settings", href: "/app/settings" },
] as const;

export default function BusinessOsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pt-20 pb-20 md:px-6 lg:grid-cols-[250px_1fr] lg:pt-24 lg:px-8">
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4 backdrop-blur">
        <p className="text-xs font-semibold tracking-[0.14em] text-cyan-300 uppercase">Business OS</p>
        <p className="mt-2 text-lg font-semibold text-white">Operating console</p>
        <p className="mt-1 text-xs text-slate-400">Track scans, leads, modules, and growth execution.</p>

        <nav className="mt-5 space-y-2">
          {dashboardNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg border border-slate-800 bg-slate-950/55 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-500/35 hover:text-cyan-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
