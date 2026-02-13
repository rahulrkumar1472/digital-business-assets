import { MotionReveal } from "@/components/marketing/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProofCardProps = {
  title: string;
  before: string;
  after: string;
  changed: readonly string[];
  metric: string;
  delay?: number;
};

export function ProofCard({ title, before, after, changed, metric, delay = 0 }: ProofCardProps) {
  return (
    <MotionReveal delay={delay}>
      <Card className="h-full border-slate-800/90 bg-slate-900/45 py-0">
        <CardHeader className="space-y-3 border-b border-slate-800/85 py-5">
          <Badge variant="outline" className="w-fit border-cyan-500/45 bg-cyan-500/10 text-cyan-200">Proof format</Badge>
          <CardTitle className="text-2xl text-white">{title}</CardTitle>
          <p className="text-xs text-slate-400">{metric}</p>
        </CardHeader>
        <CardContent className="space-y-4 py-5 text-sm">
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">Before</p>
            <p className="mt-1 text-slate-200">{before}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">After</p>
            <p className="mt-1 text-cyan-200">{after}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">What changed</p>
            <ul className="mt-2 space-y-1.5 text-slate-300">
              {changed.map((item) => (
                <li key={item} className="list-disc pl-1 marker:text-cyan-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </MotionReveal>
  );
}
