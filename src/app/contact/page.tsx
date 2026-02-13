import { Mail, MapPin, Phone } from "lucide-react";

import { LeadCaptureForm } from "@/components/shared/lead-capture-form";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact | Digital Business Assets",
  description:
    "Contact Digital Business Assets for websites, SEO/AEO, AI chatbots, automations, CRM and growth systems.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us where your funnel is breaking"
        description="Share your current blockers and we will recommend the fastest path to better lead flow and conversion performance."
      />

      <Section className="py-8 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/35 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">Lead capture form</h2>
              <p className="mt-2 text-sm text-slate-300">
                We typically respond with a scoped build plan and implementation options.
              </p>
              <LeadCaptureForm className="mt-6" />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="space-y-5">
              <Card className="border-slate-800 bg-slate-900/35">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Mail className="size-4 text-cyan-300" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={`mailto:${siteConfig.email}`} className="text-sm text-slate-300 hover:text-cyan-200">
                    {siteConfig.email}
                  </a>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/35">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Phone className="size-4 text-cyan-300" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300">{siteConfig.phone}</p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/35">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MapPin className="size-4 text-cyan-300" />
                    Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300">
                    UK-wide delivery. Remote-first implementation with optional onsite workshops.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
