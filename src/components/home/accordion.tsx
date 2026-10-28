"use client";

import { Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AccordionItem = { question: string; answer: ReactNode };

/**
 * Accessible accordion (WAI-ARIA pattern): each question is a button with
 * aria-expanded/aria-controls inside a heading; the answer is a labelled
 * region. Closed panels are `inert`, so they are skipped by keyboard and
 * screen readers while still animating height with CSS.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y overflow-hidden rounded-2xl glass">
      {items.map((item, i) => {
        const open = openIndex === i;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold transition-colors hover:text-primary-text focus-visible:-outline-offset-2 sm:text-lg"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,color] duration-300 motion-reduce:transition-none",
                    open &&
                      "rotate-45 border-primary bg-primary text-primary-foreground",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-muted-foreground [&_p+p]:mt-3">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
