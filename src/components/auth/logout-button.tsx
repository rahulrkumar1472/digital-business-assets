"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="mt-4 w-full border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800"
      onClick={logout}
    >
      Log out
    </Button>
  );
}

