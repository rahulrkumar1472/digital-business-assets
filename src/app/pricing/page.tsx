import { CheckCircle2 } from "lucide-react";

import { CtaActions } from "@/components/shared/cta-actions";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing | Digital Business Assets",
  description:
    "Flexible monthly growth plans from £99/month for websites, automation, SEO/AEO, AI chatbots, and CRM systems.",
  path: "/pricing",
});

const plans = [
  {
    name: "Launch",
    price: "From £99/month",
    description: "For businesses needing a fast, conversion-focused online presence.",
    features: [
      "Website launch sprint",
      "Core conversion pages and form setup",
      "Technical SEO baseline",
      "Monthly support and updates",
    ],
  },
  {
    name: "Scale",
    price: "From £299/month",
    description: "For teams ready to automate follow-up and increase qualified leads.",
    features: [
      "Everything in Launch",
      "CRM pipeline setup and booking flows",
      "Lead reminder automation",
      "Monthly growth reporting",
    ],
  },
  {
    name: "AI Growth",
    price: "From £599/month",
    description: "For businesses scaling with AI chat, workflows, and 24/7 response systems.",
    features: [
      "Everything in Scale",
      "AI chatbot implementation",
      "Advanced workflow automation",
      "24/7 call-answering integration",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Straightforward monthly plans, built to grow with your business"
        description="Start with the highest-impact build from £99/month, then add automation and AI capabilities as your pipeline scales."
      >
        <CtaActions secondaryHref="/book" secondaryLabel="Book a pricing call" />
      </PageHero>

      <Section className="py-8 md:py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.05}>
              <Card className="h-full border-slate-800 bg-slate-900/35">
                <CardHeader className="space-y-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase">{plan.name}</p>
                  <CardTitle className="text-3xl text-white">{plan.price}</CardTitle>
                  <p className="text-sm text-slate-300">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-14 md:py-18">
        <Reveal>
          <h2 className="text-3xl font-semibold text-white">Scope examples by objective</h2>
          <Tabs defaultValue="lead-generation" className="mt-8">
            <TabsList variant="line" className="mb-6">
              <TabsTrigger value="lead-generation">Lead generation</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="ai">AI enablement</TabsTrigger>
            </TabsList>
            <TabsContent value="lead-generation" className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Typical stack: Website in 72 hours + SEO/AEO baseline + lead capture workflow. Best for businesses with
                inconsistent enquiries and poor conversion pages.
              </p>
            </TabsContent>
            <TabsContent value="operations" className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Typical stack: CRM setup + booking + reminder automations + workflow handoffs. Best for businesses with
                dropped follow-up and manual admin overhead.
              </p>
            </TabsContent>
            <TabsContent value="ai" className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Typical stack: AI chatbot + call-answering + pipeline automation + optimisation reporting. Best for teams
                that need instant first response without extra headcount.
              </p>
            </TabsContent>
          </Tabs>
        </Reveal>
      </Section>

      <CtaBanner
        title="Need an exact quote for your business model?"
        description="We will scope your current stack, identify priority bottlenecks, and provide a clear monthly build plan."
      />
    </>
  );
}
