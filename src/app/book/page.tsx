import { CalendarClock, ClipboardList, Rocket } from "lucide-react";

import { LeadCaptureForm } from "@/components/shared/lead-capture-form";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Book a Strategy Session | Digital Business Assets",
  description:
    "Book a strategy call with Digital Business Assets to map your website, automation, and lead conversion priorities.",
  path: "/book",
});

const processSteps = [
  {
    icon: ClipboardList,
    title: "Audit",
    description: "We review your website, lead sources, and follow-up process before the call.",
  },
  {
    icon: CalendarClock,
    title: "Strategy Session",
    description: "You get a practical scope focused on quick wins and rollout sequence.",
  },
  {
    icon: Rocket,
    title: "Execution",
    description: "We launch the first build phase and track conversion impact from day one.",
  },
];

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book"
        title="Book your strategy session"
        description="If you want a concrete growth plan instead of generic advice, this is the fastest way to start."
      />

      <Section className="py-8 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <Card key={step.title} className="border-slate-800 bg-slate-900/35">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <span className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 p-2">
                        <step.icon className="size-4 text-cyan-300" />
                      </span>
                      {index + 1}. {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/35 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">Share your details to book</h2>
              <p className="mt-2 text-sm text-slate-300">
                We will follow up with times and a prep checklist for your strategy call.
              </p>
              <LeadCaptureForm className="mt-6" />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
