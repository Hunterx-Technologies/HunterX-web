/**
 * Client for the backend's public account-deletion endpoints.
 *
 * The base URL comes from NEXT_PUBLIC_API_URL (see .env.example); it is never
 * hard-coded. The browser calls the API directly, so the API must allow CORS
 * from https://hunterx.co.in.
 *
 * CONTRACT ASSUMPTIONS (adjust here if the backend differs):
 *   POST /public/account-deletion/request        { email, purpose }  purpose: "delete" | "cancel"
 *   POST /public/account-deletion/confirm        { email, otp }      -> { scheduledFor }
 *   POST /public/account-deletion/confirm-token  { token }           -> { scheduledFor }
 *   POST /public/account-deletion/cancel         { email, otp }
 * Errors: non-2xx with an optional JSON body { code | error | message }.
 * The scheduled date is read from the first of several common field names.
 *
 * Privacy: only the email address, the one-time code and the token are sent.
 * Nothing here logs request bodies, tokens or codes.
 */

export type DeletionErrorCode =
  | "invalid_code"
  | "expired_code"
  | "too_many_attempts"
  | "invalid_token"
  | "expired_token"
  | "no_pending_deletion"
  | "rate_limited"
  | "network"
  | "not_configured"
  | "unknown";

export class DeletionApiError extends Error {
  constructor(
    public readonly code: DeletionErrorCode,
    public readonly status?: number,
  ) {
    super(code);
    this.name = "DeletionApiError";
  }
}

type Json = Record<string, unknown>;
type Kind = "request" | "code" | "token" | "cancel";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

export const isApiConfigured = Boolean(API_URL);

function errorText(body: Json): string {
  const nested = (
    body.error && typeof body.error === "object" ? body.error : {}
  ) as Json;
  return [
    body.code,
    body.error,
    body.errorCode,
    body.message,
    nested.code,
    nested.message,
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

function mapError(kind: Kind, status: number, body: Json): DeletionErrorCode {
  const text = errorText(body);
  const isToken = kind === "token";

  if (status === 423 || /attempt|locked|too.?many/.test(text))
    return "too_many_attempts";
  if (/expire/.test(text) || status === 410)
    return isToken ? "expired_token" : "expired_code";
  if (
    kind === "cancel" &&
    (/pending|not.?scheduled|no.?deletion/.test(text) || status === 409)
  ) {
    return "no_pending_deletion";
  }
  if (status === 429) return "rate_limited";
  if (
    /invalid|incorrect|wrong|mismatch|not.?found/.test(text) ||
    [400, 401, 403, 404, 422].includes(status)
  ) {
    return isToken ? "invalid_token" : "invalid_code";
  }
  return "unknown";
}

async function post(kind: Kind, path: string, payload: Json): Promise<Json> {
  if (!API_URL) throw new DeletionApiError("not_configured");

  let response: Response;
  try {
    response = await fetch(`${API_URL}/public/account-deletion/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });
  } catch {
    throw new DeletionApiError("network");
  }

  let body: Json = {};
  try {
    const parsed: unknown = await response.json();
    if (parsed && typeof parsed === "object") body = parsed as Json;
  } catch {
    // Empty or non-JSON body is fine.
  }

  if (!response.ok) {
    throw new DeletionApiError(
      mapError(kind, response.status, body),
      response.status,
    );
  }
  return body;
}

const DATE_KEYS = [
  "scheduledFor",
  "scheduledAt",
  "scheduledDeletionAt",
  "scheduledDeletionDate",
  "deletionDate",
  "deleteAt",
  "scheduled_for",
  "scheduled_at",
  "deletion_date",
  "date",
];

/** Finds the scheduled deletion date in a response, if the backend sent one. */
function scheduledDateOf(body: Json): Date | undefined {
  const sources = [body, (body.data ?? {}) as Json];
  for (const source of sources) {
    for (const key of DATE_KEYS) {
      const value = source[key];
      if (typeof value === "string" || typeof value === "number") {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) return date;
      }
    }
  }
  return undefined;
}

export type ScheduledDeletion = { scheduledFor?: Date };

/** Sends a one-time code. Callers show the same message whether or not the account exists. */
export async function requestCode(email: string, purpose: "delete" | "cancel") {
  await post("request", "request", { email, purpose });
}

export async function confirmWithCode(
  email: string,
  code: string,
): Promise<ScheduledDeletion> {
  return {
    scheduledFor: scheduledDateOf(
      await post("code", "confirm", { email, otp: code }),
    ),
  };
}

export async function confirmWithToken(
  token: string,
): Promise<ScheduledDeletion> {
  return {
    scheduledFor: scheduledDateOf(
      await post("token", "confirm-token", { token }),
    ),
  };
}

export async function cancelWithCode(email: string, code: string) {
  await post("cancel", "cancel", { email, otp: code });
}

export function formatScheduledDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
