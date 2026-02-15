"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/admin/auth/logout", { method: "POST" });
          window.location.reload();
        })
      }
    >
      <LogOut className="size-4" />
      {pending ? "Logging out..." : "Logout"}
    </Button>
  );
}
