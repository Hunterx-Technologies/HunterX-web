import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLElement> & {
  /** Adds the orange hover border and lift. */
  interactive?: boolean;
  as?: "div" | "li" | "article" | "section";
};

/** Glass card: translucent surface, hairline border, backdrop blur. */
export function Card({
  className,
  interactive = false,
  as = "div",
  ...props
}: CardProps) {
  const Tag: ElementType = as;
  return (
    <Tag
      className={cn(
        "relative rounded-2xl glass p-6 sm:p-7",
        interactive &&
          "transition-[border-color,transform,box-shadow] duration-300 hover:border-primary-text/50 hover:shadow-[0_20px_60px_-30px_var(--glow)] motion-safe:hover:-translate-y-1",
        className,
      )}
      {...props}
    />
  );
}
