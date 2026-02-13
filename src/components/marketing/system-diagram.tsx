import { BarChart3, Bot, Globe, Megaphone, Network, Search, Workflow } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SystemNode = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number;
  y: number;
};

const nodes: SystemNode[] = [
  { id: "website", label: "Website", icon: Globe, x: 12, y: 18 },
  { id: "ads", label: "Ads", icon: Megaphone, x: 33, y: 8 },
  { id: "seo", label: "SEO", icon: Search, x: 56, y: 8 },
  { id: "crm", label: "CRM", icon: Network, x: 78, y: 18 },
  { id: "automations", label: "Automations", icon: Workflow, x: 78, y: 60 },
  { id: "reporting", label: "Reporting", icon: BarChart3, x: 56, y: 72 },
  { id: "assistant", label: "AI Assistant", icon: Bot, x: 33, y: 72 },
];

const links = [
  ["website", "crm"],
  ["ads", "crm"],
  ["seo", "website"],
  ["crm", "automations"],
  ["automations", "reporting"],
  ["assistant", "crm"],
  ["assistant", "automations"],
] as const;

function getNode(id: string) {
  return nodes.find((node) => node.id === id);
}

export function SystemDiagram() {
  return (
    <MotionReveal>
      <Card className="border-slate-800/90 bg-slate-900/45 py-0">
        <CardHeader className="space-y-3 border-b border-slate-800/85 py-5">
          <Badge variant="outline" className="w-fit border-cyan-500/45 bg-cyan-500/10 text-cyan-200">Business OS map</Badge>
          <CardTitle className="text-3xl text-white md:text-4xl">How your modules connect</CardTitle>
          <p className="max-w-3xl text-sm text-slate-300">You do not buy random tactics. You install a connected system that turns attention into booked revenue.</p>
        </CardHeader>
        <CardContent className="py-6">
          <div className="relative hidden aspect-[16/8] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/55 md:block">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {links.map(([from, to]) => {
                const source = getNode(from);
                const target = getNode(to);
                if (!source || !target) {
                  return null;
                }

                return (
                  <line
                    key={`${from}-${to}`}
                    x1={source.x + 6}
                    y1={source.y + 6}
                    x2={target.x + 6}
                    y2={target.y + 6}
                    stroke="rgba(56,189,248,0.35)"
                    strokeWidth="0.7"
                    strokeDasharray="1.6 1.2"
                  />
                );
              })}
            </svg>

            {nodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.id}
                  className="absolute flex h-16 w-28 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900/85 p-2 text-center shadow-[0_14px_30px_rgba(2,6,23,0.45)]"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <Icon className="size-4 text-cyan-300" />
                  <p className="mt-1 text-xs font-medium text-slate-100">{node.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-2 md:hidden">
            {nodes.map((node) => (
              <div key={node.id} className="rounded-lg border border-slate-800 bg-slate-950/65 px-3 py-2 text-sm text-slate-200">
                {node.label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MotionReveal>
  );
}
