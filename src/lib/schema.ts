import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/hero.jpg"),
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
