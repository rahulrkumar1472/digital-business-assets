"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";

import { CartButton } from "@/components/cart/cart-button";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useFunnelTrack } from "@/components/funnel/funnel-provider";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { trackEvent } from "@/lib/analytics";
import { setStoredTrack } from "@/lib/funnel/store";

const startHereLinks = [
  { label: "Track 1: Get Online in 72 Hours", href: "/services/website-starter-build", track: "track1" as const },
  { label: "Track 2: Start Free Website Scan", href: "/tools/website-audit/start", track: "track2" as const },
];

const mainLinks = [
  { label: "Services", href: "/services" },
  { label: "Tools", href: "/tools" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { track } = useFunnelTrack();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${
        scrolled
          ? "border-slate-800/80 bg-slate-950/88 backdrop-blur-xl"
          : "border-slate-800/45 bg-slate-950/45 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="rounded-lg border border-cyan-500/45 bg-cyan-500/15 px-2 py-1 text-[11px] font-semibold tracking-[0.15em] text-cyan-300 uppercase">
            DBA
          </span>
          <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
            Digital Business Assets
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 border border-slate-700 bg-slate-900/55 text-sm text-slate-100 hover:bg-slate-800 data-[state=open]:bg-slate-800">
                  Start Here
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[290px] border border-slate-700 bg-slate-950 p-2">
                  <div className="space-y-1">
                    {startHereLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setStoredTrack(item.track)}
                        className="block rounded-md border border-slate-800 bg-slate-900/55 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-500/35 hover:text-cyan-100"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <nav className="flex items-center gap-5">
            {mainLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 transition-colors hover:text-cyan-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <CartDrawer trigger={<CartButton onClick={() => undefined} />} />
          <Link href="/login" className="rounded-lg px-2.5 py-1.5 text-sm text-slate-300 hover:text-cyan-100">
            Login
          </Link>
          <Link href="/signup" className="rounded-lg px-2.5 py-1.5 text-sm text-slate-300 hover:text-cyan-100">
            Sign Up
          </Link>
          <Button
            asChild
            size="lg"
            onClick={() =>
              trackEvent("hero_cta_click", {
                source: "header_primary",
                track,
                destination: "/bespoke-plan",
              })
            }
          >
            <Link href="/bespoke-plan">Create Your Bespoke Plan</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CartDrawer trigger={<CartButton onClick={() => undefined} className="h-9 px-3" />} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-slate-700 bg-slate-900/50 text-slate-100">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-slate-800 bg-slate-950 text-slate-100" side="right">
              <SheetHeader>
                <SheetTitle>Digital Business Assets</SheetTitle>
                <SheetDescription className="text-slate-400">
                  Pick your track and deploy your Business OS.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5 px-4">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">
                    Start here
                  </p>
                  <div className="space-y-2">
                    {startHereLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setStoredTrack(item.track)}
                        className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/55 px-3 py-2 text-sm text-slate-200"
                      >
                        {item.label}
                        <ChevronDown className="size-3.5 -rotate-90 text-cyan-300" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">Explore</p>
                  <div className="space-y-2">
                    {mainLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-lg border border-slate-800 bg-slate-900/55 px-3 py-2 text-sm text-slate-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/login" className="block rounded-lg border border-slate-800 bg-slate-900/55 px-3 py-2 text-sm text-slate-200">
                    Login
                  </Link>
                  <Link href="/signup" className="block rounded-lg border border-slate-800 bg-slate-900/55 px-3 py-2 text-sm text-slate-200">
                    Sign Up
                  </Link>
                </div>

                <Button asChild className="w-full">
                  <Link href="/bespoke-plan">Create Your Bespoke Plan</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

