import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/config";
import { cn } from "@/lib/utils";
import { AppleLogo, GooglePlayLogo } from "./store-logos";

const STORES: {
  name: string;
  url: string;
  eyebrow: string;
  logo: ReactNode;
}[] = [
  {
    name: "App Store",
    url: APP_STORE_URL,
    eyebrow: "Download on the",
    logo: <AppleLogo className="-mt-0.5" />,
  },
  {
    name: "Google Play",
    url: PLAY_STORE_URL,
    eyebrow: "Get it on",
    logo: <GooglePlayLogo />,
  },
];

/**
 * App store links. A store with no URL in src/config.ts shows a
 * "Coming soon" badge instead of a link.
 */
export function StoreButtons({
  align = "start",
  className,
}: {
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <ul
      aria-label="Download HunterX"
      className={cn(
        "flex flex-wrap gap-3",
        align === "center" && "justify-center",
        className,
      )}
    >
      {STORES.map((store) => (
        <li key={store.name}>
          {store.url ? (
            <a
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 min-w-52 items-center gap-3 rounded-full bg-primary pr-5 pl-2.5 text-primary-foreground shadow-[0_8px_30px_-8px_var(--glow)] transition-[filter,transform] hover:brightness-110 motion-safe:active:scale-[0.98]"
            >
              {/* Black disc so the logo colours stay clear on orange. */}
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-white [&_svg]:size-5">
                {store.logo}
              </span>
              <span className="flex flex-1 flex-col text-left leading-tight">
                <span className="text-[0.7rem] font-medium opacity-80">
                  {store.eyebrow}
                </span>
                <span className="text-base font-bold">{store.name}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
              />
            </a>
          ) : (
            <span className="inline-flex h-14 min-w-52 items-center gap-3 rounded-full border-dashed glass pr-6 pl-5">
              {store.logo}
              <span className="flex flex-col text-left leading-tight">
                <span className="text-[0.7rem] font-medium text-muted-foreground">
                  {store.name}
                </span>
                <span className="text-base font-bold text-primary-text">
                  Coming soon
                </span>
              </span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
