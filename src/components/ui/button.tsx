import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring " +
  "disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-[0.98]";

const variants: Record<ButtonVariant, string> = {
  // Orange with black text (white on orange fails contrast).
  primary:
    "bg-primary text-primary-foreground shadow-[0_0_0_1px_var(--brand),0_8px_30px_-8px_var(--glow)] " +
    "hover:brightness-110 hover:shadow-[0_0_0_1px_var(--brand),0_10px_40px_-6px_var(--glow)]",
  secondary:
    "glass text-foreground hover:border-primary-text/60 hover:bg-muted",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-8 text-base",
};

/** Class names for a button. Use on <a>/<Link> to make a link look like one. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
