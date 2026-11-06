import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/section";
import { PageHeader } from "@/components/site/page-header";
import { ResetFlow } from "@/components/reset-password/reset-flow";

// Opened from the password-reset email. When HunterX is installed the
// link opens the app instead (apple-app-site-association / assetlinks.json);
// this page is the fallback for browsers, desktops and pasted links.
// Personal, single-use link: never indexed.
export const metadata: Metadata = pageMetadata({
  title: "Reset your HunterX password",
  description: "Choose a new password for your HunterX account.",
  path: "/reset-password",
  noIndex: true,
  absoluteTitle: true,
});

export default function ResetPasswordPage() {
  return (
    <Container className="max-w-2xl pb-24">
      <PageHeader eyebrow="Account" title="Reset your password" />
      <Card className="p-6 sm:p-8">
        <ResetFlow />
      </Card>
    </Container>
  );
}
