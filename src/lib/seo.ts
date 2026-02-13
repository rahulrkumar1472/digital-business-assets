import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/metadata-registry";
import { siteConfig } from "@/lib/site";

type MetadataInput = {
  title?: string;
  description?: string;
  path: string;
  image?: string;
};

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  image,
}: MetadataInput): Metadata {
  const resolved = getRouteMetadata(path, {
    title,
    description,
    image,
  });

  const url = absoluteUrl(resolved.path);
  const imageUrl = absoluteUrl(resolved.image || "/media/hero-ai.jpg");

  return {
    metadataBase: new URL(siteConfig.url),
    title: resolved.title,
    description: resolved.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolved.title,
      description: resolved.description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_GB",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: resolved.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolved.title,
      description: resolved.description,
      images: [imageUrl],
    },
  };
}
