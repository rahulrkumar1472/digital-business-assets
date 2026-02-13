import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/thanks" });

type ThanksPageProps = {
  searchParams: Promise<{ track?: string }>;
};

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const params = await searchParams;
  const track = params.track === "track2" ? "track2" : params.track === "track1" ? "track1" : "unknown";

  const primaryHref =
    track === "track2" ? "/tools/website-audit/start" : track === "track1" ? "/services/website-starter-build" : "/bespoke-plan";
  const primaryLabel =
    track === "track2"
      ? "Run Website Audit"
      : track === "track1"
        ? "See Starter Build"
        : "Back to Bespoke Plan";

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-cyan-300 uppercase">Thank you</p>
        <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl">Your bespoke plan request is in</h1>
        <p className="mt-3 text-sm text-slate-300">
          We&apos;ll review your details and map your next deployment actions.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-700 bg-slate-900/55 text-slate-100 hover:bg-slate-800">
            <Link href="/book">Book Strategy Call</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

