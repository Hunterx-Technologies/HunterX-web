"use client";

import { ExternalLink, Smartphone } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { ANDROID_PACKAGE, APP_SCHEME } from "@/config";
import { buttonVariants } from "@/components/ui/button";
import { StoreButtons } from "@/components/site/store-buttons";

/* ---------------------------------------------------------------------------
 * The password is reset in the app, never on this page. The page only hands
 * the email link's token (?token=...) to the app: automatically on Android,
 * with a button as the backup everywhere.
 *
 * The token is read once, kept only in memory and removed from the address
 * bar straight away, so it doesn't stay in browser history or get copied
 * along with the URL. Never logged.
 * ------------------------------------------------------------------------- */
let capturedToken: string | null = null;
// ?app=0 marks a return from a failed Android auto-open (see intentUrl), so
// the page doesn't try again and loop.
let autoOpenTried = false;

function getToken() {
  if (capturedToken === null) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) capturedToken = token;
    autoOpenTried = params.get("app") === "0";
  }
  return capturedToken;
}

const subscribe = () => () => {};

function stripTokenFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("token") && !url.searchParams.has("app")) return;
  url.searchParams.delete("token");
  url.searchParams.delete("app");
  window.history.replaceState(
    window.history.state,
    "",
    url.pathname + (url.search || "") + url.hash,
  );
}

type Platform = "android" | "ios" | "other";

function getPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac; touch support tells them apart.
  if (
    /iphone|ipad|ipod/i.test(ua) ||
    (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
  )
    return "ios";
  return "other";
}

function schemeUrl(token: string) {
  return `${APP_SCHEME}://reset-password?token=${encodeURIComponent(token)}`;
}

/**
 * Android intent link: opens the app when it is installed. When it isn't,
 * Chrome loads browser_fallback_url (this page again, marked app=0 so it
 * doesn't retry) instead of showing an error or the Play Store.
 */
function intentUrl(token: string) {
  const fallback = new URL(window.location.pathname, window.location.origin);
  fallback.searchParams.set("token", token);
  fallback.searchParams.set("app", "0");
  return (
    `intent://reset-password?token=${encodeURIComponent(token)}` +
    `#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(fallback.toString())};end`
  );
}

const FORGOT_PATH = "Login > Forgot password";

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold tracking-tight">{children}</h2>;
}

function MissingToken() {
  return (
    <div className="space-y-4">
      <Heading>This reset link is incomplete</Heading>
      <p className="text-muted-foreground">
        Open the reset email on your phone and tap the link again. If it still
        doesn&rsquo;t work, request a new one in the HunterX app:{" "}
        <span className="font-semibold text-foreground">{FORGOT_PATH}</span>.
      </p>
    </div>
  );
}

function OnDesktop() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary-text">
        <Smartphone aria-hidden="true" className="size-5" />
        <Heading>Open this link on your phone</Heading>
      </div>
      <p className="text-muted-foreground">
        Passwords are reset in the HunterX app. Open the reset email on the
        phone where HunterX is installed and tap the link there.
      </p>
    </div>
  );
}

function OnPhone({ token, platform }: { token: string; platform: Platform }) {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Heading>Continue in the HunterX app</Heading>
        <p className="text-muted-foreground">
          {platform === "android"
            ? "HunterX should open by itself. If it didn't, tap the button."
            : "Tap the button to open HunterX and choose your new password."}
        </p>
        <a
          href={platform === "android" ? intentUrl(token) : schemeUrl(token)}
          className={buttonVariants({ size: "lg" })}
        >
          Open in the HunterX app
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </div>

      <div className="space-y-4 border-t pt-8">
        <h3 className="text-base font-semibold">Don&rsquo;t have HunterX?</h3>
        <p className="text-sm text-muted-foreground">
          Install it, then come back to the reset email and tap the link again.
        </p>
        <StoreButtons />
      </div>
    </div>
  );
}

export function ResetFlow() {
  // undefined while server rendering: the token only exists in the browser's
  // URL, so wait for it instead of flashing the "incomplete link" message.
  const token = useSyncExternalStore<string | null | undefined>(
    subscribe,
    getToken,
    () => undefined,
  );
  const platform = useSyncExternalStore<Platform>(
    subscribe,
    getPlatform,
    () => "other",
  );

  useEffect(() => {
    // Android: hand the link to the app straight away when it's installed.
    // Not installed → Chrome comes back here with app=0 and the page stays.
    // iOS has no silent equivalent: opening a custom scheme for an app that
    // isn't installed shows a Safari error, so iOS uses the button (and the
    // email link itself opens the app there via universal links).
    if (token && platform === "android" && !autoOpenTried) {
      autoOpenTried = true;
      window.location.href = intentUrl(token);
    }
    stripTokenFromUrl();
  }, [token, platform]);

  if (token === undefined) return <div className="min-h-40" aria-busy="true" />;
  if (!token) return <MissingToken />;
  if (platform === "other") return <OnDesktop />;
  return <OnPhone token={token} platform={platform} />;
}
