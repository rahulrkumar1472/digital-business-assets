"use client";

import { SunMoon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDarkAfterToggle = root.classList.toggle("dark");

    localStorage.setItem("theme", isDarkAfterToggle ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="border-slate-700 bg-slate-950/20 text-slate-100 hover:bg-slate-800"
    >
      <SunMoon className="size-4" />
    </Button>
  );
}
