"use client";

import { AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import type { DeletionErrorCode } from "@/lib/account-deletion-api";
import { COMPANY } from "@/config";
import { cn } from "@/lib/utils";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const CODE_PATTERN = /^\d{6}$/;
export const MAX_CODE_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 30;

export const inputClass =
  "h-12 w-full rounded-xl border bg-background/60 px-4 text-base text-foreground placeholder:text-muted-foreground/70 " +
  "transition-colors focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
  "disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-primary-text";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(inputClass, className)} {...props} />;
});

/**
 * Heading for each step. It receives focus when the step appears, so screen
 * reader and keyboard users land on the new content.
 */
export function StepHeading({
  children,
  autoFocus = true,
  className,
}: {
  children: ReactNode;
  autoFocus?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  return (
    <h3
      ref={ref}
      tabIndex={-1}
      className={cn(
        "text-xl font-semibold tracking-tight outline-none",
        className,
      )}
    >
      {children}
    </h3>
  );
}

type Tone = "error" | "info" | "success";

/** Message box. Errors use role="alert"; other messages role="status". */
export function Notice({
  tone = "info",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  const Icon =
    tone === "error" ? AlertTriangle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3 text-sm",
        // Brand palette only: errors are orange-bordered with a warning icon,
        // info is neutral; the role (alert/status) tells assistive tech apart.
        tone === "error" &&
          "border-primary-text/70 bg-primary/10 text-foreground",
        tone === "info" && "bg-muted text-foreground",
        tone === "success" &&
          "border-primary-text/40 bg-primary/10 text-foreground",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "info" ? "text-muted-foreground" : "text-primary-text",
        )}
      />
      <div>{children}</div>
    </div>
  );
}

/** Live region that is always in the DOM, so changes are announced. */
export function LiveError({ message }: { message: string | null }) {
  return (
    <div aria-live="assertive" aria-atomic="true">
      {message && <Notice tone="error">{message}</Notice>}
    </div>
  );
}

export function SubmitButton({
  busy,
  disabled,
  children,
  busyLabel = "Please wait…",
}: {
  busy: boolean;
  disabled?: boolean;
  children: ReactNode;
  busyLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      aria-busy={busy}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {busy && (
        <Loader2
          aria-hidden="true"
          className="size-4 animate-spin motion-reduce:animate-none"
        />
      )}
      {busy ? busyLabel : children}
    </button>
  );
}

export function TextButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded text-sm font-medium text-primary-text underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Honeypot: a normal-looking text field kept off screen and out of the tab
 * order. People never fill it; simple bots do. Its value is never sent.
 */
export function Honeypot({ name = "website" }: { name?: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[10000px] h-px w-px overflow-hidden"
    >
      <label>
        Leave this field empty
        <input
          type="text"
          name={name}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}

export function honeypotFilled(form: HTMLFormElement, name = "website") {
  const field = form.elements.namedItem(name);
  return field instanceof HTMLInputElement && field.value.trim() !== "";
}

/**
 * Counts down `seconds` from `startedAt` (ms timestamp, e.g. when a code was
 * sent) and again after each `start()`. `remaining` is 0 when ready.
 */
export function useCooldown(seconds: number, startedAt = 0) {
  const [until, setUntil] = useState(
    startedAt ? startedAt + seconds * 1000 : 0,
  );
  const [now, setNow] = useState(startedAt);

  useEffect(() => {
    if (until === 0) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= until) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [until]);

  return {
    remaining: Math.max(0, Math.ceil((until - now) / 1000)),
    start() {
      const t = Date.now();
      setNow(t);
      setUntil(t + seconds * 1000);
    },
  };
}

const HELP = `If this keeps happening, email ${COMPANY.email}.`;

/** Human-readable messages for API errors. */
export function messageFor(code: DeletionErrorCode): string {
  switch (code) {
    case "invalid_code":
      return "That code is not correct. Check the latest email from us and try again.";
    case "expired_code":
      return "That code has expired. Request a new code and try again.";
    case "too_many_attempts":
      return "Too many incorrect attempts. Request a new code to try again.";
    case "invalid_token":
    case "expired_token":
      return "This deletion link is invalid or has expired.";
    case "no_pending_deletion":
      return "We couldn't find a pending deletion for this account, or the code is not correct.";
    case "rate_limited":
      return "Too many requests. Please wait a few minutes and try again.";
    case "network":
      return `We couldn't reach our servers. Check your connection and try again. ${HELP}`;
    case "not_configured":
      return `Online deletion is temporarily unavailable. Please email ${COMPANY.email} instead.`;
    default:
      return `Something went wrong. Please try again. ${HELP}`;
  }
}
