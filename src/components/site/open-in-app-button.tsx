"use client";

import { ExternalLink } from "lucide-react";
import type { MouseEvent } from "react";
import { PLAY_STORE_URL } from "@/config";
import { inviteAndroidIntentLink, inviteDeepLink } from "@/lib/invite";
import { buttonVariants } from "@/components/ui/button";

/**
 * "Open in app" for the invite page. On Android the tap goes to an intent://
 * link instead: in-app browsers such as Google Lens refuse hunterx:// but open
 * the app from an intent:// tap, and fall back to the Play Store when it isn't
 * installed. Everywhere else it stays hunterx://.
 */
export function OpenInAppButton({ code }: { code: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!/android/i.test(navigator.userAgent)) return;
    e.preventDefault();
    window.location.href = inviteAndroidIntentLink(code, PLAY_STORE_URL);
  };

  return (
    <a
      href={inviteDeepLink(code)}
      onClick={onClick}
      className={buttonVariants({ variant: "secondary", size: "lg" })}
    >
      Open in app
      <ExternalLink aria-hidden="true" className="size-4" />
    </a>
  );
}
