import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-sm text-slate-300">
        The page may have moved or the URL might be incorrect.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline" className="border-slate-700 bg-slate-900/35 text-slate-100 hover:bg-slate-800">
          <Link href="/services">View services</Link>
        </Button>
      </div>
    </div>
  );
}
