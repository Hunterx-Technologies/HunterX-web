"use client";

import { useEffect, useRef } from "react";
import { INTRO_SESSION_KEY } from "@/lib/theme";

const WORDS = ["LEVEL UP", "COMPLETE QUESTS", "EARN XP", "RANK UP"];
const DURATION_MS = 1000;

/**
 * About one second loading intro, shown once per session on the home page.
 * Timing and fade-out are pure CSS (globals.css), so the overlay always goes
 * away. The <head> boot script hides it when already seen this session or
 * when the user prefers reduced motion. JS only drives the percentage.
 */
export function Intro() {
  const percentRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.hasAttribute("data-intro-seen")) return;

    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // Storage unavailable: the intro may show again on the next visit.
    }

    let frame = 0;
    const start = performance.now() + 100; // matches the CSS bar delay
    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - start) / DURATION_MS, 0), 1);
      const eased =
        progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(eased * 100)}%`;
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // Once the CSS fade finishes, hide it for later client-side visits.
    const node = rootRef.current;
    const onEnd = (event: AnimationEvent) => {
      if (event.animationName === "hx-intro-out") {
        html.setAttribute("data-intro-seen", "");
      }
    };
    node?.addEventListener("animationend", onEnd);

    return () => {
      cancelAnimationFrame(frame);
      node?.removeEventListener("animationend", onEnd);
    };
  }, []);

  const line = WORDS.join("  •  ") + "  •  ";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="hx-intro fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-6 opacity-[0.07] select-none">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="hx-marquee flex w-max text-6xl font-black tracking-tight whitespace-pre sm:text-8xl"
            style={{ animationDirection: row % 2 ? "reverse" : "normal" }}
          >
            <span>{line.repeat(3)}</span>
            <span>{line.repeat(3)}</span>
          </div>
        ))}
      </div>

      <div className="relative flex w-64 items-center gap-4 rounded-full glass px-5 py-3">
        <span className="text-sm font-extrabold tracking-tight">
          Hunter<span className="text-primary-text">X</span>
        </span>
        <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <span className="hx-intro-bar absolute inset-0 rounded-full bg-primary" />
        </span>
        <span
          ref={percentRef}
          className="w-10 text-right font-mono text-xs text-muted-foreground tabular-nums"
        >
          0%
        </span>
      </div>
    </div>
  );
}
