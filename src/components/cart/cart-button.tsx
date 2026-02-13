"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePlanCart } from "@/lib/cart/cart-store";

type CartButtonProps = {
  onClick: () => void;
  className?: string;
};

export function CartButton({ onClick, className }: CartButtonProps) {
  const { count } = usePlanCart();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`relative border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800 ${className || ""}`}
    >
      <ShoppingCart className="size-4" />
      <span>Plan</span>
      {count > 0 ? (
        <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-cyan-400/20 px-1.5 py-0.5 text-[11px] font-semibold text-cyan-100">
          {count}
        </span>
      ) : null}
    </Button>
  );
}

