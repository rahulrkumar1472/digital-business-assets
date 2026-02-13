import { CheckCircle2 } from "lucide-react";

import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About | Digital Business Assets",
  description:
    "Meet Digital Business Assets, an AI-first digital agency building websites and growth systems for UK SMEs.",
  path: "/about",
});

const values = [
  {
    title: "Speed with accountability",
    detail:
      "We ship quickly, but every build includes tracking, QA, and clear ownership so outcomes stay measurable.",
  },
  {
    title: "Systems over one-off projects",
    detail:
      "We design connected workflows that reduce manual effort and keep delivering value after launch.",
  },
  {
    title: "Commercial focus",
    detail:
      "Every decision maps to lead quality, response time, conversion rate, or customer retention.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We build digital systems that make growth repeatable"
        description="Digital Business Assets is an AI-first agency built for UK SMEs that need practical execution, not endless strategy decks."
      />

      <Section className="py-8 md:py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.06}>
              <Card className="h-full border-slate-800 bg-slate-900/35">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-300">{value.detail}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-14 md:py-18">
        <Reveal>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/35 p-8 md:p-10">
            <h2 className="text-3xl font-semibold text-white">What working with us looks like</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {[
                "Rapid discovery focused on revenue blockers",
                "Production build with clear milestones and QA",
                "Automation and analytics deployment",
                "Monthly optimisation based on real conversion data",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      <CtaBanner
        title="Want to work with a team that ships fast and clean?"
        description="Tell us your current bottlenecks and we will map a practical roadmap to launch and scale."
      />
    </>
  );
}
