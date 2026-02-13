import Link from "next/link";

import { legalNavigation, primaryNavigation, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 py-14">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Digital Business Assets</h3>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            Done-for-you AI revenue systems for UK SMEs. We build websites, automations, chatbots, CRM flows, and
            reporting that convert consistently.
          </p>
          <p className="text-xs font-medium tracking-[0.08em] text-cyan-300 uppercase">From £99/month</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">Navigation</p>
          <ul className="mt-3 space-y-2">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="text-sm text-slate-300 transition-colors hover:text-cyan-200">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-slate-300 transition-colors hover:text-cyan-200">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">Contact</p>
          <p className="mt-3 text-sm text-slate-300">
            <a className="hover:text-cyan-200" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            <br />
            {siteConfig.phone}
          </p>

          <p className="mt-6 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">Legal</p>
          <ul className="mt-3 space-y-2">
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-7xl border-t border-slate-800/80 px-6 pt-6 text-xs text-slate-500 lg:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.legalName}. Revenue systems. Not marketing fluff.
        </p>
      </div>
    </footer>
  );
}
