import type { LucideIcon } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  title: string;
  strapline: string;
  shortDescription: string;
  longDescription: string;
  entryPrice: string;
  timeline: string;
  image: string;
  icon: LucideIcon;
  problems: string[];
  outcomes: string[];
  deliverables: string[];
  faqs: FaqItem[];
  caseStudySlugs: string[];
  industrySlugs: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  clientName: string;
  clientSector: string;
  location: string;
  coverImage: string;
  snapshot: string;
  challenge: string;
  approach: string[];
  outcomes: Array<{
    label: string;
    value: string;
  }>;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  serviceSlugs: string[];
  industrySlugs: string[];
};

export type Industry = {
  slug: string;
  name: string;
  audience: string;
  coverImage: string;
  summary: string;
  challenges: string[];
  opportunities: string[];
  recommendedServiceSlugs: string[];
  caseStudySlugs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
};
