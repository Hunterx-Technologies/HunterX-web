import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getLegalDocument } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDocument("terms");
  return pageMetadata({
    title: doc.title,
    description: doc.summary ?? doc.title,
    path: "/terms",
  });
}

export default async function Page() {
  const doc = await getLegalDocument("terms");
  return <LegalPage doc={doc} />;
}
