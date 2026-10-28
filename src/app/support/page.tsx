import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { COMPANY, COMPANY_ADDRESS_LINE, SUPPORT } from "@/config";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/section";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = pageMetadata({
  title: "Support",
  description: "Get help with HunterX. Contact our support team by email.",
  path: "/support",
});

const QUICK_LINKS = [
  { href: "/delete-account", label: "Delete your account and data" },
  { href: "/privacy", label: "Read our Privacy Policy" },
  { href: "/#faq", label: "Frequently asked questions" },
];

export default function SupportPage() {
  return (
    <Container className="max-w-4xl pb-16">
      <PageHeader eyebrow="Support" title="How can we help?">
        <p>
          Questions, problems or feedback about HunterX? We are here to help.
        </p>
      </PageHeader>

      <div className="grid gap-5 md:grid-cols-2">
        <Card
          as="section"
          aria-labelledby="contact-heading"
          className="md:col-span-2"
          data-reveal
        >
          <h2
            id="contact-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Contact us
          </h2>
          <p className="mt-3 text-muted-foreground">
            Email{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-medium text-primary-text underline underline-offset-4 hover:no-underline"
            >
              {COMPANY.email}
            </a>
            . We acknowledge every message within{" "}
            <strong className="font-semibold text-foreground">
              {SUPPORT.acknowledgeWithin}
            </strong>
            .
          </p>
          <a
            href={`mailto:${COMPANY.email}`}
            className={buttonVariants({ className: "mt-6" })}
          >
            <Mail aria-hidden="true" className="size-4" />
            Email support
          </a>
        </Card>

        <Card as="section" aria-labelledby="account-heading" data-reveal>
          <h2
            id="account-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Your account and data
          </h2>
          <ul className="mt-4 divide-y">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-4 py-3 font-medium transition-colors hover:text-primary-text"
                >
                  {link.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:text-primary-text motion-safe:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card as="section" aria-labelledby="grievance-heading" data-reveal>
          <h2
            id="grievance-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Grievance officer
          </h2>
          <address className="mt-4 text-muted-foreground not-italic">
            <span className="font-semibold text-foreground">
              {COMPANY.grievanceOfficer}
            </span>
            <br />
            {COMPANY.name}
            <br />
            {COMPANY_ADDRESS_LINE}
            <br />
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-medium text-primary-text underline underline-offset-4 hover:no-underline"
            >
              {COMPANY.email}
            </a>
          </address>
        </Card>
      </div>
    </Container>
  );
}
