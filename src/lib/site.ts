export const siteConfig = {
  name: "Digital Business Assets",
  legalName: "Digital Business Assets Ltd",
  url: "https://digitalbusinessassets.co.uk",
  description:
    "AI-first digital agency helping UK SMEs launch high-converting websites, automation, and lead systems from £99/month.",
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
  { label: "Pricing", href: "/pricing" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalNavigation = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
] as const;
