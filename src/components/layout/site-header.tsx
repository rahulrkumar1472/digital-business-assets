"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { BuildPlanDialogButton } from "@/components/shared/build-plan-dialog-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { primaryNavigation } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/75 backdrop-blur">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-2 py-1 text-xs font-bold tracking-wider text-cyan-300 uppercase">
            DBA
          </span>
          <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
            Digital Business Assets
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition-colors hover:text-cyan-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <BuildPlanDialogButton size="default" className="h-9" />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-slate-700 bg-slate-900/40 text-slate-100">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-slate-800 bg-slate-950 text-slate-100" side="right">
              <SheetHeader>
                <SheetTitle>Digital Business Assets</SheetTitle>
                <SheetDescription className="text-slate-400">
                  Conversion systems for UK businesses.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-3 px-4">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-200"
                  >
                    {item.label}
                  </Link>
                ))}
                <BuildPlanDialogButton size="default" className="mt-3 w-full" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
