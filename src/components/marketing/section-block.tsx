import { cn } from "@/lib/utils";

type SectionBlockProps = {
  id?: string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export function SectionBlock({
  id,
  className,
  contentClassName,
  children,
}: SectionBlockProps) {
  return (
    <section id={id} className={cn("relative overflow-x-clip py-20 md:py-28", className)}>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(56,189,248,0.38),transparent)] lg:inset-x-8" />
      <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.2),transparent)]" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-20 w-[78%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(56,189,248,0.12),transparent_72%)]" />
      <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", contentClassName)}>{children}</div>
    </section>
  );
}
