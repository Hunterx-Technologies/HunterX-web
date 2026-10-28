import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";

/** Slim vertical tab fixed to the right edge on large screens. */
export function SideTab() {
  return (
    <Link
      href="/#download"
      data-site-chrome
      className="fixed top-1/2 right-0 z-30 hidden -translate-y-1/2 items-center gap-2 rounded-l-xl border-r-0 glass px-2.5 py-4 text-xs font-semibold tracking-[0.2em] text-foreground uppercase transition-colors [writing-mode:vertical-rl] hover:text-primary-text lg:flex"
    >
      <ArrowDownToLine
        aria-hidden="true"
        className="size-4 rotate-90 text-primary-text"
      />
      Get the app
    </Link>
  );
}
