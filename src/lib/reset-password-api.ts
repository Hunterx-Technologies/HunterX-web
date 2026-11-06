/**
 * Client for the backend's password-reset endpoint, used by /reset-password
 * when the emailed link opens in a browser instead of the app.
 *
 *   POST {NEXT_PUBLIC_API_URL}/auth/reset-password
 *     { token, newPassword, confirmPassword }
 *   200 { success: true }
 *   400 "Reset link is invalid or has expired…"  (token unknown, used or expired)
 *   400 { error: { code: "WEAK_PASSWORD" } }      (fails the rules below)
 *   429                                           (rate limited)
 *
 * Privacy: only the token and the new password are sent. Nothing here logs
 * request bodies, tokens or passwords.
 */

export type ResetErrorCode =
  | "invalid_token"
  | "weak_password"
  | "rate_limited"
  | "network"
  | "not_configured"
  | "unknown";

export class ResetApiError extends Error {
  constructor(public readonly code: ResetErrorCode) {
    super(code);
    this.name = "ResetApiError";
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

/** Same four rules the backend and the app enforce (isStrongPassword). */
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  { id: "number", label: "One number", test: (p: string) => /[0-9]/.test(p) },
  {
    id: "special",
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const;

export function meetsPasswordRules(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  if (!API_URL) throw new ResetApiError("not_configured");

  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword,
        confirmPassword: newPassword,
      }),
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });
  } catch {
    throw new ResetApiError("network");
  }

  if (response.ok) return;

  let text = "";
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object") {
      const { message, error } = body as {
        message?: unknown;
        error?: { code?: unknown };
      };
      text = [message, error?.code]
        .filter((v): v is string => typeof v === "string")
        .join(" ")
        .toLowerCase();
    }
  } catch {
    // Empty or non-JSON body.
  }

  if (response.status === 429) throw new ResetApiError("rate_limited");
  if (/weak_password|requirements/.test(text))
    throw new ResetApiError("weak_password");
  if (/invalid|expire|token/.test(text))
    throw new ResetApiError("invalid_token");
  throw new ResetApiError("unknown");
}
