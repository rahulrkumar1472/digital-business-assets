import { BadgeCheck, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

type AuditTrustStripProps = {
  compact?: boolean;
};

export function AuditTrustStrip({ compact = false }: AuditTrustStripProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4">
      <div className={`grid gap-2 text-xs ${compact ? "md:grid-cols-2" : "md:grid-cols-4"}`}>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">
          <BadgeCheck className="size-4 text-cyan-300" />
          Built for UK business owners
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">
          <BarChart3 className="size-4 text-cyan-300" />
          Designed to increase bookings
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">
          <ShieldCheck className="size-4 text-cyan-300" />
          No spam - report optional email
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">
          <Sparkles className="size-4 text-cyan-300" />
          Implementation available (Track 1)
        </div>
      </div>
    </div>
  );
}
