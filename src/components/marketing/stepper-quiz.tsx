"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Stage = {
  value: string;
  label: string;
  summary: string;
  bundleName: string;
  bundle: string[];
  timeline: string;
};

const stages: Stage[] = [
  {
    value: "no-website",
    label: "No website",
    summary: "You need a professional online presence before anything else can scale.",
    bundleName: "Launch Bundle",
    bundle: ["Website Starter Build", "Booking System Setup", "SEO Upgrade Pack"],
    timeline: "First wins in 72 hours",
  },
  {
    value: "no-leads",
    label: "Website, no leads",
    summary: "Your site exists, but your visibility and offer-to-action flow are leaking demand.",
    bundleName: "Visibility Bundle",
    bundle: ["SEO Upgrade Pack", "Ads Launch Pack", "Website Pro Build"],
    timeline: "First wins in 7-14 days",
  },
  {
    value: "no-bookings",
    label: "Leads, no bookings",
    summary: "You get enquiries, but follow-up and booking friction are costing you sales.",
    bundleName: "Conversion Bundle",
    bundle: ["CRM Setup", "Follow-up Automation", "Booking System Setup"],
    timeline: "First wins in 7 days",
  },
  {
    value: "low-repeat",
    label: "Bookings, low repeat",
    summary: "You close first deals, but repeat business and referrals are under-managed.",
    bundleName: "Retention Bundle",
    bundle: ["WhatsApp Business Setup", "AI Chatbot Install", "Follow-up Automation"],
    timeline: "First wins in 14-30 days",
  },
];

export function StepperQuiz() {
  const defaultStage = useMemo(() => stages[0]?.value ?? "no-website", []);

  return (
    <Card className="border-slate-800/90 bg-slate-900/45 py-0">
      <CardHeader className="space-y-3 border-b border-slate-800/85 py-5">
        <Badge variant="outline" className="w-fit border-cyan-500/45 bg-cyan-500/10 text-cyan-200">Interactive stepper</Badge>
        <CardTitle className="text-3xl text-white md:text-4xl">Where are you right now?</CardTitle>
        <p className="max-w-3xl text-sm text-slate-300">Pick your current stage and see what you should install next.</p>
      </CardHeader>

      <CardContent className="py-6">
        <Tabs defaultValue={defaultStage} className="w-full gap-4">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-4">
            {stages.map((stage) => (
              <TabsTrigger
                key={stage.value}
                value={stage.value}
                className="h-auto min-h-[3rem] border border-slate-700 bg-slate-950/55 px-2 py-2 text-xs text-slate-200 data-[state=active]:border-cyan-400/50 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-100"
              >
                {stage.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {stages.map((stage) => (
            <TabsContent key={stage.value} value={stage.value}>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/55 p-5">
                <p className="text-sm text-slate-200">{stage.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-cyan-500/45 bg-cyan-500/10 text-cyan-200">{stage.bundleName}</Badge>
                  <span className="text-xs text-slate-400">{stage.timeline}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {stage.bundle.map((item) => (
                    <li key={item} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-slate-800/85 py-4 sm:flex-row">
        <Button asChild className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200 sm:w-auto">
          <Link href="/services">
            See recommended services
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800 sm:w-auto">
          <Link href="/pricing">View pricing</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
