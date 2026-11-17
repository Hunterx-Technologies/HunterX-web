import { ANDROID_PACKAGE, APP_SCHEME } from "@/config";

const INVITE_CODE_PATTERN = /^[A-Za-z0-9]{4,20}$/;

export function isValidInviteCode(code: string): boolean {
  return INVITE_CODE_PATTERN.test(code);
}

export function inviteDeepLink(code: string): string {
  return `${APP_SCHEME}://invite/${encodeURIComponent(code)}`;
}

/**
 * Android intent:// link to the invite screen. Unlike hunterx://, in-app
 * browsers (Google Lens, Gmail, Instagram…) hand it to the system when tapped,
 * and Chrome loads `fallbackUrl` when the app isn't installed.
 */
export function inviteAndroidIntentLink(
  code: string,
  fallbackUrl: string,
): string {
  return (
    `intent://invite/${encodeURIComponent(code)}` +
    `#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`
  );
}
