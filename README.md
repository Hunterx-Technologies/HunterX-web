# HunterX Web

Marketing site and legal pages for **HunterX**, a Solo Leveling-style
gamified fitness and habit app. Live at <https://hunterx.co.in>.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, server rendering; no static export)
- React 19 and TypeScript
- Tailwind CSS v4 with CSS-variable design tokens
- Markdown legal content (gray-matter, react-markdown, remark-gfm)
- zod for build-time environment validation
- ESLint, Prettier, husky, lint-staged and commitlint
- Hosted on [Netlify](https://www.netlify.com) with its Next.js runtime

## Prerequisites

- **Node.js 24** (current LTS). The exact major is in `.nvmrc`; run
  `nvm use` to switch.
- **npm 11** (pinned in `package.json` under `packageManager`).

## Setup

```bash
git clone https://github.com/shakthilab/HunterX-web.git
cd HunterX-web
nvm use
npm ci
cp .env.example .env.local   # then edit; point the API at dev/UAT
npm run dev                  # http://localhost:3000
```

`npm ci` also installs the git hooks (via the `prepare` script).

### Environment variables

All variables are listed with comments in [`.env.example`](.env.example)
and validated by [`src/env.ts`](src/env.ts) when `next dev` or `next build`
starts. A missing or malformed required variable stops the build with a
message naming the variable.

| Variable                     | Required | Purpose                                             |
| ---------------------------- | -------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | Yes      | Canonical origin, e.g. `https://hunterx.co.in`      |
| `NEXT_PUBLIC_API_URL`        | Yes      | Backend base URL for the account-deletion endpoints |
| `NEXT_PUBLIC_APP_STORE_URL`  | No       | App Store listing; `""` shows "Coming soon"         |
| `NEXT_PUBLIC_PLAY_STORE_URL` | No       | Google Play listing; `""` shows "Coming soon"       |

`NEXT_PUBLIC_` values are built into the browser bundle. Never put secrets
in them. All `.env*` files except `.env.example` are git-ignored.

## Scripts

| Script                  | What it does                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run dev`           | Start the dev server on <http://localhost:3000>                                                                  |
| `npm run build`         | Production build                                                                                                 |
| `npm run start`         | Serve the production build                                                                                       |
| `npm run lint`          | ESLint (Next.js core-web-vitals + TypeScript rules)                                                              |
| `npm run typecheck`     | Generate route types, then `tsc --noEmit`                                                                        |
| `npm run format`        | Format all files with Prettier                                                                                   |
| `npm run format:check`  | Check formatting without writing                                                                                 |
| `npm run check`         | Lint, typecheck and format check together                                                                        |
| `npm run assets:verify` | Check brand assets and `.well-known` files in `public/` (presence, PNG sizes, valid JSON, leftover placeholders) |
| `npm run assets`        | **Not in this repo.** Generates the brand assets in the HunterX-Mobile repo; copy the output into `public/`      |

### Git hooks

- **pre-commit:** Prettier and ESLint on staged files (lint-staged)
- **commit-msg:** commitlint, [Conventional Commits](https://www.conventionalcommits.org)
  with types `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`, `ci`
- **pre-push:** `npm run typecheck`

There is no automated test suite yet.

## Project structure

```
content/
  privacy.md                Privacy Policy (Markdown + frontmatter)
  terms.md                  Terms of Use (Markdown + frontmatter)
public/                     Favicons, app icons, site.webmanifest, social images
  .well-known/              Deep-link files for iOS and Android
scripts/
  verify-assets.mjs         `npm run assets:verify`
src/
  app/                      Routes (App Router)
    layout.tsx              Site shell, Inter font, boot script
    globals.css             Design tokens (CSS variables) + Tailwind setup
    page.tsx                / (intro, hero, how it works, ranks, download, FAQ)
    privacy/, terms/        Rendered from content/*.md
    legal/                  Index of legal documents
    delete-account/         Public account deletion + cancel (calls the API)
    support/                Contact details
    invite/[code]/          Referral landing page (noindex)
    not-found.tsx, error.tsx
    sitemap.ts, robots.ts
  components/
    ui/                     Small primitives (button, card, chip, section)
    site/                   Header, footer, store buttons, ...
    home/                   Home page sections
    legal/                  Legal page layout, contents, Zen Mode
    account-deletion/       Deletion and cancel flows
  config.ts                 Site URL, store URLs, company, ranks, nav links
  env.ts                    Environment variable schema (zod)
  data/home.tsx             Home page copy: steps, FAQ
  lib/                      Content loading, SEO, ranks, invite, deletion API
next.config.ts              Env validation, security and deep-link headers
netlify.toml                Netlify build, headers and caching
```

## Pages and routes

| Route                                     | Description                                                                  |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| `/`                                       | Home: intro, hero, how it works, ranks, download, FAQ                        |
| `/privacy`                                | Privacy Policy, from `content/privacy.md`                                    |
| `/terms`                                  | Terms of Use, from `content/terms.md`                                        |
| `/legal`                                  | Lists the legal documents with summary and last-updated date                 |
| `/delete-account`                         | Public account deletion and cancellation (no login; required by Google Play) |
| `/support`                                | Contact and support details                                                  |
| `/invite/[code]`                          | Referral landing page; 4–20 letters/digits; `noindex`                        |
| `/.well-known/apple-app-site-association` | iOS Universal Links                                                          |
| `/.well-known/assetlinks.json`            | Android App Links                                                            |
| `/sitemap.xml`, `/robots.txt`             | Generated by `sitemap.ts` and `robots.ts`                                    |

## Editing legal content

The Privacy Policy and Terms live in `content/privacy.md` and
`content/terms.md`. The frontmatter is the only place each document's date
and summary are set:

```markdown
---
title: "Privacy Policy"
updated: "27 October 2026"
summary: "One sentence shown in the highlighted callout and as the meta description."
---

## 1. Introduction

...
```

1. Edit the Markdown. Company name, address, email and site URL elsewhere on
   the site come from `src/config.ts`, not from these files.
2. Update the `updated` date (`27 October 2026` or `2026-10-27`). It is shown
   as "Last updated" and used in the sitemap. The site does not currently
   read a separate `effective` date field.
3. **Send the changed text for legal review before publishing.** Changes to
   `content/*.md` require the code owner's approval (see `.github/CODEOWNERS`).
4. Open a pull request; Netlify deploys on merge to `main`.

Formatting notes:

- Every `##` heading becomes a numbered entry in the "Contents" list and
  gets a linkable id, e.g. `/privacy#9-data-retention`. Keep the
  "N. Title" format.
- GitHub-flavoured Markdown is supported, including tables. A table whose
  header row is empty is shown as a label/value table.
- Plain URLs and email addresses become links automatically.
- Prettier is configured to skip `content/` so legal wording is never
  reformatted automatically.

Legal pages also offer a sticky contents sidebar (desktop), a collapsible
contents card and back-to-top button (mobile), a print stylesheet, and Zen
Mode (larger centred text, Esc exits).

## Design system

- **Tokens** are CSS variables at the top of `src/app/globals.css`
  (`--background`, `--foreground`, `--card`, `--muted`, `--border`,
  `--primary`, `--accent`, `--radius`), all on `:root`.
- **Accent colour** is defined once as `--brand` (`#fe5b01`) and must match
  `palette.orange` in HunterX-Mobile's `theme/colors.ts`.
- **Theme:** dark only; there is no light theme or toggle.
- **Motion** is CSS only and switched off for `prefers-reduced-motion`.
- **Font:** Inter via `next/font`, self-hosted.

### Brand assets

Favicons, app icons, `site.webmanifest`, `safari-pinned-tab.svg`,
`og-image.png` and `twitter-image.png` in `public/` are generated from the
master logo by `npm run assets` in the HunterX-Mobile repo. Don't edit them
by hand; regenerate, copy them in, then run `npm run assets:verify`.
Unpublished source files can be kept locally in `assets/source/raw/` and
`assets/store/raw/`, which are git-ignored.

### Site content

- **Ranks:** `RANKS` in `src/config.ts` (feeds the ranks ladder, FAQ and
  site description).
- **Social links:** `SOCIAL_LINKS` in `src/config.ts` (placeholders; `""`
  hides an icon).
- **Home page steps and FAQ:** `src/data/home.tsx`.

## Account deletion (`/delete-account`)

Public, no login, indexable. It calls the backend's
`/public/account-deletion/*` endpoints directly from the browser using
`NEXT_PUBLIC_API_URL`. The API must allow CORS `POST` with
`Content-Type: application/json` from `https://hunterx.co.in` and any
preview/dev origins.

- **Token mode** (`/delete-account?t=TOKEN`, from the deletion email): the
  token is removed from the address bar on load and never logged.
- **Email mode:** email → 6-digit code → confirm → scheduled date.
- **Cancel:** email → code → cancel.

Backend contract (in `src/lib/account-deletion-api.ts`):

| Endpoint                                      | Body                                       | Success response             |
| --------------------------------------------- | ------------------------------------------ | ---------------------------- |
| `POST /public/account-deletion/request`       | `{ email, purpose: "delete" \| "cancel" }` | any 2xx                      |
| `POST /public/account-deletion/confirm`       | `{ email, otp }`                           | `{ scheduledFor: ISO date }` |
| `POST /public/account-deletion/confirm-token` | `{ token }`                                | `{ scheduledFor: ISO date }` |
| `POST /public/account-deletion/cancel`        | `{ email, otp }`                           | any 2xx                      |

## Deep-link files

`public/.well-known/apple-app-site-association` and
`public/.well-known/assetlinks.json` contain placeholders to replace before
release:

| Placeholder           | File                       | Replace with                                                |
| --------------------- | -------------------------- | ----------------------------------------------------------- |
| `TEAMID`              | apple-app-site-association | Apple Developer Team ID                                     |
| `com.gymgasm.hunterx` | apple-app-site-association | The iOS bundle ID, if different                             |
| `PACKAGE_NAME`        | assetlinks.json            | The Android application ID                                  |
| `SHA256_FINGERPRINT`  | assetlinks.json            | SHA-256 of the app signing key (Play Console > App signing) |

Both are served with `Content-Type: application/json` and no redirects (set
in `next.config.ts` and `netlify.toml`). Do not add redirects that affect
`/.well-known/*`. After deploying:

```bash
curl -sI https://hunterx.co.in/.well-known/apple-app-site-association
curl -sI https://hunterx.co.in/.well-known/assetlinks.json
```

Both must return 200 with `application/json`.

## Deployment (Netlify)

Netlify builds every push to `main` and every pull request (deploy
previews). Settings live in `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** handled by Netlify's Next.js runtime (leave unset)
- **Node version:** read from `.nvmrc`
- **Headers:** security headers, long cache for `/_next/static/*`, JSON
  content type for `/.well-known/*`

Do **not** add `output: 'export'`; the site relies on server rendering.

### Environment variables on Netlify

Set these under **Site configuration > Environment variables** (the build
fails without the required ones):

- `NEXT_PUBLIC_SITE_URL` = `https://hunterx.co.in`
- `NEXT_PUBLIC_API_URL` = the production API URL
- `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_PLAY_STORE_URL` once the app is
  published

Use the "Deploy previews" context to point previews at the UAT API if
needed.

### Domain

1. In Netlify, add `hunterx.co.in` and `www.hunterx.co.in`, and set
   `hunterx.co.in` as the **primary domain** (www then redirects to it).
2. At the DNS provider, change only the root (`@`) **A record** to Netlify's
   load balancer IP (shown on Netlify's domain setup screen) and the `www`
   **CNAME** to the Netlify site's `*.netlify.app` name.
3. Confirm the HTTPS certificate is issued for both names.

> **Keep all other DNS records unchanged:** the `admin`, `api`, `admin-uat`
> and `api-uat` records, all MX records and all TXT records (SPF, DKIM,
> verification). Do not move the nameservers to Netlify DNS unless every one
> of those records is recreated there first.

## Privacy

The site sets no cookies and loads no analytics or third-party scripts.
Browser storage is limited to `localStorage` (Zen Mode) and
`sessionStorage` (intro shown), both strictly functional. Add a consent
banner before introducing analytics or tracking.

## Related repositories

- **HunterX-Mobile**: iOS and Android app; also generates brand assets (_link to be added_)
- **HunterX-Backend**: API at `api.hunterx.co.in` (_link to be added_)
- **HunterX-Admin**: admin dashboard (_link to be added_)

## Contributing

This is a private, proprietary project. To contribute:

1. Branch from `main` and open a pull request; direct pushes to `main` are
   blocked.
2. Use Conventional Commit messages (enforced by the commit hook).
3. Make sure CI passes (lint, format, typecheck, asset check, build) and
   fill in the pull request checklist.
4. Changes to legal content need legal review and the code owner's approval.

Report security issues privately as described in [SECURITY.md](SECURITY.md).

## Licence

Copyright © Hunterx Technologies. All rights reserved. See [LICENSE](LICENSE).
This is not open-source software.
