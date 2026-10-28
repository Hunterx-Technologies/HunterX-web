import { z } from "zod";

/**
 * Environment variables the site reads. Validated once, when `next.config.ts`
 * loads (so `next dev` and `next build` fail fast with a readable message).
 *
 * Components read `process.env.NEXT_PUBLIC_*` directly (see `src/config.ts`)
 * because Next.js only inlines those literal references into the browser
 * bundle; this file is not imported by the app, which keeps zod out of it.
 * Keep this schema, `.env.example` and the README in sync.
 */
const httpsUrl = z
  .url({ protocol: /^https?$/ })
  .transform((value) => value.replace(/\/+$/, ""));

/** A store listing URL, or "" to show a "Coming soon" badge. */
const storeUrl = z
  .union([z.literal(""), z.url({ protocol: /^https$/ })])
  .optional();

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: httpsUrl,
  NEXT_PUBLIC_API_URL: httpsUrl,
  NEXT_PUBLIC_APP_STORE_URL: storeUrl,
  NEXT_PUBLIC_PLAY_STORE_URL: storeUrl,
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);
  if (result.success) return result.data;

  const problems = result.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `Invalid or missing environment variables:\n${problems}\n\n` +
      "Copy .env.example to .env.local for local development, or set these " +
      "in Netlify > Site configuration > Environment variables.",
  );
}
