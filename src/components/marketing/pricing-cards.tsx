import { CheckCircle2 } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { PrimaryCTA } from "@/components/marketing/primary-cta";
import { Badge } from "@/components/ui/badge";

type PricingTier = {
  name: string;
  price: string;
  descriptor: string;
  limits: string;
  bullets: string[];
  highlight?: boolean;
};

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "£79/mo",
    descriptor: "For businesses moving from offline/basic digital into a deployable Business OS.",
    limits: "Deploy up to 2 modules",
    bullets: [
      "Website Starter Build onboarding",
      "Lead capture + tracking baseline",
      "Monthly implementation support",
      "Transparent add-on menu",
    ],
  },
  {
    name: "Growth",
    price: "£355/mo",
    descriptor: "For teams that need predictable lead handling and conversion flow.",
    limits: "Deploy up to 5 modules",
    bullets: [
      "Everything in Starter",
      "CRM setup + follow-up automation",
      "Booking workflow and reminders",
      "Weekly KPI optimisation cadence",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "£499/mo",
    descriptor: "For UK businesses running multi-channel demand and ready to systemise growth.",
    limits: "Deploy up to 8 modules",
    bullets: [
      "Everything in Growth",
      "AI chatbot + WhatsApp layer",
      "Advanced reporting and dashboards",
      "Priority deployment queue",
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
              <Badge className="mb-4 border-cyan-400/40 bg-cyan-500/10 text-cyan-200">Most Popular</Badge>
            ) : null}
            <p className="text-sm font-semibold tracking-[0.08em] text-slate-300 uppercase">{tier.name}</p>
            <p className="mt-2 text-4xl font-semibold text-white">{tier.price}</p>
            <p className="mt-2 text-xs text-cyan-200">{tier.limits}</p>
            <p className="mt-3 text-sm text-slate-300">{tier.descriptor}</p>
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
