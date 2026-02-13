export const siteConfig = {
  name: "Digital Business Assets",
  legalName: "Digital Business Assets Ltd",
  url: "https://digitalbusinessassets.co.uk",
  description:
    "AI revenue systems for UK businesses: websites, SEO/AEO, automations, chatbots, CRM, missed-call recovery, and reporting from £99/month.",
  email: "hello@digitalbusinessassets.co.uk",
  phone: "+44 20 3000 0000",
  location: "United Kingdom",
  socials: {
    linkedin: "https://www.linkedin.com/company/digital-business-assets",
    x: "https://x.com/digitalbizassets",
  },
};

export const primaryNavigation = [
  { label: "Services", href: "/services" },
  { label: "Growth Simulator", href: "/growth-simulator" },
  { label: "Website Audit", href: "/website-audit" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Book a Call", href: "/book" },
] as const;

export const legalNavigation = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
] as const;
