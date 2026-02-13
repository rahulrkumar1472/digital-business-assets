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
    <section id={id} className={cn("relative py-16 md:py-24", className)}>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(56,189,248,0.25),transparent)] lg:inset-x-8" />
      <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", contentClassName)}>{children}</div>
    </section>
  );
}
