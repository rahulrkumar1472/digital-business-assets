import type { FaqItem } from "@/types/content";

const markdownLinkPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;

export function faqToSchemaItems(items: FaqItem[]) {
  return items.map((item) => ({
    question: item.question,
    answer: item.answer.replace(markdownLinkPattern, "$1"),
  }));
}
