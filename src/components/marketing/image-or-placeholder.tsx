"use client";

import Image from "next/image";
import { useState } from "react";

import { ImagePlaceholder } from "@/components/marketing/image-placeholder";
import { cn } from "@/lib/utils";

type ImageOrPlaceholderProps = {
  src: string;
  alt: string;
  label: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function ImageOrPlaceholder({
  src,
  alt,
  label,
  className,
  imageClassName,
  sizes,
  priority = false,
}: ImageOrPlaceholderProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {failed ? (
        <ImagePlaceholder label={label} className="h-full w-full" />
      ) : (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            onError={() => setFailed(true)}
            className={cn("object-cover", imageClassName)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(34,211,238,0.18),rgba(15,23,42,0.68))]" />
        </>
      )}
    </div>
  );
}
