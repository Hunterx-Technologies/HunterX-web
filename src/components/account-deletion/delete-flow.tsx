"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { ACCOUNT_DELETION } from "@/config";
import {
  DeletionApiError,
  confirmWithCode,
  confirmWithToken,
  formatScheduledDate,
  type ScheduledDeletion,
} from "@/lib/account-deletion-api";
import {
  Honeypot,
  LiveError,
  Notice,
  StepHeading,
  SubmitButton,
  honeypotFilled,
  messageFor,
} from "./form-parts";
import { CodeStep, EmailStep } from "./otp-steps";

/* ---------------------------------------------------------------------------
 * Token from the email link (?t=...). It is read once, kept only in memory,
 * removed from the address bar straight away, and never logged.
 * ------------------------------------------------------------------------- */
let capturedToken: string | null = null;

function getToken() {
  if (capturedToken === null) {
    const token = new URLSearchParams(window.location.search).get("t");
    if (token) capturedToken = token;
  }
  return capturedToken;
}

const subscribe = () => () => {};

function stripTokenFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("t")) return;
  url.searchParams.delete("t");
  window.history.replaceState(
    window.history.state,
    "",
    url.pathname + (url.search || "") + url.hash,
  );
}

/* ------------------------------------------------------------------------- */

export const DELETED_ITEMS = [
  "your account and profile",
  "your health and activity summaries",
  "your quest history and quest proof photos",
];

export const LOST_ITEMS = [
  "XP, levels and ranks",
  "streaks and badges",
  "unused rewards",
];

export function ScheduledSuccess({ result }: { result: ScheduledDeletion }) {
  const when = result.scheduledFor
    ? `on ${formatScheduledDate(result.scheduledFor)}`
    : `in ${ACCOUNT_DELETION.deletionDays} days`;
  return (
    <div className="space-y-4">
      <StepHeading>Deletion scheduled</StepHeading>
      <Notice tone="success">
        <p className="text-base">
          Your account is scheduled for deletion{" "}
          <strong className="font-semibold">{when}</strong>. Log in to the app
          before then to cancel.
        </p>
      </Notice>
      <p className="text-sm text-muted-foreground">
        You can also cancel using the &ldquo;Cancel a pending deletion&rdquo;
        form on this page.
      </p>
    </div>
  );
}

function TokenConfirm({
  token,
  onDone,
  onInvalid,
}: {
  token: string;
  onDone: (result: ScheduledDeletion) => void;
  onInvalid: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) {
      setError("Tick the box to confirm before continuing.");
      return;
    }
    if (honeypotFilled(event.currentTarget)) return;
    setError(null);
    setBusy(true);
    try {
      onDone(await confirmWithToken(token));
    } catch (caught) {
      const reason =
        caught instanceof DeletionApiError ? caught.code : "unknown";
      if (reason === "invalid_token" || reason === "expired_token") {
        onInvalid();
        return;
      }
      setError(messageFor(reason));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-5">
      <StepHeading autoFocus={false}>Confirm account deletion</StepHeading>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold">What we delete</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-primary-text">
            {DELETED_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">What you lose</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-primary-text">
            {LOST_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <Notice>
        There is a {ACCOUNT_DELETION.deletionDays}-day grace period. Your
        account is deleted at the end of it unless you log in to the app to
        cancel.
      </Notice>

      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          required
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
        />
        <span>
          I understand that my HunterX account and data will be permanently
          deleted after {ACCOUNT_DELETION.deletionDays} days and that my XP,
          streaks and unused rewards will be lost.
        </span>
      </label>

      <Honeypot />
      <LiveError message={error} />
      <SubmitButton busy={busy} busyLabel="Confirming…">
        Confirm deletion
      </SubmitButton>
    </form>
  );
}

type EmailState =
  | { step: "email"; email: string }
  | { step: "code"; email: string; sentAt: number }
  | { step: "done"; result: ScheduledDeletion };

function EmailDeletion({ autoFocusFirst }: { autoFocusFirst: boolean }) {
  const [state, setState] = useState<EmailState>({ step: "email", email: "" });
  const [movedOn, setMovedOn] = useState(false);

  if (state.step === "done") return <ScheduledSuccess result={state.result} />;

  if (state.step === "code") {
    return (
      <CodeStep
        purpose="delete"
        email={state.email}
        sentAt={state.sentAt}
        heading="Step 2 of 2: Enter your code"
        confirmation={
          <>
            I understand that my HunterX account and data will be permanently
            deleted after {ACCOUNT_DELETION.deletionDays} days and that my XP,
            streaks and unused rewards will be lost.
          </>
        }
        submitLabel="Confirm deletion"
        submit={(code) => confirmWithCode(state.email, code)}
        onVerified={(result) => setState({ step: "done", result })}
        onChangeEmail={() => {
          setMovedOn(true);
          setState({ step: "email", email: state.email });
        }}
      />
    );
  }

  return (
    <EmailStep
      purpose="delete"
      heading="Step 1 of 2: Enter your email"
      description="We'll email you a 6-digit code to confirm it's you."
      submitLabel="Send code"
      initialEmail={state.email}
      autoFocusHeading={autoFocusFirst || movedOn}
      onSent={(email, sentAt) => {
        setMovedOn(true);
        setState({ step: "code", email, sentAt });
      }}
    />
  );
}

/**
 * Deletion request. With a valid ?t= token from the deletion email it shows
 * a one-step confirmation; otherwise (or if the token is rejected) it uses
 * email + one-time code.
 */
export function DeleteFlow() {
  const token = useSyncExternalStore(subscribe, getToken, () => null);
  const [tokenState, setTokenState] = useState<"active" | "invalid">("active");
  const [tokenResult, setTokenResult] = useState<ScheduledDeletion | null>(
    null,
  );

  useEffect(() => {
    stripTokenFromUrl();
  }, []);

  if (tokenResult) return <ScheduledSuccess result={tokenResult} />;

  if (token && tokenState === "active") {
    return (
      <TokenConfirm
        token={token}
        onDone={(result) => {
          capturedToken = null;
          setTokenResult(result);
        }}
        onInvalid={() => {
          capturedToken = null;
          setTokenState("invalid");
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {tokenState === "invalid" && (
        <div aria-live="assertive">
          <Notice tone="error">
            {messageFor("invalid_token")} You can still delete your account
            below using your email address.
          </Notice>
        </div>
      )}
      <EmailDeletion autoFocusFirst={tokenState === "invalid"} />
    </div>
  );
}
