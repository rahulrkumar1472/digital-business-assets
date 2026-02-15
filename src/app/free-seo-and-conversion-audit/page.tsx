import { SeoAuditEntryTemplate } from "@/components/tools/seo-audit-entry-template";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/free-seo-and-conversion-audit" });

export default function FreeSeoAndConversionAuditPage() {
  return (
    <SeoAuditEntryTemplate
      eyebrow="SEO + Conversion Audit"
      title="Free SEO and conversion audit with instant action priorities"
      description="Run one report that combines search visibility and conversion performance, so your traffic and conversion strategy work together instead of in silos."
      whatYouGetIntro="This page emphasises search intent and conversion flow together, so you can stop treating SEO and sales performance as separate problems."
      includes={[
        "SEO intent score focused on buyer-ready search terms.",
        "Conversion score focused on lead and sales friction.",
        "Leak diagnostics with estimated business impact ranges.",
        "Quick fixes for title, offer, and CTA structure.",
        "Implementation plan mapped to paid modules.",
        "Pathway to DIY optimisation or managed rollout.",
      ]}
      howItWorksIntro="You start with one URL, get a dual SEO-conversion diagnosis, then deploy fixes in ranked order."
      steps={[
        "Generate your baseline from a single URL input.",
        "Review SEO and conversion findings side-by-side.",
        "Apply fixes in priority order to improve response and sales.",
      ]}
      outputsIntro="These example scores show the common pattern where traffic quality and conversion quality are misaligned."
      sampleScores={[
        { label: "Speed", score: "56", detail: "Slow rendering limits early engagement on mobile." },
        { label: "SEO", score: "53", detail: "Intent mismatch reduces qualified search opportunities." },
        { label: "Conversion", score: "51", detail: "Offer/CTA framing needs stronger decision guidance." },
        { label: "Trust", score: "59", detail: "Confidence cues are present but under-leveraged." },
      ]}
      nextStepIntro="Use the report to sequence optimisation and avoid wasting time on improvements that do not increase qualified outcomes."
      faqs={[
        {
          question: "Why combine SEO and conversion in one report?",
          answer: "Because traffic quality and conversion quality are connected. Fixing one without the other leaves revenue on the table.",
        },
        {
          question: "Will this help with organic leads specifically?",
          answer: "Yes. It highlights intent gaps and conversion blockers that suppress organic lead yield.",
        },
        {
          question: "Can this identify weak page messaging?",
          answer: "Yes. Conversion diagnostics focus on offer clarity, CTA hierarchy, and proof placement.",
        },
        {
          question: "Is this useful for service businesses and ecommerce?",
          answer: "Yes. The report adapts recommendations based on industry and goal context.",
        },
        {
          question: "Do I need to install anything first?",
          answer: "No setup required. Enter URL and generate report.",
        },
        {
          question: "How should I use the output?",
          answer: "Apply high-impact quick wins first, then move into phased module implementation.",
        },
        {
          question: "What if my SEO score is okay but sales are low?",
          answer: "That usually indicates conversion and trust friction, which the report prioritises clearly.",
        },
        {
          question: "Where do I go after the report?",
          answer: "Use [services](/services), request [bespoke plan](/bespoke-plan), or test scenarios in [playground](/playground).",
        },
      ]}
      finalTitle="Better rankings are only valuable when they convert"
      finalDescription="Use this audit to align search visibility and conversion mechanics into one revenue-focused plan."
    />
  );
}
