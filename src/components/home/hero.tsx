import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { RANKS, TOTAL_LEVELS } from "@/config";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      {/* Faint grid and a soft orange glow behind the headline. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid" />
      <div
        aria-hidden="true"
        className="absolute top-[8%] left-1/2 -z-10 h-[420px] w-[min(900px,120vw)] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, var(--glow), transparent)",
        }}
      />

      <Container className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-24 text-center">
        <p
          data-reveal
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase"
        >
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--brand)]"
          />
          Gamified fitness &amp; habits
        </p>

        <h1
          id="hero-heading"
          data-reveal
          style={{ "--reveal-delay": "80ms" } as CSSProperties}
          className="mt-8 max-w-5xl text-gradient pb-2 text-[clamp(3rem,11vw,7.5rem)] leading-[0.95] font-black tracking-[-0.045em] text-balance"
        >
          Level up your real life
        </h1>

        <p
          data-reveal
          style={{ "--reveal-delay": "160ms" } as CSSProperties}
          className="mt-7 max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl"
        >
          Complete daily{" "}
          <span className="font-semibold text-primary-text">quests</span>, earn{" "}
          <span className="font-semibold text-primary-text">XP</span> and climb{" "}
          <span className="font-semibold text-primary-text">
            {TOTAL_LEVELS} levels across {RANKS.length} ranks
          </span>
          .
        </p>

        <div
          data-reveal
          style={{ "--reveal-delay": "240ms" } as CSSProperties}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="#download" className={buttonVariants({ size: "lg" })}>
            Download
            <ArrowDown aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href="#how-it-works"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            How it works
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <a
          href="#how-it-works"
          className="mt-16 hidden flex-col items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground sm:flex"
        >
          <span
            aria-hidden="true"
            className="flex h-10 w-6 justify-center rounded-full border-2 border-muted-foreground/50 pt-2"
          >
            <span className="hx-scroll-dot block size-1.5 rounded-full bg-primary" />
          </span>
          Scroll
        </a>
      </Container>
    </section>
  );
}
