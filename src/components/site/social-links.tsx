import type { ReactNode } from "react";
import { SOCIAL_LINKS, type SocialPlatform } from "@/config";
import { cn } from "@/lib/utils";

const ICONS: Record<SocialPlatform, ReactNode> = {
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
};

/** Icon links to the HunterX social profiles set in src/config.ts. */
export function SocialLinks({ className }: { className?: string }) {
  const links = SOCIAL_LINKS.filter((link) => link.url);
  if (links.length === 0) return null;

  return (
    <ul
      aria-label="HunterX on social media"
      className={cn("flex gap-2", className)}
    >
      {links.map((link) => (
        <li key={link.platform}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`HunterX on ${link.label} (opens in a new tab)`}
            title={link.label}
            className="inline-flex size-10 items-center justify-center rounded-full glass text-muted-foreground transition-colors hover:border-primary-text/60 hover:text-primary-text"
          >
            <span aria-hidden="true" className="size-[18px] [&_svg]:size-full">
              {ICONS[link.platform]}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
