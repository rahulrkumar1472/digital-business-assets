import { SeoAuditEntryTemplate } from "@/components/tools/seo-audit-entry-template";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/check-website-performance-free" });

export default function CheckWebsitePerformanceFreePage() {
  return (
    <SeoAuditEntryTemplate
      eyebrow="Free Performance Check"
      title="Check website performance free and see where conversions slow down"
      description="Run a free growth audit that translates technical performance issues into booking and sales impact, so you know exactly what to fix first."
      whatYouGetIntro="This version focuses on speed-to-revenue. You will see where slow pages and weak conversion paths are dragging down response volume."
      includes={[
        "Performance score tied to enquiry and checkout behavior.",
        "Visibility check showing where search intent is under-leveraged.",
        "Conversion friction findings in plain business language.",
        "Trust-layer diagnostics for proof, clarity, and confidence.",
        "Action priority list mapped to high-impact tasks.",
        "Module guidance if you want done-for-you implementation.",
      ]}
      howItWorksIntro="The process is intentionally short so you can move from diagnosis to action without long setup."
      steps={[
        "Submit your URL to generate your instant baseline.",
        "Review speed, SEO, conversion, and trust with impact notes.",
        "Choose your path: guided fixes or full implementation.",
      ]}
      outputsIntro="Scores below are typical examples of what underperforming pages look like before optimisation."
      sampleScores={[
        { label: "Speed", score: "54", detail: "Slow first contentful paint suppresses enquiry intent." },
        { label: "SEO", score: "66", detail: "Metadata exists but intent depth is inconsistent." },
        { label: "Conversion", score: "49", detail: "Primary action is unclear above the fold." },
        { label: "Trust", score: "57", detail: "Social proof placement weakens buying confidence." },
      ]}
      nextStepIntro="Once you know the performance bottleneck, you can either iterate with guided checks or move straight into implementation support."
      faqs={[
        {
          question: "What does performance mean in this audit?",
          answer: "Performance here means speed plus conversion readiness, not just a raw technical number.",
        },
        {
          question: "Can this help if my pages look fine visually?",
          answer: "Yes. Many polished pages still underperform because the action path is unclear or too slow.",
        },
        {
          question: "Will this tell me what to fix first?",
          answer: "Yes. The report prioritises highest impact opportunities before low-return tasks.",
        },
        {
          question: "Do I need developer access to run this?",
          answer: "No. Enter your URL and you get a usable report immediately.",
        },
        {
          question: "How is this different from generic score tools?",
          answer: "It connects findings directly to bookings, enquiries, and module-based execution.",
        },
        {
          question: "Can I use this before running ads?",
          answer: "Yes, and you should. Fixing conversion leaks first protects ad budget efficiency.",
        },
        {
          question: "Can I hand this to my team?",
          answer: "Yes. The output is structured so operations, design, and marketing can action quickly.",
        },
        {
          question: "What if I want implementation support?",
          answer: "Move from report to [services](/services) or request a done-for-you plan in [bespoke plan](/bespoke-plan).",
        },
      ]}
      finalTitle="Performance without conversion is wasted opportunity"
      finalDescription="Use this report to close speed and conversion gaps before competitors capture the same demand."
    />
  );
}
