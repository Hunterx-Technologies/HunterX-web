"use client";

import { useState } from "react";
import { cancelWithCode } from "@/lib/account-deletion-api";
import { Notice, StepHeading } from "./form-parts";
import { CodeStep, EmailStep } from "./otp-steps";

type CancelState =
  | { step: "email"; email: string }
  | { step: "code"; email: string; sentAt: number }
  | { step: "done" };

/** Cancel a pending deletion: email -> one-time code -> cancelled. */
export function CancelFlow() {
  const [state, setState] = useState<CancelState>({ step: "email", email: "" });
  const [movedOn, setMovedOn] = useState(false);

  if (state.step === "done") {
    return (
      <div className="space-y-4">
        <StepHeading>Deletion cancelled</StepHeading>
        <Notice tone="success">
          <p className="text-base">
            Your pending deletion has been cancelled. Your account will stay
            active.
          </p>
        </Notice>
      </div>
    );
  }

  if (state.step === "code") {
    return (
      <CodeStep
        purpose="cancel"
        email={state.email}
        sentAt={state.sentAt}
        heading="Enter your code"
        confirmation={null}
        submitLabel="Cancel deletion"
        submit={(code) => cancelWithCode(state.email, code)}
        onVerified={() => setState({ step: "done" })}
        onChangeEmail={() => {
          setMovedOn(true);
          setState({ step: "email", email: state.email });
        }}
      />
    );
  }

  return (
    <EmailStep
      purpose="cancel"
      heading="Cancel a pending deletion"
      description="Changed your mind? Enter your email and we'll send a code to cancel. You can also simply log in to the app."
      submitLabel="Send code"
      initialEmail={state.email}
      autoFocusHeading={movedOn}
      onSent={(email, sentAt) => {
        setMovedOn(true);
        setState({ step: "code", email, sentAt });
      }}
    />
  );
}
