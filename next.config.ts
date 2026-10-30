import type { NextConfig } from "next";
import { validateEnv } from "./src/env";

// Fail `next dev` / `next build` early if a required variable is missing.
validateEnv();

// Keep in sync with the "/*" block in netlify.toml.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const jsonHeaders = [
  { key: "Content-Type", value: "application/json" },
  { key: "Cache-Control", value: "public, max-age=3600" },
];

const nextConfig: NextConfig = {
  // Normal server rendering (static HTML export is intentionally not used)
  // so API routes and dynamic pages keep working.
  poweredByHeader: false,
  // Never add or strip trailing slashes, so /.well-known files are served
  // directly with no redirect.
  trailingSlash: false,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/.well-known/apple-app-site-association",
        headers: jsonHeaders,
      },
      { source: "/.well-known/assetlinks.json", headers: jsonHeaders },
    ];
  },
};

export default nextConfig;
