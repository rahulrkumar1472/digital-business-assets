import { CheckCircle2 } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { Badge } from "@/components/ui/badge";

type PricingTier = {
  name: string;
  price: string;
  descriptor: string;
  bullets: string[];
  highlight?: boolean;
};

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "£99/mo",
    descriptor: "For businesses that need launch speed.",
    bullets: [
      "72-hour website sprint",
      "Lead capture form setup",
      "Core SEO baseline",
      "Monthly support",
    ],
  },
  {
    name: "Growth",
    price: "£299/mo",
    descriptor: "Best for teams scaling qualified leads.",
    bullets: [
      "Everything in Starter",
      "CRM pipeline and booking flow",
      "Automated reminders and follow-up",
      "Monthly growth optimisation",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "£599/mo",
    descriptor: "For AI-first sales and operations.",
    bullets: [
      "Everything in Growth",
      "AI chatbot + missed-call recovery",
      "Cross-platform automations",
      "Revenue dashboard and reporting",
    ],
  },
];

type PricingCardsProps = {
  compact?: boolean;
};

export function PricingCards({ compact = false }: PricingCardsProps) {
  const shownTiers = compact ? tiers : tiers;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {shownTiers.map((tier, index) => (
        <MotionReveal key={tier.name} delay={index * 0.05}>
          <div
            className={`h-full rounded-2xl border p-6 ${
              tier.highlight
                ? "border-cyan-400/45 bg-[linear-gradient(180deg,rgba(34,211,238,0.16),rgba(15,23,42,0.72))] shadow-[0_0_50px_rgba(34,211,238,0.18)]"
                : "border-slate-800 bg-slate-900/40"
            }`}
          >
            {tier.highlight ? (
              <Badge className="mb-4 border-cyan-400/40 bg-cyan-500/10 text-cyan-200">Recommended</Badge>
            ) : null}
            <p className="text-sm font-semibold tracking-[0.08em] text-slate-300 uppercase">{tier.name}</p>
            <p className="mt-2 text-4xl font-semibold text-white">{tier.price}</p>
            <p className="mt-2 text-sm text-slate-300">{tier.descriptor}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-200">
              {tier.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <PrimaryCTA href="/book" label="Book a Call" size="default" className="mt-6 w-full" secondary={!tier.highlight} />
          </div>
        </MotionReveal>
      ))}
    </div>
  );
}
