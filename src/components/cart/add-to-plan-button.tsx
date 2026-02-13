"use client";

import { useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addModuleToCart, usePlanCart } from "@/lib/cart/cart-store";

type AddToPlanButtonProps = {
  slug: string;
  title: string;
  price: string;
  className?: string;
};

export function AddToPlanButton({ slug, title, price, className }: AddToPlanButtonProps) {
  const { items } = usePlanCart();
  const [addedTick, setAddedTick] = useState(false);
  const isAdded = useMemo(() => items.some((item) => item.slug === slug), [items, slug]);

  const onAdd = () => {
    addModuleToCart({ slug, title, price });
    setAddedTick(true);
    window.setTimeout(() => setAddedTick(false), 1200);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isAdded}
      className={`border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800 ${className || ""}`}
      onClick={onAdd}
    >
      {isAdded || addedTick ? <Check className="size-4 text-cyan-200" /> : <Plus className="size-4" />}
      {isAdded ? "Added to Plan" : "Add to Plan"}
    </Button>
  );
}

