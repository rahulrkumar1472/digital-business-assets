import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  label: string;
  className?: string;
};

export function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-800 bg-[linear-gradient(145deg,rgba(56,189,248,0.18),rgba(15,23,42,0.95))]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.22),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(14,116,144,0.24),transparent_46%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative flex h-full items-center justify-center px-4 text-center text-xs font-semibold tracking-[0.12em] text-cyan-200 uppercase">
        {label}
      </div>
    </div>
  );
}
