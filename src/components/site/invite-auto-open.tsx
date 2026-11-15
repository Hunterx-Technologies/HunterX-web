"use client";

import { useEffect } from "react";
import { ANDROID_PACKAGE, APP_SCHEME } from "@/config";

/* ---------------------------------------------------------------------------
 * Opens the HunterX app as soon as the invite page loads, so someone who
 * scans a friend's QR code doesn't have to tap "Open in app".
 *
 * Normally the app opens before this page does (Android App Links / iOS
 * universal links claim /invite/*). This covers the cases where the browser
 * opens anyway, e.g. a QR scanner that always uses its own browser.
 *
 * Android only: Chrome opens the app when it's installed and otherwise loads
 * browser_fallback_url (this page with ?app=0, so it doesn't retry and loop).
 * iOS has no silent equivalent: a custom scheme for an app that isn't
 * installed shows a Safari error, so iOS keeps the button.
 * ------------------------------------------------------------------------- */
export function InviteAutoOpen({ code }: { code: string }) {
  useEffect(() => {
    if (!/android/i.test(navigator.userAgent)) return;

    const url = new URL(window.location.href);
    if (url.searchParams.get("app") === "0") {
      // Back from a failed attempt (app not installed): tidy the address bar.
      url.searchParams.delete("app");
      window.history.replaceState(
        window.history.state,
        "",
        url.pathname + url.search + url.hash,
      );
      return;
    }

    const fallback = new URL(window.location.pathname, window.location.origin);
    fallback.searchParams.set("app", "0");
    window.location.href =
      `intent://invite/${encodeURIComponent(code)}` +
      `#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};` +
      `S.browser_fallback_url=${encodeURIComponent(fallback.toString())};end`;
  }, [code]);

  return null;
}
