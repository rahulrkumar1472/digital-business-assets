"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { clearCart, removeModuleFromCart, usePlanCart } from "@/lib/cart/cart-store";

type CartDrawerProps = {
  trigger: React.ReactNode;
};

export function CartDrawer({ trigger }: CartDrawerProps) {
  const { items } = usePlanCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="border-slate-800 bg-slate-950 text-slate-100">
        <SheetHeader>
          <SheetTitle>Your Bespoke Plan</SheetTitle>
          <SheetDescription className="text-slate-400">
            Selected modules move into your bespoke plan form.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 flex h-[calc(100%-7.5rem)] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <p className="rounded-lg border border-slate-800 bg-slate-900/55 px-3 py-3 text-sm text-slate-300">
                No modules selected yet. Add services from homepage or service pages.
              </p>
            ) : null}

            {items.map((item) => (
              <div key={item.slug} className="rounded-xl border border-slate-800 bg-slate-900/55 p-3">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-cyan-200">{item.price}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Link href={`/services/${item.slug}`} className="text-xs text-cyan-300 hover:text-cyan-200">
                    View service
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeModuleFromCart(item.slug)}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-300"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3 border-t border-slate-800 pt-4">
            <Button asChild className="w-full">
              <Link href="/bespoke-plan">Continue → Bespoke Plan</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800"
              onClick={() => clearCart()}
            >
              Clear selection
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

