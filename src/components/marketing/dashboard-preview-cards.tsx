import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ImageOrPlaceholder } from "@/components/marketing/image-or-placeholder";
import { MotionReveal } from "@/components/marketing/motion-reveal";

const cards = [
  {
    title: "Call Recovery",
    outcome: "Recover missed-call revenue before leads go cold.",
    points: [
      "Instant text-back on missed calls",
      "Priority routing for urgent enquiries",
      "Call-to-booking conversion tracking",
    ],
    image: "/media/dashboard-1.jpg",
  },
  {
    title: "Follow-up Automation",
    outcome: "Every lead gets a response and next action automatically.",
    points: [
      "Lead routing by service type",
      "SLA reminders and escalation",
      "CRM status sync in real time",
    ],
    image: "/media/dashboard-2.jpg",
  },
  {
    title: "Booking Reminders",
    outcome: "Reduce no-shows and improve confirmed bookings.",
    points: [
      "Multi-step SMS and email reminders",
      "Reschedule and cancellation logic",
      "Attendance and conversion reporting",
    ],
    image: "/media/dashboard-3.jpg",
  },
];

export function DashboardPreviewCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {cards.map((card, index) => (
        <MotionReveal key={card.title} delay={index * 0.05}>
          <article className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45 transition-all hover:-translate-y-1 hover:border-cyan-400/45 hover:shadow-[0_22px_60px_rgba(15,23,42,0.65)]">
            <div className="relative aspect-[16/10] border-b border-slate-800">
              <ImageOrPlaceholder
                src={card.image}
                alt={card.title}
                label={card.title}
                className="h-full w-full"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            </div>
            <div className="space-y-4 p-5">
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="text-sm font-medium text-cyan-200">{card.outcome}</p>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {card.points.map((point) => (
                  <li key={point} className="list-disc pl-1 marker:text-cyan-300">
                    {point}
                  </li>
                ))}
              </ul>
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                See how it works
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </article>
        </MotionReveal>
      ))}
    </div>
  );
}
