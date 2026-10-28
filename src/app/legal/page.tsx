import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { getLegalDocument, type LegalSlug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/section";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = pageMetadata({
  title: "Legal",
  description: "HunterX Privacy Policy and Terms and Conditions.",
  path: "/legal",
});

const DOCS: { slug: LegalSlug; icon: typeof FileText }[] = [
  { slug: "privacy", icon: ShieldCheck },
  { slug: "terms", icon: FileText },
];

export default async function LegalIndexPage() {
  const docs = await Promise.all(
    DOCS.map(async ({ slug, icon }) => ({
      icon,
      doc: await getLegalDocument(slug),
    })),
  );

  return (
    <Container className="max-w-4xl pb-16">
      <PageHeader eyebrow="Legal" title="Legal documents">
        <p>How HunterX handles your data, and the rules for using the app.</p>
      </PageHeader>

      <ul className="grid gap-5 md:grid-cols-2">
        {docs.map(({ icon: Icon, doc }) => (
          <Card as="li" key={doc.slug} interactive className="flex flex-col">
            <span
              aria-hidden="true"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-primary-text/30 bg-primary/10 text-primary-text"
            >
              <Icon className="size-5" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              {doc.title}
            </h2>
            {doc.summary && (
              <p className="mt-3 flex-1 text-muted-foreground">{doc.summary}</p>
            )}
            {doc.updated && (
              <p className="mt-5 text-sm text-muted-foreground">
                Last updated:{" "}
                <time dateTime={doc.updatedIso} className="text-foreground">
                  {doc.updated}
                </time>
              </p>
            )}
            <Link
              href={`/${doc.slug}`}
              className="mt-5 inline-flex items-center gap-2 font-semibold text-primary-text after:absolute after:inset-0 after:rounded-2xl hover:underline"
            >
              Read
              <span className="sr-only"> the {doc.title}</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Card>
        ))}
      </ul>
    </Container>
  );
}
