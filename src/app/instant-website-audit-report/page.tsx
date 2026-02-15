import { SeoAuditEntryTemplate } from "@/components/tools/seo-audit-entry-template";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/instant-website-audit-report" });

export default function InstantWebsiteAuditReportPage() {
  return (
    <SeoAuditEntryTemplate
      eyebrow="Instant Audit Report"
      title="Instant website audit report with actionable growth steps"
      description="Generate an immediate website audit report that gives you a score, leak diagnosis, and a practical route from findings to booked revenue."
      whatYouGetIntro="This instant-report page is designed for speed: fast diagnosis, clear impact ranges, and immediate implementation pathways."
      includes={[
        "Immediate score output with no setup required.",
        "Revenue leak breakdown with impact language.",
        "Action stack covering speed, SEO, and conversion.",
        "Prioritised sequence for short and medium timelines.",
        "Service mapping for implementation-ready next steps.",
        "Direct links to launch support if you want execution done for you.",
      ]}
      howItWorksIntro="No lengthy onboarding. URL in, score out, action route confirmed."
      steps={[
        "Enter URL and trigger instant report generation.",
        "Review score and leak impact before making changes.",
        "Execute priority actions or launch a done-for-you plan.",
      ]}
      outputsIntro="Example numbers below reflect the type of score distribution seen in websites with stalled lead or sales growth."
      sampleScores={[
        { label: "Speed", score: "52", detail: "Slow first impression reduces high-intent engagement." },
        { label: "SEO", score: "61", detail: "Some intent alignment exists, but ranking depth is limited." },
        { label: "Conversion", score: "45", detail: "Primary offer path is not converting enough visitors." },
        { label: "Trust", score: "58", detail: "Confidence signals need stronger placement near CTAs." },
      ]}
      nextStepIntro="Treat the report as your launch point, then select the execution track that matches your capacity and urgency."
      faqs={[
        {
          question: "How instant is this report?",
          answer: "You get your output immediately after entering your URL.",
        },
        {
          question: "Is this suitable before a redesign?",
          answer: "Yes. It helps you avoid rebuilding the wrong things by showing priority gaps first.",
        },
        {
          question: "Can this report support sales teams?",
          answer: "Yes. It highlights friction points that weaken lead quality and close rates.",
        },
        {
          question: "Do I need agency access to use it?",
          answer: "No. Any business owner can run and interpret the report.",
        },
        {
          question: "What if my score is already decent?",
          answer: "Use leak and impact notes to focus only on improvements with meaningful revenue return.",
        },
        {
          question: "Can I compare this with competitor sites?",
          answer: "Yes. Run multiple reports and compare score patterns.",
        },
        {
          question: "Does it include implementation guidance?",
          answer: "Yes. The report links directly to modules and phased action paths.",
        },
        {
          question: "Where can I get a done-for-you rollout?",
          answer: "Use [bespoke plan](/bespoke-plan) after your report for a tailored implementation roadmap.",
        },
      ]}
      finalTitle="Instant insight is only step one. Execution drives growth."
      finalDescription="Use the report to align your next 14 days around the highest-return growth actions."
    />
  );
}
