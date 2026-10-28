"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Floating "back to top" button for mobile and tablet, shown after scrolling. */
export function BackToTop({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setVisible(window.scrollY > 600));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <a
      href={`#${targetId}`}
      aria-label="Back to top"
      data-print-hide
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed right-5 bottom-5 z-40 inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_var(--glow)] transition-[opacity,transform] duration-300 lg:hidden",
        visible
          ? "opacity-100"
          : "pointer-events-none translate-y-3 opacity-0 motion-reduce:translate-y-0",
      )}
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </a>
  );
}
