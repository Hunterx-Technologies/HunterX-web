import Link from "next/link";
import { COMPANY, COMPANY_ADDRESS_LINE, FOOTER_LINKS } from "@/config";
import { Container } from "@/components/ui/section";
import { SocialLinks } from "./social-links";
import { Wordmark } from "./wordmark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-site-chrome className="relative mt-16 border-t">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-primary to-transparent"
      />
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark className="text-2xl" />
            <p className="mt-3 text-sm text-muted-foreground">
              Level up your real life with daily quests, XP, ranks and rewards.
            </p>
            <SocialLinks className="mt-5" />
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-medium text-foreground transition-colors hover:text-primary-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row md:items-end md:justify-between">
          <address className="not-italic">
            <span className="font-semibold text-foreground">
              {COMPANY.name}
            </span>
            <br />
            {COMPANY_ADDRESS_LINE}
            <br />
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-primary-text underline-offset-4 hover:underline"
            >
              {COMPANY.email}
            </a>
          </address>
          <div className="md:text-right">
            <p>
              © {year} {COMPANY.name}
            </p>
            <p className="mt-1 max-w-md">
              HunterX is an independent app and is not affiliated with any other
              game or franchise.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
