import Link from "next/link";

import { FinalCTA } from "@/components/marketing/final-cta";
import { MotionReveal } from "@/components/marketing/motion-reveal";
import { SectionBlock } from "@/components/marketing/section-block";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/book/confirmation" });

type ConfirmationPageProps = {
  searchParams: Promise<{
    id?: string;
    date?: string;
    time?: string;
    name?: string;
    email?: string;
    industry?: string;
    score?: string;
  }>;
};

export default async function BookingConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams;

  return (
    <>
      <SectionBlock className="pt-20 md:pt-24">
        <MotionReveal className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/45 p-8 text-center md:p-10">
          <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">Booking confirmed</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Your strategy session is scheduled</h1>
          <p className="mt-4 text-sm text-slate-300 md:text-base">
            We have received your booking details. Keep this summary for reference.
          </p>

          <div className="mt-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/65 p-5 text-left text-sm text-slate-200">
            <p><span className="text-slate-400">Booking ID:</span> {params.id || "Pending"}</p>
            <p><span className="text-slate-400">Name:</span> {params.name || "Not provided"}</p>
            <p><span className="text-slate-400">Email:</span> {params.email || "Not provided"}</p>
            <p><span className="text-slate-400">Date:</span> {params.date || "Not provided"}</p>
            <p><span className="text-slate-400">Time:</span> {params.time || "Not provided"}</p>
            {params.industry ? <p><span className="text-slate-400">Industry:</span> {params.industry}</p> : null}
            {params.score ? <p><span className="text-slate-400">Simulator Score:</span> {params.score}</p> : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
              <Link href="/services">Review Service Modules</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-900/45 text-slate-100 hover:bg-slate-800">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </MotionReveal>
      </SectionBlock>

      <SectionBlock className="pt-2 pb-20">
        <FinalCTA
          title="Want to prepare before the call?"
          description="Run the simulator again with another scenario and bring both outputs to your session."
        />
      </SectionBlock>
    </>
  );
}
