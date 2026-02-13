"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { getBreadcrumbItems } from "@/lib/breadcrumbs/map";
import { absoluteUrl } from "@/lib/seo";

export function BreadcrumbSchema() {
  const pathname = usePathname() || "/";
  const breadcrumbData = useMemo(() => {
    const items = getBreadcrumbItems(pathname);

    const list = items.map((item, index) => {
      const resolvedPath = index === 0 ? "/" : item.href || pathname;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: absoluteUrl(resolvedPath),
      };
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: list,
    };
  }, [pathname]);

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />;
}
