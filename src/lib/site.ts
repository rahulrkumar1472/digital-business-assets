export const siteConfig = {
  name: "Digital Business Assets",
  legalName: "Digital Business Assets Ltd",
  url: "https://digitalbusinessassets.co.uk",
  description:
    "Business OS for UK SMEs: get online in 72 hours or run a free website scan, then deploy revenue modules with measurable outcomes.",
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
  { label: "Industries", href: "/industries" },
  { label: "Tools", href: "/tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Dashboard", href: "/app" },
  { label: "Book a Call", href: "/book" },
] as const;

export const legalNavigation = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
] as const;
