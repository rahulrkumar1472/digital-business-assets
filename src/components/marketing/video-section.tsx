import { PlayCircle } from "lucide-react";

import { MotionReveal } from "@/components/marketing/motion-reveal";

function toEmbedUrl(url: string): string | null {
  const input = url.trim();
  if (!input) {
    return null;
  }

  try {
    const parsed = new URL(input);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

type VideoSectionProps = {
  title: string;
  description: string;
  videoUrl: string;
  points?: string[];
};

export function VideoSection({ title, description, videoUrl, points = [] }: VideoSectionProps) {
  const embedUrl = toEmbedUrl(videoUrl);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <MotionReveal>
        <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">Product demo</p>
        <h3 className="mt-3 text-3xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{description}</p>
        {points.length ? (
          <ul className="mt-5 space-y-2 text-sm text-slate-200">
            {points.map((point) => (
              <li key={point} className="list-disc pl-1 marker:text-cyan-300">
                {point}
              </li>
            ))}
          </ul>
        ) : null}
      </MotionReveal>
      <MotionReveal delay={0.08}>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[linear-gradient(160deg,rgba(56,189,248,0.12),rgba(15,23,42,0.9))] p-3">
          <div className="mb-2 flex items-center gap-2 px-2 text-xs text-slate-300">
            <PlayCircle className="size-3.5 text-cyan-300" />
            AI system walkthrough
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Add a valid YouTube or Vimeo URL
              </div>
            )}
          </div>
        </div>
      </MotionReveal>
    </div>
  );
}
