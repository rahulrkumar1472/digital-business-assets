import Link from "next/link";
import {
  Plane,
  Scissors,
  Dumbbell,
  Gavel,
  HeartPulse,
  Home,
  House,
  Soup,
  ShoppingBag,
  Stethoscope,
  Wrench,
} from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import type { Industry } from "@/types/content";

const iconMap = {
  restaurants: Soup,
  "real-estate": House,
  medical: HeartPulse,
  retail: ShoppingBag,
  beauty: Scissors,
  aviation: Plane,
  "trades-home-services": Wrench,
  "health-wellness-clinics": HeartPulse,
  "dental-clinics": Stethoscope,
  "legal-services": Gavel,
  "estate-agents": House,
  "gyms-fitness": Dumbbell,
  "ecommerce-brands": ShoppingBag,
  "local-services": Home,
} as const;

type IndustryGridProps = {
  industries: Industry[];
};

export function IndustryGrid({ industries }: IndustryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {industries.slice(0, 8).map((industry, index) => {
        const Icon = iconMap[industry.slug as keyof typeof iconMap] ?? Home;
        return (
          <MotionReveal key={industry.slug} delay={index * 0.04}>
            <Link
              href={`/industries/${industry.slug}`}
              className="group block h-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-400/40"
            >
              <span className="inline-flex rounded-lg border border-cyan-500/35 bg-cyan-500/10 p-2">
                <Icon className="size-4 text-cyan-300" />
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">{industry.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {industry.opportunities[0] ?? "Automation systems tailored to your sales workflow."}
              </p>
            </Link>
          </MotionReveal>
        );
      })}
    </div>
  );
}
