import Link from "next/link";

import { legalNavigation, primaryNavigation, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/70 bg-slate-950/70 py-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Digital Business Assets</h3>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            We design websites, automation, and AI systems that help UK SMEs capture more leads and close faster.
          </p>
          <p className="text-xs text-slate-400">From £99/month. Built for recurring growth.</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">Navigation</p>
          <ul className="mt-3 space-y-2">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-slate-300 hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">Legal</p>
          <ul className="mt-3 space-y-2">
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-slate-300 hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            <a className="hover:text-cyan-200" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            <br />
            {siteConfig.phone}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-7xl border-t border-slate-800/70 px-6 pt-6 text-xs text-slate-500 lg:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
