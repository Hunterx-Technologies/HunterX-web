import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config";
import { getLegalDocument } from "@/lib/content";

// /invite/* pages are personal referral links and are intentionally excluded.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [privacy, terms] = await Promise.all([
    getLegalDocument("privacy"),
    getLegalDocument("terms"),
  ]);
  const legalUpdated = [privacy.updatedIso, terms.updatedIso]
    .filter((date): date is string => Boolean(date))
    .sort()
    .pop();

  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/support`, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${SITE_URL}/delete-account`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/legal`,
      lastModified: legalUpdated,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: privacy.updatedIso,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: terms.updatedIso,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
