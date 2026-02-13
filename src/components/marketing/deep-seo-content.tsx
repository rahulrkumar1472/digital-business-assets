import { MotionReveal } from "@/components/marketing/motion-reveal";
import { AutomationFlowDiagram } from "@/components/marketing/automation-flow-diagram";
import { FunnelDiagram } from "@/components/marketing/funnel-diagram";
import { ImageOrPlaceholder } from "@/components/marketing/image-or-placeholder";
import { KPICharts } from "@/components/marketing/kpi-charts";

type DeepSeoContentProps = {
  topic: string;
  audience: string;
  image?: string;
};

const sectionFrames = [
  "Strategic context",
  "Conversion architecture",
  "Implementation roadmap",
  "Operational execution",
  "Measurement model",
  "Risk controls",
  "Optimisation cadence",
];

function paragraph(topic: string, audience: string, frame: string, variant: number) {
  const blocks = [
    `For ${audience}, ${topic.toLowerCase()} should be treated as an operating system decision rather than a one-off marketing task. Most teams plateau when attention generation is disconnected from speed-to-lead execution, qualification standards, booking flow design, and post-enquiry accountability. That creates invisible leakage: traffic looks healthy, enquiries appear active, but conversion quality drops because each handoff is delayed or inconsistent. We solve this by defining exactly what happens from first touch to booked opportunity, then implementing the assets and automations that remove manual delays.`,
    `The practical advantage is control. Instead of relying on individual memory, you run an explicit workflow with stage definitions, ownership rules, and measurable thresholds. If response time slips, escalation logic triggers. If booking completion falls, friction points are visible. If no-shows rise, reminder pathways and confirmation prompts are adjusted. This is how teams stop guessing and start making evidence-based decisions that protect revenue predictability while lowering operational load.`,
    `A mature system also improves decision speed for owners. Weekly reporting surfaces where conversion is strongest, where follow-up is failing, and where spend should be concentrated. This makes growth less emotional and more executable. In practice, most gains come from compounding small fixes: tighter messaging, faster first reply, cleaner qualification, and disciplined reminders. Over a quarter, those incremental improvements can materially change booked revenue and team efficiency without adding unnecessary complexity.`,
  ];

  return blocks[variant % blocks.length].replaceAll("workflow", frame.toLowerCase());
}

export function DeepSeoContent({ topic, audience, image = "/media/hero-ai.jpg" }: DeepSeoContentProps) {
  return (
    <div className="space-y-12">
      {sectionFrames.map((frame, index) => (
        <MotionReveal key={frame} delay={index * 0.03}>
          <section className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              {topic}: {frame}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">{paragraph(topic, audience, frame, index)}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">{paragraph(topic, audience, frame, index + 1)}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">{paragraph(topic, audience, frame, index + 2)}</p>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {index % 3 === 0 ? <FunnelDiagram /> : null}
              {index % 3 === 1 ? <AutomationFlowDiagram /> : null}
              {index % 3 === 2 ? <KPICharts /> : null}
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/55">
                <ImageOrPlaceholder
                  src={image}
                  alt={`${topic} visual ${index + 1}`}
                  label={topic}
                  className="aspect-[16/10] h-full w-full"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
            </div>
          </section>
        </MotionReveal>
      ))}
    </div>
  );
}
