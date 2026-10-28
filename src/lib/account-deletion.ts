import { ACCOUNT_DELETION, COMPANY } from "@/config";

/**
 * Shared account-deletion logic. When a web request form is added, its API
 * route (e.g. src/app/api/account-deletion/route.ts) can reuse these helpers
 * so the email and form paths stay consistent.
 */

export const DELETION_EMAIL_BODY = [
  "Hello HunterX team,",
  "",
  "Please delete my HunterX account and the personal data associated with it.",
  "",
  "Registered email address: (the address I am sending from)",
  "Username in the app (optional): ",
  "",
  "I understand you may contact me to verify that I own this account.",
  "",
  "Thank you.",
].join("\n");

export function deletionMailtoHref(): string {
  const params = new URLSearchParams({
    subject: ACCOUNT_DELETION.emailSubject,
    body: DELETION_EMAIL_BODY,
  });
  // URLSearchParams encodes spaces as "+", which some mail clients show literally.
  return `mailto:${COMPANY.email}?${params.toString().replace(/\+/g, "%20")}`;
}
