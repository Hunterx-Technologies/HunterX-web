import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Mail, Smartphone } from "lucide-react";
import { ACCOUNT_DELETION, COMPANY } from "@/config";
import { deletionMailtoHref } from "@/lib/account-deletion";
import { pageMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/section";
import { PageHeader } from "@/components/site/page-header";
import { DeleteFlow } from "@/components/account-deletion/delete-flow";
import { CancelFlow } from "@/components/account-deletion/cancel-flow";

// Public and indexable: Google Play requires a reachable deletion page.
export const metadata: Metadata = pageMetadata({
  title: "Delete your HunterX account",
  description:
    "Delete your HunterX account and personal data without logging in, or cancel a pending deletion. Deletion takes effect after a 30-day grace period.",
  path: "/delete-account",
  absoluteTitle: true,
});

const linkClass =
  "font-medium text-primary-text underline underline-offset-4 hover:no-underline";

function OtherWays() {
  return (
    <div className="space-y-5">
      <Card as="section" aria-labelledby="in-app-heading" className="p-6">
        <div className="flex items-center gap-2 text-primary-text">
          <Smartphone aria-hidden="true" className="size-5" />
          <h2
            id="in-app-heading"
            className="text-base font-semibold text-foreground"
          >
            In the app
          </h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Go to{" "}
          <span className="font-semibold text-foreground">
            {ACCOUNT_DELETION.inAppPath.join(" > ")}
          </span>{" "}
          and confirm.
        </p>
      </Card>

      <Card as="section" aria-labelledby="help-heading" className="p-6">
        <div className="flex items-center gap-2 text-primary-text">
          <LifeBuoy aria-hidden="true" className="size-5" />
          <h2
            id="help-heading"
            className="text-base font-semibold text-foreground"
          >
            Need help?
          </h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Email{" "}
          <a href={`mailto:${COMPANY.email}`} className={linkClass}>
            {COMPANY.email}
          </a>
          . We acknowledge every message within 3 working days.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">
            Signed in with Apple and hid your email?
          </strong>{" "}
          Codes sent to an Apple relay address may not reach you, so use the
          in-app option, or email us from any address and we&rsquo;ll verify
          your account.
        </p>
        <a
          href={deletionMailtoHref()}
          className={`${linkClass} mt-4 inline-flex items-center gap-2 text-sm`}
        >
          <Mail aria-hidden="true" className="size-4" />
          Email a deletion request
        </a>
      </Card>
    </div>
  );
}

function WhatHappens() {
  return (
    <Card as="section" aria-labelledby="what-happens">
      <h2 id="what-happens" className="text-2xl font-semibold tracking-tight">
        What happens when you delete your account
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-primary-text">
        <li>
          Your account is scheduled for deletion and deleted after a{" "}
          {ACCOUNT_DELETION.deletionDays}-day grace period. Log in to the app
          during that time, or use the form below, to cancel.
        </li>
        <li>
          We then delete your account, profile, health and activity summaries,
          quest history and quest proof photos.
        </li>
        <li>
          Your XP, levels, ranks, streaks, badges and unused rewards are lost
          and cannot be restored.
        </li>
        <li>
          Deleted data may remain in encrypted backups for up to{" "}
          {ACCOUNT_DELETION.backupRetentionDays} more days before it is
          overwritten.
        </li>
        <li>
          We may keep limited records where the law requires it or to prevent
          fraud.
        </li>
        <li>Uninstalling the app does not delete your account.</li>
      </ul>
      <p className="mt-5 text-muted-foreground">
        Full details are in our{" "}
        <Link href="/privacy#10-account-deletion" className={linkClass}>
          Privacy Policy
        </Link>
        .
      </p>
    </Card>
  );
}

export default function DeleteAccountPage() {
  return (
    <Container className="max-w-5xl pb-16">
      <PageHeader eyebrow="Account" title="Delete your HunterX account">
        <p>
          You can delete your account and personal data here without logging in.
          We&rsquo;ll confirm it&rsquo;s you with a code sent to your email.
        </p>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card
          as="section"
          aria-label="Delete your account"
          className="p-6 sm:p-8"
        >
          <DeleteFlow />
        </Card>
        <OtherWays />
      </div>

      <div className="mt-5 grid gap-5">
        <WhatHappens />
        <Card
          as="section"
          id="cancel"
          aria-label="Cancel a pending deletion"
          className="p-6 sm:p-8"
        >
          <CancelFlow />
        </Card>
      </div>
    </Container>
  );
}
