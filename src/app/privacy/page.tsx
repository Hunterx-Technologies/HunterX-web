import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getLegalDocument } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDocument("privacy");
  return pageMetadata({
    title: doc.title,
    description: doc.summary ?? doc.title,
    path: "/privacy",
  });
}

export default async function Page() {
  const doc = await getLegalDocument("privacy");
  return <LegalPage doc={doc} />;
}
