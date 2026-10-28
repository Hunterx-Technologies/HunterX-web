import { APP_SCHEME } from "@/config";

const INVITE_CODE_PATTERN = /^[A-Za-z0-9]{4,20}$/;

export function isValidInviteCode(code: string): boolean {
  return INVITE_CODE_PATTERN.test(code);
}

export function inviteDeepLink(code: string): string {
  return `${APP_SCHEME}://invite/${encodeURIComponent(code)}`;
}
