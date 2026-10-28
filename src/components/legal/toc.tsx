"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * A heading above this line (px from the top) counts as "passed". Linked
 * headings land at html { scroll-padding-top: 5rem } (80px), below the
 * 64px sticky header, so this leaves room for rounding and smooth scroll.
 */
const ACTIVE_OFFSET = 160;

/**
 * Tracks which section is being read. The observer's top edge sits on the
 * ACTIVE_OFFSET line, so it fires exactly when a heading crosses that line
 * in either direction. The active section is the last heading above the
 * line, or the last section once the end of the document is visible (short
 * final sections can never reach the top of the screen).
 */
function useActiveSection(items: TocItem[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0 || !("IntersectionObserver" in window)) return;

    const last = headings[headings.length - 1];
    const end = last.closest("article")?.lastElementChild ?? null;

    const update = () => {
      if (end && end.getBoundingClientRect().bottom <= window.innerHeight) {
        // At the very end, prefer the section the reader jumped to (if it
        // is on screen) over simply the last one.
        const target = headings.find(
          (heading) => `#${heading.id}` === decodeURIComponent(location.hash),
        );
        const top = target?.getBoundingClientRect().top;
        const onScreen =
          top !== undefined && top >= 0 && top < window.innerHeight;
        setActive(target && onScreen ? target.id : last.id);
        return;
      }
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          current = heading.id;
        } else {
          break;
        }
      }
      setActive(current);
    };

    const observer = new IntersectionObserver(update, {
      rootMargin: `-${ACTIVE_OFFSET}px 0px 0px 0px`,
    });
    headings.forEach((heading) => observer.observe(heading));
    // The end marker uses its own observer: it matters across the whole viewport.
    const endObserver = new IntersectionObserver(update);
    if (end) endObserver.observe(end);
    // Re-check once a (smooth) scroll settles: crossings observed mid-scroll
    // can be stale by the time the page comes to rest.
    window.addEventListener("scrollend", update);
    window.addEventListener("hashchange", update);
    return () => {
      observer.disconnect();
      endObserver.disconnect();
      window.removeEventListener("scrollend", update);
      window.removeEventListener("hashchange", update);
    };
  }, [items]);

  return active;
}

/** Numbered section links. Used in the desktop sidebar and the mobile card. */
export function TocLinks({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items);

  return (
    <ol className="space-y-0.5 text-sm">
      {items.map((item) => {
        const match = /^(\d+)\.\s+(.*)$/.exec(item.text);
        const number = match?.[1];
        const label = match?.[2] ?? item.text;
        const isActive = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              onClick={(event) =>
                // On mobile the list sits in a <details>; close it after a pick.
                event.currentTarget.closest("details")?.removeAttribute("open")
              }
              className={cn(
                "flex gap-3 rounded-r-md border-l-2 py-1.5 pr-2 pl-3 transition-colors",
                isActive
                  ? "border-primary bg-primary/10 font-medium text-primary-text"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {number && (
                <span className="w-5 shrink-0 text-right font-mono text-xs leading-5 tabular-nums">
                  {number}
                </span>
              )}
              <span>{label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
