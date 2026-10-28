"use client";

import { X } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { ZEN_STORAGE_KEY } from "@/lib/theme";

/**
 * Zen Mode for legal pages: hides the site header, footer and contents list
 * and shows the text in a larger, narrower column. State lives on
 * <html data-zen> (set before paint by the boot script when the saved choice
 * is on), and the choice is remembered in localStorage when available.
 */

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

const getSnapshot = () => document.documentElement.hasAttribute("data-zen");
const getServerSnapshot = () => false;

function setZen(on: boolean, persist = true) {
  document.documentElement.toggleAttribute("data-zen", on);
  if (persist) {
    try {
      localStorage.setItem(ZEN_STORAGE_KEY, on ? "1" : "0");
    } catch {
      // Storage unavailable: Zen Mode still works for this visit.
    }
  }
  listeners.forEach((listener) => listener());
}

function useZen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** "Read in Zen Mode" button for the top bar. */
export function ZenButton({ className }: { className?: string }) {
  const zen = useZen();
  return (
    <button
      type="button"
      onClick={() => setZen(!zen)}
      aria-pressed={zen}
      className={className}
    >
      Read in Zen Mode
    </button>
  );
}

/**
 * Restores the saved choice, handles Esc, cleans up when leaving the page,
 * and shows the floating "Exit Zen Mode" button while Zen Mode is on.
 */
export function ZenController() {
  const zen = useZen();

  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem(ZEN_STORAGE_KEY) === "1";
    } catch {
      saved = false;
    }
    setZen(saved, false);
    // Leaving the legal page must never leave the site chrome hidden.
    return () => setZen(false, false);
  }, []);

  useEffect(() => {
    if (!zen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zen]);

  if (!zen) return null;

  return (
    <button
      type="button"
      onClick={() => setZen(false)}
      data-print-hide
      className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary-text/60 hover:text-primary-text"
    >
      <X aria-hidden="true" className="size-4" />
      Exit Zen Mode
      <span className="sr-only"> (or press Escape)</span>
    </button>
  );
}
