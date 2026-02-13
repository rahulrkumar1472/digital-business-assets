import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, PhoneMissed, Zap } from "lucide-react";

import { CaseStudyCard } from "@/components/shared/case-study-card";
import { CtaActions } from "@/components/shared/cta-actions";
import { CtaBanner } from "@/components/shared/cta-banner";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/shared/service-card";
import { TypewriterHeadline } from "@/components/shared/typewriter-headline";
import { VideoEmbed } from "@/components/shared/video-embed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { caseStudies, generalFaqs, services } from "@/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Digital Business Assets | AI-First Digital Agency for UK SMEs",
  description:
    "Launch websites in 72 hours, deploy AI chatbots, and automate lead follow-up. Built for UK businesses from £99/month.",
  path: "/",
});

const rotatingHeadlines = [
  "Need a website live in 72 hours?",
  "Ready for AI transformation?",
  "Want more leads without hiring staff?",
  "We build chatbots that sell 24/7.",
  "Automations that chase leads instantly.",
];

const problemSignals = [
  {
    icon: PhoneMissed,
    title: "Missed calls, missed revenue",
    description: "Capture every enquiry with 24/7 call and chatbot systems.",
  },
  {
    icon: Clock3,
    title: "Slow follow-up",
    description: "Automate reminders and task routing so leads do not go cold.",
  },
  {
    icon: Zap,
    title: "No connected systems",
    description: "Website, CRM, bookings, and automation all working as one flow.",
  },
];

export default function HomePage() {
  return (
    <>
      <Section className="pt-18 pb-12 md:pt-24 md:pb-18">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="space-y-8">
            <Badge className="rounded-full border-cyan-400/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/10">
              AI-First Growth Systems for UK SMEs
            </Badge>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
                Stop leaking leads. Build a growth engine from £99/month.
              </h1>
              <TypewriterHeadline lines={rotatingHeadlines} />
              <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
                We fix the bottlenecks blocking your revenue: weak websites, missed calls, no booking flow,
                disconnected CRM, and manual follow-up. Then we build the system that scales.
              </p>
            </div>
            <CtaActions />
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Launch speed", value: "72 hours" },
                { label: "Entry offer", value: "From £99/mo" },
                { label: "Coverage", value: "UK-wide" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/45 p-4">
                  <p className="text-xs font-medium tracking-[0.09em] text-slate-400 uppercase">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/35 p-3 shadow-[0_36px_80px_rgba(2,6,23,0.55)] backdrop-blur">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/hero.jpg"
                  alt="Digital Business Assets hero visual"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <div className="absolute right-6 bottom-6 left-6 rounded-xl border border-cyan-400/30 bg-slate-950/75 p-4">
                <p className="text-sm font-semibold text-cyan-200">Built for owners who need results, not busywork.</p>
                <p className="mt-1 text-xs text-slate-300">
                  Websites, CRM, automations, and AI systems delivered as one production stack.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="py-12">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {problemSignals.map((signal) => (
              <Card key={signal.title} className="border-slate-800 bg-slate-900/35 backdrop-blur">
                <CardHeader className="space-y-3">
                  <div className="w-fit rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-2.5">
                    <signal.icon className="size-5 text-cyan-300" />
                  </div>
                  <CardTitle className="text-xl text-white">{signal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-300">{signal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section id="services" className="py-18 md:py-22">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Everything your growth stack needs, under one team"
            description="Every service is built to solve commercial friction: no leads, weak conversion, delayed follow-up, and poor pipeline visibility."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.05}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-18 md:py-22">
        <Reveal>
          <SectionHeading
            eyebrow="Operating Model"
            title="How we build recurring growth outcomes"
            description="Each phase is designed for speed-to-value. We prioritise launch velocity, conversion quality, and repeatable operations."
          />
          <Tabs defaultValue="attract" className="mt-10">
            <TabsList variant="line" className="mb-6">
              <TabsTrigger value="attract">Attract</TabsTrigger>
              <TabsTrigger value="convert">Convert</TabsTrigger>
              <TabsTrigger value="retain">Retain</TabsTrigger>
            </TabsList>
            <TabsContent value="attract" className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6">
              <h3 className="text-2xl font-semibold text-white">Be visible where intent starts</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                We combine technical SEO, AEO structure, and fast-loading pages so buyers can find you in both
                search engines and AI assistants.
              </p>
            </TabsContent>
            <TabsContent value="convert" className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6">
              <h3 className="text-2xl font-semibold text-white">Convert interest into booked conversations</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                We deploy lead forms, booking flows, chatbots, and call-answering logic that qualifies prospects and
                routes them instantly.
              </p>
            </TabsContent>
            <TabsContent value="retain" className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6">
              <h3 className="text-2xl font-semibold text-white">Keep customers moving through your pipeline</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                Automated reminders, CRM workflows, and follow-up sequences reduce no-shows, increase close rates,
                and improve repeat revenue.
              </p>
            </TabsContent>
          </Tabs>
        </Reveal>
      </Section>

      <Section id="video" className="py-18 md:py-22">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Inside the Build"
              title="Show your process with a video walkthrough"
              description="Use this section to embed a client walkthrough, founder video, or process demo. Paste any YouTube or Vimeo URL to preview."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Explain your offer in plain language",
                "Build trust with real delivery examples",
                "Reduce buyer objections before sales calls",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6">
              <VideoEmbed defaultUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="py-18 md:py-22">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Proof"
            title="Recent outcomes for UK businesses"
            description="Real implementation work tied to measurable pipeline and conversion impact."
          />
          <Button asChild variant="outline" className="border-slate-700 bg-slate-900/30 text-slate-100 hover:bg-slate-800">
            <Link href="/case-studies">
              View all case studies
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {caseStudies.slice(0, 2).map((caseStudy, index) => (
            <Reveal key={caseStudy.slug} delay={index * 0.07}>
              <CaseStudyCard caseStudy={caseStudy} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-18 md:py-22">
        <Reveal>
          <SectionHeading
            eyebrow="FAQs"
            title="Common questions before we start"
            description="If you are moving fast and need execution certainty, these are the answers most owners ask for first."
          />
          <div className="mt-8">
            <FaqAccordion items={generalFaqs} />
          </div>
        </Reveal>
      </Section>

      <CtaBanner
        title="Want a custom growth build plan this week?"
        description="Share your current funnel and we will map the fastest route to more qualified leads, better follow-up, and recurring revenue."
      />

      <Section className="pt-0 pb-20">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-5 text-sm text-slate-300 md:p-6">
          <p className="font-semibold text-white">Why this approach</p>
          <ul className="mt-3 space-y-2">
            <li>We prioritise speed-to-launch so value appears in days, not months.</li>
            <li>Each feature maps to a business problem: lead capture, response speed, conversion, retention.</li>
            <li>The stack is modular, so your team can scale or delegate without replatforming.</li>
          </ul>
        </div>
      </Section>
    </>
  );
}
