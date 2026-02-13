"use client";

import { useEffect, useSyncExternalStore } from "react";

export type PlanModuleItem = {
  slug: string;
  title: string;
  price: string;
};

const cartStorageKey = "dba_plan_cart";
const listeners = new Set<() => void>();
const emptyServerSnapshot: PlanModuleItem[] = [];
let cachedItems: PlanModuleItem[] = [];
let hasHydratedCache = false;

function notify() {
  listeners.forEach((listener) => listener());
}

function parseItems(raw: string | null): PlanModuleItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => {
        const item = entry as Record<string, unknown>;
        return {
          slug: typeof item.slug === "string" ? item.slug : "",
          title: typeof item.title === "string" ? item.title : "",
          price: typeof item.price === "string" ? item.price : "",
        };
      })
      .filter((item) => item.slug && item.title);
  } catch {
    return [];
  }
}

export function getCartItems(): PlanModuleItem[] {
  if (typeof window === "undefined") {
    return emptyServerSnapshot;
  }
  if (!hasHydratedCache) {
    cachedItems = parseItems(window.localStorage.getItem(cartStorageKey));
    hasHydratedCache = true;
  }
  return cachedItems;
}

function setCartItems(items: PlanModuleItem[]) {
  if (typeof window === "undefined") {
    return;
  }
  cachedItems = items;
  hasHydratedCache = true;
  window.localStorage.setItem(cartStorageKey, JSON.stringify(cachedItems));
  notify();
}

export function addModuleToCart(item: PlanModuleItem) {
  const existing = getCartItems();
  if (existing.some((entry) => entry.slug === item.slug)) {
    return;
  }
  setCartItems([...existing, item]);
}

export function removeModuleFromCart(slug: string) {
  const next = getCartItems().filter((item) => item.slug !== slug);
  setCartItems(next);
}

export function clearCart() {
  setCartItems([]);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return getCartItems();
}

function getServerSnapshot() {
  return emptyServerSnapshot;
}

export function usePlanCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === cartStorageKey) {
        cachedItems = parseItems(event.newValue);
        hasHydratedCache = true;
        notify();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    items,
    count: items.length,
  };
}
