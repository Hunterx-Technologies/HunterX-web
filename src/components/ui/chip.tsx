import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "accent";
};

/** Small rounded tag. */
export function Chip({ className, tone = "neutral", ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "accent" &&
          "border-primary-text/40 bg-primary/10 text-primary-text",
        className,
      )}
      {...props}
    />
  );
}
