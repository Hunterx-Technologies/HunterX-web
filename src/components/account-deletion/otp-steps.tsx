"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { DeletionApiError, requestCode } from "@/lib/account-deletion-api";
import {
  CODE_PATTERN,
  EMAIL_PATTERN,
  Honeypot,
  Input,
  LiveError,
  MAX_CODE_ATTEMPTS,
  Notice,
  RESEND_COOLDOWN_SECONDS,
  StepHeading,
  SubmitButton,
  TextButton,
  honeypotFilled,
  messageFor,
  useCooldown,
} from "./form-parts";

type Purpose = "delete" | "cancel";

/** Errors that should stop the flow; anything else still shows the generic "sent" step. */
const BLOCKING_REQUEST_ERRORS = new Set([
  "network",
  "rate_limited",
  "not_configured",
]);

async function sendCode(email: string, purpose: Purpose) {
  try {
    await requestCode(email, purpose);
    return null;
  } catch (error) {
    const code = error instanceof DeletionApiError ? error.code : "unknown";
    // Never reveal whether an account exists: only connectivity-type
    // problems are shown; everything else looks like success.
    return BLOCKING_REQUEST_ERRORS.has(code) ? messageFor(code) : null;
  }
}

/** Step 1: ask for the email address and request a one-time code. */
export function EmailStep({
  purpose,
  heading,
  description,
  submitLabel,
  initialEmail = "",
  autoFocusHeading,
  onSent,
}: {
  purpose: Purpose;
  heading: string;
  description?: ReactNode;
  submitLabel: string;
  initialEmail?: string;
  autoFocusHeading: boolean;
  onSent: (email: string, sentAt: number) => void;
}) {
  const id = useId();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter a valid email address, for example name@example.com.");
      return;
    }
    setError(null);

    if (honeypotFilled(event.currentTarget)) {
      onSent(value, Date.now()); // Pretend success; send nothing.
      return;
    }

    setBusy(true);
    const problem = await sendCode(value, purpose);
    setBusy(false);
    if (problem) setError(problem);
    else onSent(value, Date.now());
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-5">
      <div>
        <StepHeading autoFocus={autoFocusHeading}>{heading}</StepHeading>
        {description && (
          <div className="mt-2 text-muted-foreground">{description}</div>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor={`${id}-email`} className="block text-sm font-medium">
          Email address
        </label>
        <Input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-email-hint`}
          placeholder="you@example.com"
        />
        <p id={`${id}-email-hint`} className="text-sm text-muted-foreground">
          Use the email address registered to your HunterX account.
        </p>
      </div>
      <Honeypot />
      <LiveError message={error} />
      <SubmitButton busy={busy} busyLabel="Sending code…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}

/**
 * Step 2: enter the 6-digit code (plus an optional confirmation checkbox).
 * Locks after MAX_CODE_ATTEMPTS wrong codes until a new code is requested.
 */
export function CodeStep<T>({
  purpose,
  email,
  sentAt,
  heading,
  confirmation,
  submitLabel,
  submit,
  onVerified,
  onChangeEmail,
}: {
  purpose: Purpose;
  email: string;
  sentAt: number;
  heading: string;
  /** Label for a required confirmation checkbox, or null for none. */
  confirmation: ReactNode | null;
  submitLabel: string;
  submit: (code: string) => Promise<T>;
  onVerified: (result: T) => void;
  onChangeEmail: () => void;
}) {
  const id = useId();
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [failed, setFailed] = useState(0);
  const [locked, setLocked] = useState(false);
  const cooldown = useCooldown(RESEND_COOLDOWN_SECONDS, sentAt);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;
    if (!CODE_PATTERN.test(code)) {
      setError("Enter the 6-digit code from the email.");
      return;
    }
    if (confirmation && !agreed) {
      setError("Tick the box to confirm before continuing.");
      return;
    }
    if (honeypotFilled(event.currentTarget)) return;

    setError(null);
    setStatus(null);
    setBusy(true);
    try {
      const result = await submit(code);
      onVerified(result);
    } catch (caught) {
      const reason =
        caught instanceof DeletionApiError ? caught.code : "unknown";
      if (reason === "invalid_code") {
        const attempts = failed + 1;
        setFailed(attempts);
        if (attempts >= MAX_CODE_ATTEMPTS) {
          setLocked(true);
          setError(messageFor("too_many_attempts"));
        } else {
          const left = MAX_CODE_ATTEMPTS - attempts;
          setError(
            `${messageFor("invalid_code")} ${left} ${left === 1 ? "attempt" : "attempts"} left.`,
          );
        }
      } else {
        if (reason === "too_many_attempts") setLocked(true);
        setError(messageFor(reason));
      }
    } finally {
      setBusy(false);
    }
  }

  async function onResend() {
    setError(null);
    setStatus(null);
    const problem = await sendCode(email, purpose);
    if (problem) {
      setError(problem);
      return;
    }
    cooldown.start();
    setCode("");
    setFailed(0);
    setLocked(false);
    setStatus(
      "If an account exists, we've sent a new code. Use the most recent one.",
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-5">
      <StepHeading>{heading}</StepHeading>
      <Notice>
        If an account exists, we&rsquo;ve sent a code to{" "}
        <strong className="font-semibold break-all">{email}</strong>. It can
        take a minute to arrive; check your spam folder too.
      </Notice>

      <div className="space-y-2">
        <label htmlFor={`${id}-code`} className="block text-sm font-medium">
          6-digit code
        </label>
        <Input
          id={`${id}-code`}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          disabled={locked}
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          aria-invalid={error ? true : undefined}
          className="max-w-48 text-center font-mono text-2xl tracking-[0.4em]"
          placeholder="••••••"
        />
      </div>

      {confirmation && (
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            required
            checked={agreed}
            disabled={locked}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
          />
          <span>{confirmation}</span>
        </label>
      )}

      <Honeypot />
      <LiveError message={error} />
      <div aria-live="polite" aria-atomic="true">
        {status && <Notice tone="success">{status}</Notice>}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SubmitButton busy={busy} disabled={locked}>
          {submitLabel}
        </SubmitButton>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <TextButton
            onClick={onResend}
            disabled={cooldown.remaining > 0 || busy}
          >
            {cooldown.remaining > 0
              ? `Resend code in ${cooldown.remaining}s`
              : "Resend code"}
          </TextButton>
          <TextButton onClick={onChangeEmail} disabled={busy}>
            Use a different email
          </TextButton>
        </div>
      </div>
    </form>
  );
}
