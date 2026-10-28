import Link from "next/link";
import { NAV_LINKS } from "@/config";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { Wordmark } from "./wordmark";

export function Header() {
  return (
    <header
      data-site-chrome
      className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl"
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Wordmark />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#download"
            className={buttonVariants({
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            Download
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
