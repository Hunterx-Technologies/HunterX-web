"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds .is-revealed to [data-reveal] elements as they scroll into view.
 * [data-reveal-group] gets the same class but no default fade, so a
 * component can animate its children its own way (see the ranks ladder).
 * The hidden starting state lives in globals.css and only applies when JS is
 * running and reduced motion is off, so content is never stuck invisible.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not(.is-revealed), [data-reveal-group]:not(.is-revealed)",
      ),
    );
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
