"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

type PdfPrintActionsProps = {
  backHref: string;
};

export function PdfPrintActions({ backHref }: PdfPrintActionsProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <div className="text-sm text-slate-300">Printable view. Use your browser print dialog and choose &quot;Save as PDF&quot;.</div>
      <div className="flex items-center gap-2">
        <Button type="button" onClick={() => window.print()}>
          Download PDF
        </Button>
        <Button asChild variant="outline" className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800">
          <Link href={backHref}>Back to report</Link>
        </Button>
      </div>
    </div>
  );
}
