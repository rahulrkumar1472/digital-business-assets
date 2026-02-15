import { SeoAuditEntryTemplate } from "@/components/tools/seo-audit-entry-template";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/free-website-audit-for-small-business" });

export default function FreeWebsiteAuditForSmallBusinessPage() {
  return (
    <SeoAuditEntryTemplate
      eyebrow="SME Website Audit"
      title="Free website audit for small business owners who need more bookings"
      description="Get a practical growth report built for small business reality: limited time, limited team, and no room for guesswork on what to fix next."
      whatYouGetIntro="You get an owner-friendly report that prioritises practical fixes over technical noise, designed for teams that need fast progress."
      includes={[
        "A simple scorecard showing the 4 growth pillars.",
        "Revenue leak statements tied to real buyer behavior.",
        "Quick tasks your current team can execute fast.",
        "Medium-term upgrades for stronger lead consistency.",
        "A module path if you want implementation handled for you.",
        "Track recommendation so you know your next best move.",
      ]}
      howItWorksIntro="This flow is made for small teams: one URL input, instant insight, then clear execution options."
      steps={[
        "Enter your website URL and generate your report.",
        "See your top leakage points with estimated impact.",
        "Deploy the right fixes or hand it over to us.",
      ]}
      outputsIntro="Sample scores below illustrate the kinds of issues that usually hold small business websites back."
      sampleScores={[
        { label: "Speed", score: "60", detail: "Mobile speed is fair but not conversion-strong yet." },
        { label: "SEO", score: "58", detail: "High-intent local terms are not fully captured." },
        { label: "Conversion", score: "46", detail: "Offer and form flow create unnecessary drop-off." },
        { label: "Trust", score: "61", detail: "Proof exists but placement can improve response rate." },
      ]}
      nextStepIntro="After reviewing your baseline, decide whether you want to keep control in-house or hand implementation to a specialist team."
      faqs={[
        {
          question: "Is this designed for small businesses specifically?",
          answer: "Yes. The language and actions are tailored for owner-led teams that need fast decisions.",
        },
        {
          question: "Will I need a marketing agency to understand it?",
          answer: "No. The report is written to be directly usable by non-technical business owners.",
        },
        {
          question: "Can this help if I mostly get leads from referrals?",
          answer: "Yes. It highlights how to convert more referred traffic and protect local intent demand.",
        },
        {
          question: "How quickly can I take action after running it?",
          answer: "You can start with quick wins immediately and schedule medium wins over 1-2 weeks.",
        },
        {
          question: "Do I need to share business data?",
          answer: "No. URL is enough to start. Email remains optional.",
        },
        {
          question: "Can this help if I have no in-house marketer?",
          answer: "Yes. It gives a practical sequence you can execute yourself or outsource in one handoff.",
        },
        {
          question: "What if I need a full rebuild?",
          answer: "The report can route you directly into [services](/services) and [bespoke plan](/bespoke-plan).",
        },
        {
          question: "Can I compare multiple sites?",
          answer: "Yes, run additional scenarios through [playground](/playground) to compare outputs.",
        },
      ]}
      finalTitle="Small business growth needs clarity, not complexity"
      finalDescription="Start with a free report, then choose the shortest route to better lead quality and conversion."
    />
  );
}
