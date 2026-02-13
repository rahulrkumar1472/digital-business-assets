import type { FaqItem } from "@/types/content";

function q(question: string, answer: string): FaqItem {
  return { question, answer };
}

export function homeFaqs(): FaqItem[] {
  return [
    q(
      "How quickly can we launch?",
      "Most website-first deployments start within days and can launch in 72 hours when core assets are ready. See [Website Builds](/services/website-starter-build) for the exact sprint model.",
    ),
    q(
      "What does £79/month actually include?",
      "The entry tier covers core conversion assets and support. Advanced automation, chatbot, and reporting layers are mapped in [Pricing](/pricing) based on complexity.",
    ),
    q(
      "Do you only build websites?",
      "No. We build full systems: SEO/AEO, CRM, automation, booking, call recovery, and reporting. Review all modules on [Services](/services).",
    ),
    q(
      "Can we estimate upside before buying?",
      "Yes. Run your current numbers through the [Growth Simulator](/growth-simulator), then book a planning call to validate assumptions.",
    ),
    q(
      "Which industries do you work with?",
      "Trades, clinics, gyms, dentists, legal, real estate, ecommerce, and local service businesses. See [Industries](/industries) for implementation patterns.",
    ),
    q(
      "How do you reduce missed leads?",
      "We combine missed-call recovery, chatbot qualification, response routing, and reminder sequences. See [Automations + Workflows](/services/follow-up-automation).",
    ),
    q(
      "Will this work with our existing tools?",
      "Usually yes. We use API/webhook-first architecture and only replace tooling when it blocks speed or reporting accuracy.",
    ),
    q(
      "How do we track ROI?",
      "Every implementation includes KPI tracking from lead source to booking and revenue. See [Reporting Dashboards](/services/crm-setup).",
    ),
    q(
      "Do you provide strategy or execution?",
      "Both. Strategy without implementation stalls growth, so we map and deploy in one delivery model. You can start on [Book](/book).",
    ),
    q(
      "Is there any guarantee?",
      "We offer a scoped money-back guarantee offer with clear terms, milestones, and exclusions discussed before onboarding via [Contact](/contact).",
    ),
  ];
}

export function servicesFaqs(): FaqItem[] {
  return [
    q("Can we start with one module first?", "Yes. Most teams start with the highest-leverage bottleneck and layer other modules after results. Compare options on [Services](/services)."),
    q("How long does a full stack deployment take?", "A website sprint can launch in 72 hours, while full automation and optimisation usually roll out over 7 to 30 days."),
    q("Which service is best for low lead quality?", "Start with positioning, conversion pages, and qualification flow. See [SEO + AEO](/services/seo-upgrade-pack) and [Chatbots](/services/ai-chatbot-install)."),
    q("What if follow-up is our main issue?", "Prioritise [CRM + Pipelines](/services/crm-setup), [Automations](/services/follow-up-automation), and [Booking + Reminders](/services/booking-system-setup)."),
    q("Can you improve phone enquiry conversion?", "Yes. We install missed-call recovery and call handling automation. See [Missed-Call Recovery](/services/call-tracking-missed-call-capture)."),
    q("Do services include reporting?", "Every module includes KPI tracking, and advanced plans include owner-level dashboards from [Reporting Dashboards](/services/crm-setup)."),
    q("Can we integrate WhatsApp and forms together?", "Yes. We unify channel capture and route leads into one CRM pipeline with visibility across all sources."),
    q("How do we choose between plans?", "Run [Growth Simulator](/growth-simulator), then book a call on [Book](/book) for a practical recommendation."),
    q("Do you provide training?", "Yes. We include operational handover and weekly optimisation guidance so teams can run workflows confidently."),
    q("Where can we see proof?", "Review measurable examples on [Case Studies](/case-studies) including before/after outcomes and implementation timelines."),
  ];
}

export function serviceDetailFaqs(serviceName: string, slug: string): FaqItem[] {
  return [
    q(`What outcomes should we expect from ${serviceName}?`, `We define baseline metrics, deploy quickly, and optimise in weekly cycles. See [Pricing](/pricing) for support depth.`),
    q("How quickly can implementation start?", "Most teams begin within 3-5 working days after discovery and access handoff."),
    q("Can this work with our current CRM or booking stack?", "Yes. We integrate existing tools first and only recommend changes when current systems block reliability."),
    q("How do we measure progress in month one?", "We track response speed, booking rate, conversion progression, and channel performance in one dashboard."),
    q("Is this service enough on its own?", `Sometimes yes, but many teams pair it with adjacent modules. See [All Services](/services) and [${serviceName}](/services/${slug}).`),
    q("Do you write scripts and messaging too?", "Yes. We produce conversion copy, automation scripts, and qualification prompts aligned with your commercial goals."),
    q("What support is included after launch?", "Support depends on plan tier and can include weekly optimisation, testing, and performance review.") ,
    q("Can we deploy to multiple locations?", "Yes. We can roll out location-based pages, routing logic, and dashboard views for multi-branch operations."),
    q("What does onboarding require from us?", "Core assets, tool access, offer priorities, and owner-level decisions on qualification rules and lead handling."),
    q("How do we move forward?", "Run your numbers in [Growth Simulator](/growth-simulator), then confirm rollout scope on [Book](/book)."),
  ];
}

export function industriesFaqs(): FaqItem[] {
  return [
    q("Do you customise by sector or use one template?", "We deploy a proven architecture, then customise scripts, workflows, and conversion blocks by industry. Explore [Industries](/industries)."),
    q("Can this work for local service businesses?", "Yes. Local intent capture, fast response systems, and booking automation are core for service-led SMEs."),
    q("How do you adapt to longer sales cycles?", "We map stages, set follow-up logic, and add KPI checkpoints so longer pipelines stay controlled."),
    q("Which industries usually see fastest gains?", "Teams with slow response and manual follow-up often improve fastest after automation and booking upgrades."),
    q("Do you support compliance-sensitive sectors?", "Yes. We use compliance-safe messaging patterns and avoid unverifiable claims in regulated categories."),
    q("Can we combine industry pages with SEO strategy?", "Yes. We pair industry pages with [SEO + AEO](/services/seo-upgrade-pack) for topical visibility and conversion depth."),
    q("How are industry case studies used?", "We use case evidence to set realistic baseline targets and prioritise the highest-impact sequence."),
    q("Can one business target multiple verticals?", "Yes. We can build segmented journeys with unique qualification and reporting per segment."),
    q("What if our industry is not listed?", "Book through [Contact](/contact) and we will map a comparable deployment model using adjacent sector data."),
    q("Where do we start?", "Start with [Growth Simulator](/growth-simulator) then move to [Book](/book) for industry-specific rollout planning."),
  ];
}

export function industryDetailFaqs(industryName: string, slug: string): FaqItem[] {
  return [
    q(`How is ${industryName} implementation different?`, `We adapt lead qualification, booking, and reminders to ${industryName.toLowerCase()} buying behaviour and urgency patterns.`),
    q("What is the first bottleneck you usually fix?", "Most teams start with response speed and missed follow-up, then move to conversion architecture."),
    q("Do you provide sector messaging guidance?", "Yes. We build outcome-first messaging and qualification criteria tied to your offer economics."),
    q("Can this work with existing staff and processes?", "Yes. Workflows are designed around current team capacity and practical operational constraints."),
    q("How do we validate expected upside?", "Use [Growth Simulator](/growth-simulator) and align assumptions with comparable [Case Studies](/case-studies)."),
    q("Do you include appointment and reminder logic?", "Yes, especially for attendance-critical sectors where no-shows affect revenue stability."),
    q("Can you implement branch-level dashboards?", "Yes. Multi-location reporting is supported with shared and branch-specific KPI views."),
    q("How long does rollout take?", "Initial deployment usually starts in under a week, with optimisation cycles running through day 30 and beyond."),
    q("Which services pair best for this industry?", `See recommended modules on [Industry Page](/industries/${slug}) and [Services](/services).`),
    q("How do we get started?", "Use [Book](/book) to secure a strategy call and implementation timeline."),
  ];
}

export function caseStudiesFaqs(): FaqItem[] {
  return [
    q("Are the results guaranteed?", "No. Case studies show real outcomes from specific contexts and execution quality; they are not guarantees."),
    q("How do you set realistic targets?", "We benchmark against your baseline and industry factors, then model ranges in [Growth Simulator](/growth-simulator)."),
    q("What timeline do most results follow?", "Many businesses see response and booking improvements quickly, with stronger gains after 30-day optimisation."),
    q("Do you publish implementation details?", "Yes. Each case study includes problem, system stack, timeline, and measurable change points."),
    q("Can we replicate the same stack exactly?", "We reuse proven patterns but tailor scripts, automations, and KPI goals to your business model."),
    q("Are these UK-only examples?", "Yes, our launch examples are UK-focused to keep operational context consistent."),
    q("How do you measure baseline metrics?", "We capture historical lead, response, booking, and attendance data before deployment."),
    q("Can we start from one part of a case study?", "Yes. We often deploy one high-impact module first, then scale. See [Services](/services)."),
    q("Do case studies include SEO and automation data?", "Yes. We include channel-specific changes where tracking exists."),
    q("How can we request a similar plan?", "Book through [Book](/book) and reference the closest case study to your business model."),
  ];
}

export function caseStudyDetailFaqs(caseTitle: string): FaqItem[] {
  return [
    q(`How transferable is ${caseTitle} to our business?`, "The system pattern is transferable, but messaging, offers, and routing logic should be tailored to your model."),
    q("Which part delivered the fastest impact?", "Usually response-time automation and booking flow clarity deliver the fastest measurable lift."),
    q("Can we use the same KPI dashboard structure?", "Yes. We can clone the reporting framework and adapt stages and thresholds to your process."),
    q("How long before optimisation starts?", "Optimisation starts as soon as baseline and launch metrics are visible, often within week one."),
    q("Do we need to switch tools to match this setup?", "Not always. We integrate with current tools unless reliability or visibility is limited."),
    q("Is a website rebuild always required?", "No. Some cases only need conversion upgrades and automation layering."),
    q("Can we scope only the highest-impact components?", "Yes. We can prioritise modules by projected ROI and operational urgency."),
    q("How do we reduce risk during rollout?", "We stage deployment, validate each workflow, and monitor failures with escalation alerts."),
    q("What happens after day 30?", "We continue with optimisation sprints, performance reviews, and system refinement based on live data."),
    q("How do we begin?", "Use [Contact](/contact) or [Book](/book) and we will map an equivalent implementation plan."),
  ];
}

export function pricingFaqs(): FaqItem[] {
  return [
    q("What is included in the £79 plan?", "Core conversion support and foundational system assets. Higher tiers add deeper automation, chatbot, and analytics layers."),
    q("Is there a setup fee?", "Setup scope depends on complexity and existing systems. We provide transparent costs before implementation starts."),
    q("Can we upgrade later?", "Yes. Most clients start lean and move to Growth or Scale once early KPIs justify expansion."),
    q("Do plans include strategy calls?", "Yes. Plans include review cadence based on tier and implementation stage."),
    q("Can we pause or change scope?", "Yes, within agreed terms. We can reprioritise modules based on changing business conditions."),
    q("Are there long contracts?", "Terms are transparent and discussed before onboarding. No hidden obligations outside agreed scope."),
    q("Do plans include reporting dashboards?", "Reporting depth scales by tier, with full revenue visibility in higher plans."),
    q("Can we add chatbot later?", "Yes. Chatbot and AI receptionist modules can be layered as soon as your pipeline is ready."),
    q("How do we pick the right tier?", "Use [Growth Simulator](/growth-simulator) and confirm implementation priorities on [Book](/book)."),
    q("What if we need custom workflows?", "Custom development can be scoped as part of Growth or Scale implementations."),
  ];
}

export function aboutFaqs(): FaqItem[] {
  return [
    q("What makes your approach different?", "Execution-first delivery with measurable KPI ownership, rather than strategy-only retainers."),
    q("Do you work with small teams?", "Yes. Our systems are designed for SME capacity and delegation without heavy admin overhead."),
    q("How do you handle onboarding?", "We run a structured discovery, collect assets, align priorities, and deploy in staged sprints."),
    q("Do you provide documentation?", "Yes. Workflows, dashboards, and operational runbooks are provided as part of handover."),
    q("Can your systems be delegated internally?", "Yes. We structure automations and dashboards so teams can run operations without constant external dependence."),
    q("How do you keep projects on schedule?", "Clear milestones, owner checkpoints, and staged QA reduce delivery drift."),
    q("Do you offer UK-wide support?", "Yes. Delivery is UK-wide and remote-first.") ,
    q("How quickly can we get a proposal?", "Most proposals are delivered after one strategy call with baseline context."),
    q("Where can we see results?", "Review [Case Studies](/case-studies) and sector pages on [Industries](/industries)."),
    q("What is the next step?", "Use [Book](/book) to lock in a strategy session and scope your first sprint."),
  ];
}

export function bookFaqs(): FaqItem[] {
  return [
    q("How long is the strategy call?", "Each call is 30 minutes focused on priorities, constraints, and practical rollout decisions."),
    q("What should we prepare?", "Bring baseline metrics: monthly leads, response time, conversion rates, and current follow-up process."),
    q("Can multiple team members attend?", "Yes. Bringing decision-makers improves implementation speed and alignment."),
    q("Do we receive a written plan?", "Yes. You receive a clear recommendation with module priorities and timeline.") ,
    q("Can we reschedule?", "Yes, subject to availability in the booking system."),
    q("Will you review our website live?", "Yes. We can review conversion friction points and next fixes during the session."),
    q("Do you discuss budget fit?", "Yes. We align recommendations to ROI potential and team capacity."),
    q("Is there pressure to buy?", "No. The call is consultative, with clear next steps whether you proceed now or later."),
    q("Can we start immediately after the call?", "In many cases yes, once scope and assets are confirmed."),
    q("Where can we run numbers first?", "Use [Growth Simulator](/growth-simulator) before your call for faster planning."),
  ];
}

export function growthSimulatorFaqs(): FaqItem[] {
  return [
    q("How accurate are simulator outputs?", "Outputs are estimate ranges based on your inputs and industry presets; they are planning guidance, not guarantees."),
    q("Why are outputs shown as ranges?", "Real outcomes vary by offer quality, demand, team speed, and implementation consistency."),
    q("Which inputs matter most?", "Response time, conversion rate, follow-up maturity, and no-show rate usually have the biggest impact."),
    q("Can I export my simulation?", "Yes. Use the export option and bring the output into your strategy call."),
    q("How does industry change results?", "Industry presets adjust expected lead behaviour, booking friction, and conversion benchmarks."),
    q("Can this map recommended services?", "Yes. The simulator recommends asset packs aligned with your current bottlenecks."),
    q("Should we run multiple scenarios?", "Yes. Compare conservative and ambitious scenarios before deciding deployment scope."),
    q("Does this connect to booking?", "Yes. Send your scenario to [Book](/book) with query parameters for faster planning."),
    q("Can teams use this for weekly planning?", "Yes. Re-run as metrics improve to prioritise next optimisation sprints."),
    q("Where do I go after simulation?", "Move to [Services](/services) for module detail, then confirm rollout on [Book](/book)."),
  ];
}

export function contactFaqs(): FaqItem[] {
  return [
    q("How quickly will your team respond?", "Most enquiries receive a response within one business day."),
    q("Can we request a fixed-scope proposal?", "Yes. Share current metrics and constraints, and we provide clear scope with timeline."),
    q("Do you work with businesses outside major cities?", "Yes. Delivery is UK-wide and remote-first."),
    q("What information helps you scope accurately?", "Lead volume, response speed, conversion rates, and current follow-up process."),
    q("Can we start small?", "Yes. Many clients start with one high-impact module and scale after initial results."),
    q("Do you support existing tool stacks?", "Usually yes. We integrate API-first and only replace tooling when necessary."),
    q("Can we include multiple stakeholders?", "Yes. Include decision-makers so scope and timeline are confirmed quickly."),
    q("Is there a minimum contract?", "Commercial terms are shared transparently before onboarding."),
    q("Can we request a case-study-aligned plan?", "Yes. Mention a relevant example from [Case Studies](/case-studies)."),
    q("How do we move from contact to implementation?", "After discovery, confirm priorities on [Book](/book) and begin staged deployment."),
  ];
}
