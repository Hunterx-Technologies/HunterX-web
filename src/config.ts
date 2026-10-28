/**
 * Central site configuration. Change values here, not in components.
 */

/**
 * Canonical origin, with no trailing slash. Set by NEXT_PUBLIC_SITE_URL,
 * which `src/env.ts` requires at build time.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(
  /\/+$/,
  "",
);

export const SITE_NAME = "HunterX";

/**
 * Store links. PLACEHOLDERS until the app is published: replace with the
 * HunterX listing URLs, e.g.
 *   https://apps.apple.com/app/idXXXXXXXXXX
 *   https://play.google.com/store/apps/details?id=PACKAGE_NAME
 * Override with NEXT_PUBLIC_APP_STORE_URL / NEXT_PUBLIC_PLAY_STORE_URL.
 * Set a URL to "" to show a "Coming soon" badge instead of the button.
 */
export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ?? "https://www.apple.com/app-store/";
export const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ??
  "https://play.google.com/store/search?q=HunterX&c=apps";

/** Custom URL scheme the app registers, used for "Open in app" links. */
export const APP_SCHEME = "hunterx";

export const COMPANY = {
  name: "Hunterx Technologies",
  address: {
    street: "454 Royal Town, Mathigiri",
    city: "Hosur",
    postalCode: "635109",
    country: "India",
  },
  email: "customercare@hunterx.co.in",
  grievanceOfficer: "Balakumaran Ramalingam Muthupalani",
  rewardsPartner: "Gymgasm",
} as const;

export const COMPANY_ADDRESS_LINE = `${COMPANY.address.street}, ${COMPANY.address.city} ${COMPANY.address.postalCode}, ${COMPANY.address.country}`;

/**
 * HunterX ranks, lowest to highest. Used by the ranks section, the FAQ and
 * the site description. `levels` is shown as-is (en dash between numbers).
 */
export const RANKS = [
  { number: 1, name: "Dormant", levels: "1–10" },
  { number: 2, name: "Hollow", levels: "11–20" },
  { number: 3, name: "Phantom", levels: "21–30" },
  { number: 4, name: "Predator", levels: "31–40" },
  { number: 5, name: "Vanguard", levels: "41–50" },
  { number: 6, name: "Shadow", levels: "51–60" },
  { number: 7, name: "Sovereign", levels: "61–70" },
  { number: 8, name: "Monarch", levels: "71–80" },
  { number: 9, name: "Void Ruler", levels: "81–90" },
  { number: 10, name: "Apex Core", levels: "91–100" },
] as const;

export type Rank = (typeof RANKS)[number];

export const TOTAL_LEVELS = 100;

export const SITE_DESCRIPTION = `HunterX is a gamified fitness and habit app. Complete daily quests, earn XP and climb ${RANKS.length} ranks across ${TOTAL_LEVELS} levels, from ${RANKS[0].name} to ${RANKS[RANKS.length - 1].name}. Keep your streak and win rewards.`;

/** Support promises shown on the site. */
export const SUPPORT = {
  acknowledgeWithin: "3 working days",
} as const;

export const ACCOUNT_DELETION = {
  emailSubject: "HunterX Account Deletion Request",
  inAppPath: ["Settings", "Account", "Delete Account"],
  deletionDays: 30,
  backupRetentionDays: 30,
} as const;

/** Main navigation. Hash links point at sections on the home page. */
export const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#ranks", label: "Ranks" },
  { href: "/#faq", label: "FAQ" },
  { href: "/support", label: "Support" },
] as const;

/**
 * Social profiles shown in the footer. PLACEHOLDERS: replace each URL with
 * the HunterX profile. Set a URL to "" to hide that icon.
 */
export const SOCIAL_LINKS = [
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/",
  },
  { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/" },
  { platform: "x", label: "X", url: "https://x.com/" },
] as const;

export type SocialPlatform = (typeof SOCIAL_LINKS)[number]["platform"];

export const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/legal", label: "Legal" },
  { href: "/delete-account", label: "Delete account" },
  { href: "/support", label: "Support" },
] as const;
