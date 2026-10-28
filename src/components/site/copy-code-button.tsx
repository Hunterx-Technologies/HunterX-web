"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "copied" | "failed";

/** Fallback for browsers without the async Clipboard API (or non-HTTPS). */
function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

export function CopyCodeButton({ code }: { code: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy() {
    let ok = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code);
        ok = true;
      } catch {
        ok = legacyCopy(code);
      }
    } else {
      ok = legacyCopy(code);
    }
    setStatus(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <>
      <Button size="lg" onClick={handleCopy}>
        {status === "copied" ? (
          <Check aria-hidden="true" className="size-5" />
        ) : (
          <Copy aria-hidden="true" className="size-5" />
        )}
        {status === "copied" ? "Copied!" : "Copy code"}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" && "Invite code copied to clipboard"}
        {status === "failed" &&
          "Could not copy. Please select the code and copy it manually."}
      </span>
      {status === "failed" && (
        <p className="w-full text-sm text-muted-foreground">
          Could not copy automatically. Select the code above and copy it.
        </p>
      )}
    </>
  );
}
