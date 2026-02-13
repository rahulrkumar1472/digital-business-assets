import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  children,
}: PageHeroProps) {
  return (
    <section className={cn("pt-20 pb-12 md:pt-28 md:pb-16", className)}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl space-y-5">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">{eyebrow}</p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">{description}</p>
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
