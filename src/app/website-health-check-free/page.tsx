import { SeoAuditEntryTemplate } from "@/components/tools/seo-audit-entry-template";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/website-health-check-free" });

export default function WebsiteHealthCheckFreePage() {
  return (
    <SeoAuditEntryTemplate
      eyebrow="Website Health Check"
      title="Website health check free: diagnose growth blockers before they cost you"
      description="Get a website health report that translates technical, trust, and conversion issues into a practical plan your team can execute this week."
      whatYouGetIntro="This health-check version is built to expose hidden weaknesses that look minor technically but create major commercial drag."
      includes={[
        "Health snapshot across speed, visibility, conversion, and trust.",
        "Leak explanations in plain owner-level language.",
        "Business impact ranges to prioritise what matters most.",
        "Task list split into fast wins and scheduled wins.",
        "Guided links into service modules where needed.",
        "Clear route to done-for-you implementation support.",
      ]}
      howItWorksIntro="Run the check, review the health profile, then turn each weak area into a practical improvement sprint."
      steps={[
        "Add your URL and start the instant health scan.",
        "Review your scorecard and issue impact notes.",
        "Choose guided fixes or a full implementation plan.",
      ]}
      outputsIntro="Typical health profiles often reveal one strong pillar and two weak pillars that need immediate balancing."
      sampleScores={[
        { label: "Speed", score: "63", detail: "Baseline is fair but still leaking mobile attention." },
        { label: "SEO", score: "57", detail: "Search intent coverage is patchy across core pages." },
        { label: "Conversion", score: "44", detail: "Lead path friction likely suppresses enquiries." },
        { label: "Trust", score: "52", detail: "Proof and confidence elements need stronger prominence." },
      ]}
      nextStepIntro="Once your health baseline is clear, choose whether to execute internally or accelerate with done-for-you deployment."
      schemaPath="/website-health-check-free"
      faqs={[
        {
          question: "What is included in this health check?",
          answer: "It includes speed, SEO, conversion, and trust diagnostics with clear business impact context.",
        },
        {
          question: "Is this just for technical teams?",
          answer: "No. The report is designed for business owners and operators first.",
        },
        {
          question: "Will this show where I am losing enquiries?",
          answer: "Yes. Leak sections explain what is happening, why it matters, and what to change.",
        },
        {
          question: "Can I use this if my website is brand new?",
          answer: "Yes. It is useful for both new sites and established sites with weak results.",
        },
        {
          question: "How often should I run it?",
          answer: "Run after major changes or monthly during active growth periods.",
        },
        {
          question: "Does this replace full analytics?",
          answer: "No, but it helps you decide which analytics and tracking improvements to deploy next.",
        },
        {
          question: "Can this support funding or board updates?",
          answer: "Yes. The clear score and action plan can support stakeholder discussions.",
        },
        {
          question: "What if I want help implementing fixes?",
          answer: "Move directly into [services](/services) or request your rollout in [bespoke plan](/bespoke-plan).",
        },
      ]}
      finalTitle="A healthy website should produce bookings, not confusion"
      finalDescription="Use this health check to remove hidden friction and improve your revenue path in phases."
    />
  );
}
