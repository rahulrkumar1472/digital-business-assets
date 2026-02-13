import Link from "next/link";
import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/types/content";

type FAQProps = {
  items: Array<FaqItem | { question: string; answer: ReactNode }>;
};

const markdownLinkPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;

function renderAnswer(answer: ReactNode) {
  if (typeof answer !== "string") {
    return answer;
  }

  const matches = [...answer.matchAll(markdownLinkPattern)];
  if (!matches.length) {
    return answer;
  }

  const fragments: ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const [full, label, href] = match;
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      fragments.push(answer.slice(lastIndex, matchIndex));
    }

    fragments.push(
      <Link key={`${href}-${index}`} href={href} className="text-cyan-300 hover:text-cyan-200">
        {label}
      </Link>,
    );

    lastIndex = matchIndex + full.length;
  });

  if (lastIndex < answer.length) {
    fragments.push(answer.slice(lastIndex));
  }

  return <>{fragments}</>;
}

export function FAQ({ items }: FAQProps) {
  return (
    <Accordion type="single" collapsible className="rounded-3xl border border-slate-800 bg-slate-900/40 px-6">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`faq-${index}`}>
          <AccordionTrigger className="text-left text-base text-slate-100 hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-slate-300">{renderAnswer(item.answer)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
