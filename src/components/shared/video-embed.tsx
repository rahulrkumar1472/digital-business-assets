"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

function toEmbedUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      const id =
        url.hostname.includes("youtu.be")
          ? url.pathname.replace("/", "")
          : url.searchParams.get("v");

      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

type VideoEmbedProps = {
  defaultUrl: string;
};

export function VideoEmbed({ defaultUrl }: VideoEmbedProps) {
  const [videoUrl, setVideoUrl] = useState(defaultUrl);
  const embedUrl = useMemo(() => toEmbedUrl(videoUrl), [videoUrl]);

  return (
    <div className="space-y-4">
      <label
        htmlFor="video-url"
        className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase"
      >
        YouTube or Vimeo URL
      </label>
      <Input
        id="video-url"
        value={videoUrl}
        onChange={(event) => setVideoUrl(event.target.value)}
        className="border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500"
      />
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Digital Business Assets video"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
            Enter a valid YouTube or Vimeo URL to preview the embed.
          </div>
        )}
      </div>
    </div>
  );
}
