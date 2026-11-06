"use client";

import { Check, ExternalLink, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { APP_SCHEME } from "@/config";
import {
  PASSWORD_RULES,
  ResetApiError,
  meetsPasswordRules,
  resetPassword,
  type ResetErrorCode,
} from "@/lib/reset-password-api";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Honeypot,
  Input,
  LiveError,
  Notice,
  StepHeading,
  SubmitButton,
  honeypotFilled,
} from "@/components/account-deletion/form-parts";
import { StoreButtons } from "@/components/site/store-buttons";

/* ---------------------------------------------------------------------------
 * Token from the email link (?token=...). Read once, kept only in memory and
 * removed from the address bar straight away, so it does not stay in browser
 * history or get copied along with the URL. Never logged.
 * ------------------------------------------------------------------------- */
let capturedToken: string | null = null;

function getToken() {
  if (capturedToken === null) {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) capturedToken = token;
  }
  return capturedToken;
}

const subscribe = () => () => {};

function stripTokenFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("token")) return;
  url.searchParams.delete("token");
  window.history.replaceState(
    window.history.state,
    "",
    url.pathname + (url.search || "") + url.hash,
  );
}

const FORGOT_PATH = "Login > Forgot password";

function messageFor(code: ResetErrorCode): string {
  switch (code) {
    case "weak_password":
      return "That password doesn't meet the rules below. Please choose a stronger one.";
    case "rate_limited":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "network":
      return "We couldn't reach HunterX. Check your connection and try again.";
    case "not_configured":
      return "Password reset isn't available on the website right now. Please use the HunterX app.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/* ------------------------------------------------------------------------- */

function OpenInApp({ token }: { token: string }) {
  return (
    <a
      href={`${APP_SCHEME}://reset-password?token=${encodeURIComponent(token)}`}
      className={buttonVariants({ variant: "secondary", size: "lg" })}
    >
      Open in the HunterX app
      <ExternalLink aria-hidden="true" className="size-4" />
    </a>
  );
}

function InvalidLink() {
  return (
    <div className="space-y-6">
      <StepHeading autoFocus={false}>
        This reset link has expired or was already used
      </StepHeading>
      <p className="text-muted-foreground">
        Reset links work once and expire after a short time. Request a new one
        in the HunterX app: go to{" "}
        <span className="font-semibold text-foreground">{FORGOT_PATH}</span> and
        enter your email.
      </p>
      <Link
        href="/support"
        className={buttonVariants({ variant: "secondary" })}
      >
        Get support
      </Link>
    </div>
  );
}

function Done() {
  return (
    <div className="space-y-6">
      <Notice tone="success">Your password has been changed.</Notice>
      <StepHeading>You&rsquo;re all set</StepHeading>
      <p className="text-muted-foreground">
        Open HunterX and log in with your email and new password. For your
        security, you&rsquo;ve been signed out on your other devices.
      </p>
      <div>
        <h3 className="text-base font-semibold">Don&rsquo;t have the app?</h3>
        <StoreButtons className="mt-4" />
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  invalid,
  describedBy,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          required
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function ResetForm({
  token,
  onDone,
  onInvalid,
}: {
  token: string;
  onDone: () => void;
  onInvalid: () => void;
}) {
  const ids = useId();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const rulesOk = meetsPasswordRules(password);
  const matches = password === confirm;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    if (honeypotFilled(event.currentTarget)) return;
    if (!rulesOk) {
      setError("Your new password doesn't meet all the rules yet.");
      return;
    }
    if (!matches) {
      setError("The passwords don't match.");
      return;
    }

    setBusy(true);
    try {
      await resetPassword(token, password);
      setPassword("");
      setConfirm("");
      onDone();
    } catch (err) {
      const code = err instanceof ResetApiError ? err.code : "unknown";
      if (code === "invalid_token") {
        onInvalid();
        return;
      }
      setError(messageFor(code));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
      <StepHeading autoFocus={false}>Choose a new password</StepHeading>
      <Honeypot />

      <PasswordField
        id={`${ids}-new`}
        label="New password"
        value={password}
        onChange={setPassword}
        invalid={submitted && !rulesOk}
        describedBy={`${ids}-rules`}
        disabled={busy}
      />

      <ul id={`${ids}-rules`} className="grid gap-2 text-sm sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-2",
                ok ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {ok ? (
                <Check
                  aria-hidden="true"
                  className="size-4 text-primary-text"
                />
              ) : (
                <X aria-hidden="true" className="size-4" />
              )}
              {rule.label}
              <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
            </li>
          );
        })}
      </ul>

      <PasswordField
        id={`${ids}-confirm`}
        label="Confirm new password"
        value={confirm}
        onChange={setConfirm}
        invalid={submitted && !matches}
        disabled={busy}
      />

      <LiveError message={error} />

      <SubmitButton busy={busy} busyLabel="Updating…">
        Update password
      </SubmitButton>
    </form>
  );
}

export function ResetFlow() {
  // undefined while server rendering: the token only exists in the browser's
  // URL, so wait for it instead of flashing the "link expired" message.
  const token = useSyncExternalStore<string | null | undefined>(
    subscribe,
    getToken,
    () => undefined,
  );
  const [state, setState] = useState<"form" | "invalid" | "done">("form");

  useEffect(() => {
    stripTokenFromUrl();
  }, []);

  if (token === undefined) return <div className="min-h-64" aria-busy="true" />;
  if (!token || state === "invalid") return <InvalidLink />;
  if (state === "done") return <Done />;

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          On your phone with HunterX installed? Finish there:
        </p>
        <OpenInApp token={token} />
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        or reset it here
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      <ResetForm
        token={token}
        onDone={() => setState("done")}
        onInvalid={() => setState("invalid")}
      />
    </div>
  );
}
