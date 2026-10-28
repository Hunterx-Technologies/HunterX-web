import type { CSSProperties } from "react";
import { RANKS, TOTAL_LEVELS } from "@/config";
import { FIRST_RANK, LAST_RANK, LEVELS_PER_RANK } from "@/lib/ranks";
import { Chip } from "@/components/ui/chip";
import { Section } from "@/components/ui/section";
import { cn, pad2 } from "@/lib/utils";

/**
 * Progress ladder of all ranks. Vertical timeline on small screens, a rising
 * staircase of bars on large screens. Orange intensity grows with each rank.
 */
export function Ranks() {
  return (
    <Section
      id="ranks"
      number={2}
      eyebrow="Ranks"
      title={
        <>
          {TOTAL_LEVELS} levels. {RANKS.length} ranks.{" "}
          <span className="text-primary-text">One climb.</span>
        </>
      }
      description={`Every ${LEVELS_PER_RANK} levels you reach a new rank. Start as ${FIRST_RANK.name} and work your way up to ${LAST_RANK.name}.`}
    >
      <div className="mb-10 flex flex-wrap gap-2" data-reveal>
        <Chip tone="accent">{TOTAL_LEVELS} levels</Chip>
        <Chip>{RANKS.length} ranks</Chip>
        <Chip>{LEVELS_PER_RANK} levels per rank</Chip>
      </div>

      {/* Effects (globals.css, "Ranks ladder"): bars grow in one after another
          when the ladder scrolls into view, glow on hover, and the top rank
          has a slow shimmer. All of it is off for reduced motion. */}
      <ol
        aria-label="Ranks from lowest to highest"
        data-reveal-group
        className="rank-ladder relative flex flex-col gap-3 lg:grid lg:h-[380px] lg:grid-cols-10 lg:items-end lg:gap-3"
      >
        {/* Timeline rail (small screens) */}
        <span
          aria-hidden="true"
          className="rank-rail absolute top-3 bottom-3 left-[19px] w-px bg-gradient-to-b from-border via-primary/50 to-primary lg:hidden"
        />
        {RANKS.map((rank, index) => {
          const strength = (index + 1) / RANKS.length;
          const isTop = index === RANKS.length - 1;
          return (
            <li
              key={rank.name}
              style={
                {
                  "--i": index,
                  "--h": `${28 + strength * 72}%`,
                  // Orange strength: subtler on the short mobile rows so the
                  // level text keeps AA contrast.
                  "--s-sm": `${Math.round(6 + strength * 22)}%`,
                  "--s-lg": `${Math.round(10 + strength * 55)}%`,
                } as CSSProperties
              }
              className="relative flex items-center gap-4 [--s:var(--s-sm)] lg:h-[var(--h)] lg:flex-col lg:items-stretch lg:gap-0 lg:[--s:var(--s-lg)]"
            >
              {/* Node on the rail (small screens) */}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold lg:hidden",
                  isTop
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card-solid text-primary-text",
                )}
              >
                {pad2(rank.number)}
              </span>

              <div
                className={cn(
                  "rank-bar group/bar relative flex flex-1 items-center justify-between gap-3 overflow-hidden rounded-xl glass px-4 py-3",
                  "transition-[border-color,box-shadow,transform] duration-300 hover:border-primary/70 hover:shadow-[0_0_40px_-12px_var(--glow)] motion-safe:hover:-translate-y-1",
                  "lg:flex-col lg:items-start lg:justify-end lg:rounded-2xl lg:p-3",
                  isTop &&
                    "rank-apex border-primary/70 shadow-[0_0_40px_-10px_var(--glow)]",
                )}
                style={{
                  backgroundImage:
                    "linear-gradient(to top, color-mix(in srgb, var(--brand) var(--s), transparent), transparent)",
                }}
              >
                {/* Stronger orange wash, faded in on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-primary/35 to-transparent opacity-0 transition-opacity duration-300 group-hover/bar:opacity-100"
                />
                <span className="rank-label relative hidden font-mono text-xs font-bold text-primary-text lg:block">
                  {pad2(rank.number)}
                </span>
                <span className="rank-label relative font-semibold tracking-tight lg:mt-1 lg:text-sm xl:text-base">
                  {rank.name}
                </span>
                <span className="rank-label relative text-xs text-foreground/80">
                  Lv {rank.levels}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
