import { cn } from "@/lib/utils";

/**
 * Store logos for the download buttons.
 * - Apple: Apple's logo is single-colour (no official colour version), so it
 *   uses the current text colour: black on the orange button, white/black
 *   on the glass "Coming soon" badge depending on the theme.
 * - Google Play: the multicolour play triangle in Google's colours.
 */

export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function GooglePlayLogo({ className }: { className?: string }) {
  // Right-pointing triangle split into four coloured facets that meet at P.
  // A = top-left, B = bottom-left, C = tip, T/U = midpoints of AC and BC.
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
    >
      <path
        fill="#4285F4"
        d="M3.6 1.9 13.2 12 3.6 22.1c-.4-.2-.6-.7-.6-1.2V3.1c0-.5.2-1 .6-1.2Z"
      />
      <path
        fill="#34A853"
        d="M3.6 1.9c.4-.2.9-.2 1.4 0l11.4 6.5-3.2 3.6L3.6 1.9Z"
      />
      <path
        fill="#EA4335"
        d="M3.6 22.1 13.2 12l3.2 3.6L5 22.1c-.5.3-1 .3-1.4 0Z"
      />
      <path
        fill="#FBBC04"
        d="m16.4 8.4 3.9 2.2c1.1.6 1.1 2.2 0 2.8l-3.9 2.2-3.2-3.6 3.2-3.6Z"
      />
    </svg>
  );
}
