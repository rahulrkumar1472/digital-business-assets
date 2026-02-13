import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Button } from "@/components/ui/button";

type SubscriptionTier = {
  name: string;
  price: string;
  fit: string;
  limits: string;
  bullets: string[];
  highlighted?: boolean;
};

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: "Starter",
    price: "£79/mo",
    fit: "Best for businesses getting digital basics live quickly.",
    limits: "Up to 2 deployed modules",
    bullets: [
      "Business OS onboarding",
      "Core website or booking setup",
      "Monthly performance checkpoint",
    ],
  },
  {
    name: "Growth",
    price: "£355/mo",
    fit: "For teams that need reliable lead capture and follow-up automation.",
    limits: "Up to 5 deployed modules",
    bullets: [
      "Everything in Starter",
      "CRM + automation workflows",
      "Priority support and weekly optimisation",
    ],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "£499/mo",
    fit: "For businesses scaling aggressively with multi-channel demand.",
    limits: "Up to 8 deployed modules",
    bullets: [
      "Everything in Growth",
      "AI employee module deployment",
      "Advanced dashboard and growth reviews",
    ],
  },
];

type InContextPricingProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export function InContextPricing({
  title = "Business OS subscription tiers",
  description = "Deploy modules in stages with transparent monthly cost and no hidden stack creep.",
  compact = false,
}: InContextPricingProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-cyan-500/28 bg-[linear-gradient(150deg,rgba(34,211,238,0.14),rgba(15,23,42,0.92))] p-6 md:p-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">Pricing in context</p>
        <h2 className="mt-2 text-4xl font-semibold text-white md:text-5xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-200">{description}</p>
      </div>

      <div className={`grid gap-4 ${compact ? "md:grid-cols-3" : "lg:grid-cols-3"}`}>
        {subscriptionTiers.map((tier, index) => (
          <MotionReveal key={tier.name} delay={index * 0.05}>
            <article
              className={`h-full rounded-2xl border p-5 ${
                tier.highlighted
                  ? "border-cyan-400/55 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                  : "border-slate-800 bg-slate-950/55"
              }`}
            >
              <p className="text-xs font-semibold tracking-[0.1em] text-slate-300 uppercase">{tier.name}</p>
              <p className="mt-1 text-3xl font-semibold text-white">{tier.price}</p>
              <p className="mt-2 text-xs text-cyan-200">{tier.limits}</p>
              <p className="mt-3 text-sm text-slate-300">{tier.fit}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-200">
                {tier.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </MotionReveal>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/pricing">Compare all plans</Link>
        </Button>
        <Button asChild variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800">
          <Link href="/growth-simulator">Get your growth plan</Link>
        </Button>
      </div>

      <p className="text-xs text-slate-400">Add-ons are separate and transparent: one-time installs remain clearly scoped.</p>
    </div>
  );
}
