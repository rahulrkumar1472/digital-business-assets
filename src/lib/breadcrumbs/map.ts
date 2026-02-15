import { blogPosts } from "@/content/blog/posts";
import { caseStudies, industries, services } from "@/data";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function findServiceTitle(slug: string) {
  return services.find((service) => service.slug === slug)?.title;
}

function findIndustryTitle(slug: string) {
  return industries.find((industry) => industry.slug === slug)?.name;
}

function findCaseStudyTitle(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug)?.title;
}

function findBlogTitle(slug: string) {
  return blogPosts.find((post) => post.slug === slug)?.title;
}

export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  if (!pathname || pathname === "/") {
    return [{ label: "Home" }];
  }

  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "services") {
    items.push({ label: "Services", href: "/services" });
    if (segments[1]) {
      items.push({ label: findServiceTitle(segments[1]) || titleFromSlug(segments[1]) });
    }
    return items;
  }

  if (segments[0] === "industries") {
    items.push({ label: "Industries", href: "/industries" });
    if (segments[1]) {
      items.push({ label: findIndustryTitle(segments[1]) || titleFromSlug(segments[1]) });
    }
    return items;
  }

  if (segments[0] === "tools") {
    items.push({ label: "Tools", href: "/tools" });
    if (segments[1] === "website-audit") {
      items.push({ label: "Website Audit", href: "/tools/website-audit" });
      if (segments[2] === "start") {
        items.push({ label: "Start" });
      } else if (segments[2] === "results") {
        items.push({ label: "Results" });
      } else if (segments[2] === "pdf") {
        items.push({ label: "PDF" });
      }
      return items;
    }

    if (segments[1]) {
      items.push({ label: titleFromSlug(segments[1]) });
    }
    return items;
  }

  if (segments[0] === "pricing") {
    items.push({ label: "Pricing" });
    return items;
  }

  if (segments[0] === "bespoke-plan") {
    items.push({ label: "Bespoke Plan" });
    return items;
  }

  if (segments[0] === "signup") {
    items.push({ label: "Sign Up" });
    return items;
  }

  if (segments[0] === "login") {
    items.push({ label: "Login" });
    return items;
  }

  if (segments[0] === "app") {
    items.push({ label: "Dashboard", href: "/app" });
    if (segments[1]) {
      items.push({ label: titleFromSlug(segments[1]) });
    }
    return items;
  }

  if (segments[0] === "case-studies") {
    items.push({ label: "Case Studies", href: "/case-studies" });
    if (segments[1]) {
      items.push({ label: findCaseStudyTitle(segments[1]) || titleFromSlug(segments[1]) });
    }
    return items;
  }

  if (segments[0] === "blog") {
    items.push({ label: "Blog", href: "/blog" });
    if (segments[1]) {
      items.push({ label: findBlogTitle(segments[1]) || titleFromSlug(segments[1]) });
    }
    return items;
  }

  const staticLabelMap: Record<string, string> = {
    about: "About",
    contact: "Contact",
    book: "Book",
    "growth-simulator": "Growth Simulator",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
  };

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    items.push({
      label: staticLabelMap[segment] || titleFromSlug(segment),
      href: isLast ? undefined : href,
    });
  }

  return items;
}
