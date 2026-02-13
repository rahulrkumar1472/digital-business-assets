import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/media/hero-ai.jpg"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: "GB",
    sameAs: [siteConfig.socials.linkedin, siteConfig.socials.x],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-GB",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

type ServiceSchemaInput = {
  name: string;
  description: string;
  slug: string;
  offer: string;
};

export function serviceSchema({
  name,
  description,
  slug,
  offer,
}: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    provider: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "GBP",
        valueAddedTaxIncluded: false,
      },
      description: offer,
      url: absoluteUrl(`/services/${slug}`),
    },
    url: absoluteUrl(`/services/${slug}`),
  };
}

type FaqSchemaItem = {
  question: string;
  answer: string;
};

export function faqSchema(items: FaqSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

type ArticleSchemaInput = {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  image?: string;
  author?: string;
};

export function articleSchema({
  title,
  description,
  path,
  publishedAt,
  image = "/media/blog-cover-placeholder.jpg",
  author = "Digital Business Assets Team",
}: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/media/hero-ai.jpg"),
      },
    },
    image: [absoluteUrl(image)],
    mainEntityOfPage: absoluteUrl(path),
    url: absoluteUrl(path),
  };
}

type BreadcrumbNode = {
  name: string;
  path: string;
};

export function breadcrumbSchema(items: BreadcrumbNode[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
